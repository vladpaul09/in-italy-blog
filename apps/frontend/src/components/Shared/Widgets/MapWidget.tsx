"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { mapPosts } from "@/types/mapPostData.type";

const LeafletMapWidget = dynamic(() => import("./LeafletMapWidget"), {
  ssr: false,
  loading: () => <Skeleton animation="wave" variant="rectangular" width="100%" height="710px" />,
});

interface Props {
  locale: string;
  mapPosts: Array<mapPosts>;
  defaultLatitude?: string;
  defaultLongitude?: string;
  defaultZoom?: number;
}

const MapWidget: FC<Props> = ({ locale, mapPosts, defaultLatitude, defaultLongitude, defaultZoom }) => {
  return <LeafletMapWidget locale={locale} mapPosts={mapPosts} defaultLatitude={defaultLatitude} defaultLongitude={defaultLongitude} defaultZoom={defaultZoom} />;
};

export default MapWidget;
