"use client";

import { FC, useEffect, useState, Dispatch, SetStateAction, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import useSWR, { Fetcher } from "swr";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Polygon, useMap, Marker, Popup, Tooltip } from "react-leaflet";
import regionsEntries from "@/entries/regions.entry";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SatelliteIcon from "@mui/icons-material/Satellite";
import homepageMapStateEventBus from "@/rxjs/homepageMapState.eventbus";
import { mapPosts } from "@/types/mapPostData.type";
import homepageMapEventsEventBus from "@/rxjs/homepageMapEvents.eventbus";
import delayClientRequest from "@/utils/delayClientRequest.util";
import fetchTextDebug from "@/utils/fetchTextDebug";
import CircularProgress from "@mui/material/CircularProgress";
import LaunchIcon from "@mui/icons-material/Launch";
import userLocationCoordinatesEventBus from "@/rxjs/userLocationCoordinates.eventbus";
import apiLocationUrl from "@/utils/apiLocationUrl.util";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { tag } from "@/types/tag.type";

L.Icon.Default.mergeOptions({
  iconUrl: "/statics/images/map-markers/marker-icon.png",
  iconRetinaUrl: "/statics/images/map-markers/marker-icon-2x.png",
  shadowUrl: "/statics/images/map-markers/marker-shadow.png",
});

const userIcon = L.icon({
  iconUrl: "/statics/images/map-markers/pallinino.webp",
  iconRetinaUrl: "/statics/images/map-markers/pallinino-2x.webp",
  shadowUrl: "/statics/images/map-markers/marker-shadow.png",
  iconSize: [34, 34],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Helper function to get distinct tags from posts
const getDistinctTags = (posts: Array<mapPosts>): Array<tag> => {
  return posts.reduce((uniqueTags, post) => {
    post.tags.forEach((tag) => {
      if (!uniqueTags.find((t) => t.id === tag.id)) {
        uniqueTags.push(tag);
      }
    });
    return uniqueTags;
  }, [] as Array<tag>);
};

type coordinates = Array<LatLngExpression> | Array<Array<LatLngExpression>> | Array<Array<Array<LatLngExpression>>>;
type provinceType = Array<{ coordinates: number[][][]; regionCode: string; provinceCode: string }>;

interface iProvincePolygons {
  provinces: provinceType;
  center: LatLngExpression;
  posts: Array<mapPosts>;
  selectedRegion: string;
  selectedProvince?: string;
  isLoading: boolean;
}

interface iMapState {
  selectedRegion?: string;
  selectedProvince?: string;
  center: LatLngExpression;
}

const defaultMapCenter: LatLngExpression = [41.902782, 12.496366];
const defaultMapZoom = 6;
const regionMapZoom = 8;
const defaultMapZoomUserLocation = 10;
const fillRegionOptions = { fillColor: "transparent", color: "#1e3952", weight: 1 };
const fillProvinceOptions = { fillColor: "#1e3952", color: "#1e3952", weight: 1 };

const urlBuildRegionProvince = (locale: string, regionCode: string, provinceCode: string) => {
  return `/api/${locale}/map/homepage-map-data?regionCode=${regionCode}&provinceCode=${provinceCode}`;
};

const urlBuildRegion = (locale: string, regionCode: string) => {
  return `/api/${locale}/map/homepage-map-data?regionCode=${regionCode}`;
};

const fetcherEvents: Fetcher<{ posts: Array<mapPosts>; provinces: provinceType }, string> = (url: string) =>
  delayClientRequest(500).then(() =>
    fetch(url, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(fetchTextDebug(url, response.status, response.statusText));
    })
  );

const fetcherUserLocation: Fetcher<{ region: string; province: string; municipality: string }, string> = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(fetchTextDebug(url, response.status, response.statusText));
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch location data");
  }
};

const MapLegend: FC<{ tags: Array<tag>; selectedTags: Array<boolean>; setSelectedTags: Dispatch<SetStateAction<Array<boolean>>> }> = ({
  tags,
  selectedTags,
  setSelectedTags,
}) => {
  if (tags.length === 0) {
    return null;
  }

  const handleTagToggle = (index: number, checked: boolean) => {
    const newSelectedTags = [...selectedTags];
    newSelectedTags[index] = checked;
    setSelectedTags(newSelectedTags);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        bottom: 10,
        left: 10,
        zIndex: 1000,
        p: 1,
        overflow: "auto",
      }}
    >
      <Stack direction="column" spacing={1}>
        {tags.map((tag, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox checked={selectedTags[index]} onChange={(e) => handleTagToggle(index, e.target.checked)} size="small" sx={{ px: 1, py: 0 }} />
            }
            label={
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                {tag.markerImage && <img src={tag.markerImage} alt={tag.name} width="15" height="24" />}
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {tag.name}
                </Typography>
              </Stack>
            }
          />
        ))}
      </Stack>
    </Paper>
  );
};

const ProvincePolygons: FC<iProvincePolygons> = ({ posts, selectedRegion, selectedProvince, provinces, center, isLoading }) => {
  useEffect(() => {
    homepageMapEventsEventBus.next(posts);
  }, [posts, selectedRegion, selectedProvince]);

  return (
    <>
      {provinces.map((province, index) => (
        <Polygon
          key={index}
          pathOptions={fillProvinceOptions}
          positions={province.coordinates as coordinates}
          eventHandlers={{
            click: (_event) => {
              if (!isLoading) {
                homepageMapStateEventBus.next({
                  selectedRegion: selectedRegion,
                  selectedProvince: province.provinceCode,
                  center: center,
                  zoom: regionMapZoom,
                });
              }
            },
          }}
        />
      ))}
    </>
  );
};

const FlyToMap: FC<{ setState: Dispatch<SetStateAction<iMapState>> }> = ({ setState }) => {
  const map = useMap();

  useEffect(() => {
    const subscription = homepageMapStateEventBus.subscribe((data) => {
      setState((prevState) => ({
        ...prevState,
        selectedRegion: data.selectedRegion,
        selectedProvince: data.selectedProvince,
        center: data.center as LatLngExpression,
        zoom: data.zoom,
      }));
      map.flyTo(data.center as LatLngExpression, data.zoom);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
};

const LeafletMapWidget: FC<{
  locale: string;
  mapPosts: Array<mapPosts>;
  defaultLatitude?: string;
  defaultLongitude?: string;
  defaultZoom?: number;
}> = ({ locale, mapPosts, defaultLatitude, defaultLongitude, defaultZoom }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  // Use default coordinates as initial center if available, otherwise use default
  const initialCenter =
    defaultLatitude && defaultLongitude ? ([parseFloat(defaultLatitude), parseFloat(defaultLongitude)] as LatLngExpression) : defaultMapCenter;

  // Use defaultZoom if default coordinates are provided, otherwise use default zoom
  const initialZoom = defaultLatitude && defaultLongitude && defaultZoom ? defaultZoom : defaultMapZoom;

  const [state, setState] = useState<iMapState>({ selectedRegion: undefined, selectedProvince: undefined, center: initialCenter });

  const { selectedRegion, selectedProvince, center } = state;
  const [coords, setCoords] = useState<[number, number] | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    selectedRegion && selectedProvince
      ? urlBuildRegionProvince(locale, selectedRegion, selectedProvince)
      : selectedRegion
        ? urlBuildRegion(locale, selectedRegion)
        : null,
    fetcherEvents,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: dataUserLocation } = useSWR(coords ? apiLocationUrl(locale, coords[0], coords[1]) : null, fetcherUserLocation, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 2,
  });

  const { region: regionUserLocation, province: provinceUserLocation } = dataUserLocation || {};

  // Compute distinct tags from current posts
  const distinctTags = useMemo(() => {
    const currentPosts = selectedRegion && data?.posts ? data.posts : mapPosts;
    return getDistinctTags(currentPosts);
  }, [selectedRegion, data?.posts, mapPosts]);

  const [selectedTags, setSelectedTags] = useState<Array<boolean>>(distinctTags.map((_tag) => true));

  useEffect(() => {
    if (regionUserLocation && provinceUserLocation && coords) {
      homepageMapStateEventBus.next({
        selectedRegion: regionUserLocation,
        selectedProvince: provinceUserLocation,
        center: [coords[0], coords[1]] as LatLngExpression,
        zoom: defaultMapZoomUserLocation,
      });
    }
  }, [regionUserLocation, provinceUserLocation, coords]);

  useEffect(() => {
    const subscription = userLocationCoordinatesEventBus.subscribe((coords) => {
      if (coords.latitude && coords.longitude && !defaultLatitude && !defaultLongitude && !defaultZoom) {
        setCoords([coords.latitude, coords.longitude]);
      }
    });
    return () => subscription.unsubscribe();
  }, [setCoords]);

  return (
    <Box className="global-border-radius" sx={{ p: 0, m: 0, width: "100%", height: "710px" }}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={!isSmallScreen}
        className="global-border-radius"
        style={{
          width: "100%",
          height: "710px",
          position: "relative",
          zIndex: 9,
          cursor: isLoading ? "wait" : "default",
        }}
      >
        <FlyToMap setState={setState} />
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Button
          variant="contained"
          onClick={() => {
            homepageMapEventsEventBus.next(mapPosts);
            homepageMapStateEventBus.next({ selectedRegion: undefined, selectedProvince: undefined, center: initialCenter, zoom: initialZoom });
          }}
          sx={{ backgroundColor: "#fff", position: "absolute", top: 10, right: 10, zIndex: 1000 }}
        >
          <SatelliteIcon />
        </Button>
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1000,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              cursor: "loading",
            }}
          >
            <CircularProgress sx={{ color: "#fff", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </Box>
        )}
        <MapLegend tags={distinctTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        {Object.entries(regionsEntries).map(([key, value]) => (
          <Polygon
            pathOptions={fillRegionOptions}
            key={key}
            positions={value.coordinates as coordinates}
            eventHandlers={{
              click: (_event) => {
                if (!isLoading) {
                  homepageMapStateEventBus.next({
                    selectedRegion: key,
                    center: value.center as LatLngExpression,
                    selectedProvince: undefined,
                    zoom: regionMapZoom,
                  });
                }
              },
            }}
          />
        ))}

        {/* Display default posts as markers when no region is selected */}
        {!selectedRegion &&
          mapPosts
            .filter((post) =>
              post.tags.map((tag) => selectedTags[distinctTags.findIndex((distinctTag) => tag.slug === distinctTag.slug)]).includes(true)
            )
            .map((post, index) => {
              const markerIcon = post.markerImage
                ? L.icon({
                    iconUrl: post.markerImage,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowUrl: "/statics/images/map-markers/marker-shadow.png",
                    shadowSize: [41, 41],
                  })
                : undefined;

              return (
                <Marker key={index} position={[parseFloat(post.latitude), parseFloat(post.longitude)]} icon={markerIcon}>
                  <Popup>
                    {post.title}
                    <IconButton component={Link} href={post.url} sx={{ ml: 1 }}>
                      <LaunchIcon />
                    </IconButton>
                  </Popup>
                  <Tooltip>{post.title}</Tooltip>
                </Marker>
              );
            })}

        {coords && <Marker position={coords} icon={userIcon} />}

        {selectedRegion && data && center ? (
          <>
            <ProvincePolygons
              selectedRegion={selectedRegion}
              selectedProvince={selectedProvince}
              center={center}
              provinces={data.provinces}
              posts={data.posts}
              isLoading={isLoading}
            />
            {data.posts
              .filter((post) =>
                post.tags.map((tag) => selectedTags[distinctTags.findIndex((distinctTag) => tag.slug === distinctTag.slug)]).includes(true)
              )
              .map((post, index) => {
                const markerIcon = post.markerImage
                  ? L.icon({
                      iconUrl: post.markerImage,
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      tooltipAnchor: [16, -28],
                      shadowUrl: "/statics/images/map-markers/marker-shadow.png",
                      shadowSize: [41, 41],
                    })
                  : undefined;

                return (
                  <Marker key={index} position={[parseFloat(post.latitude), parseFloat(post.longitude)]} icon={markerIcon}>
                    <Popup>
                      {post.title}
                      <IconButton component={Link} href={post.url} sx={{ ml: 1 }}>
                        <LaunchIcon />
                      </IconButton>
                    </Popup>
                    <Tooltip>{post.title}</Tooltip>
                  </Marker>
                );
              })}
          </>
        ) : null}
      </MapContainer>
    </Box>
  );
};

export default LeafletMapWidget;
