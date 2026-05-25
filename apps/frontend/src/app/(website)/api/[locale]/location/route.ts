import { NextRequest } from "next/server";
import { pointInMultiPolygon, pointInPolygon } from "@/utils/geocode/geojson-utils";
//import geoJSONparse from "@/utils/geocode/geojsonParse";
import regionsEntries from "@/entries/regions.entry";
import provincesEntries from "@/entries/provinces.entry";
// import municipalitiesEntries from "@/entries/municipalities.entry";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";

export async function GET(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { searchParams } = request.nextUrl;

  const lat = searchParams.get("lat");
  const long = searchParams.get("long");

  // let found = false;
  let region: string | null = null;
  let province: string | null = null;
  // let municipality = null;

  if (!lat || !long || isNaN(parseFloat(lat)) || isNaN(parseFloat(long))) {
    return Response.json({ message: "Invalid coordinates" }, { status: 400 });
  }

  Object.entries(regionsEntries).some(([regionKey, regionValue]: [key: string, provinceValue: any]) => {
    const regionOk =
      regionValue.type === "Polygon"
        ? pointInPolygon({ type: "Point", coordinates: [parseFloat(lat), parseFloat(long)] }, regionValue)
        : pointInMultiPolygon({ type: "Point", coordinates: [parseFloat(lat), parseFloat(long)] }, regionValue);
    if (regionOk) {
      region = regionKey;

      Object.entries(provincesEntries)
        .filter((item) => item[1].regionCode === regionKey)
        .some(([provinceKey, provinceValue]: [key: string, provinceValue: any]) => {
          const provinceOk =
            provinceValue.type === "Polygon"
              ? pointInPolygon({ type: "Point", coordinates: [parseFloat(lat), parseFloat(long)] }, provinceValue)
              : pointInMultiPolygon({ type: "Point", coordinates: [parseFloat(lat), parseFloat(long)] }, provinceValue);
          if (provinceOk) {
            province = provinceKey;

            // Object.entries(municipalitiesEntries)
            //   .filter((item) => item[1].provinceCode === provinceKey)
            //   .some(([municipalityKey, municipalityValue]: [key: string, municipalityValue: any]) => {
            //     const municipalityOk =
            //       municipalityValue.coordinates.type === "Polygon"
            //         ? pointInPolygon({ type: "Point", coordinates: [parseFloat(long), parseFloat(lat)] }, geoJSONparse(municipalityValue.coordinates))
            //         : pointInMultiPolygon(
            //             { type: "Point", coordinates: [parseFloat(long), parseFloat(lat)] },
            //             geoJSONparse(municipalityValue.coordinates)
            //           );
            //     if (municipalityOk) {
            //       municipality = municipalityKey;
            //       found = true;
            //       return true;
            //     } else {
            //     }
            //   });
            return true;
          }
        });

      return true;
    }
  });

  const res = await fetch(`${config.serverNameBackend}/api/website/${locale}/recent-posts/${lat}/${long}`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(fetchTextDebug(res.url, res.status, res.statusText));
  }

  const { categoriesArticles, categoriesEvents, newsArticles, municipalityData } = await res.json();

  return Response.json(
    {
      categoriesEvents: categoriesEvents,
      categoriesArticles: categoriesArticles,
      newsArticles: newsArticles,
      municipalityData: municipalityData,
      region: region,
      province: province,
      // municipality: municipality,
    },
    { status: 200 }
  );

  // return Response.json({ message: "Coordinates not found" }, { status: 404 });
}
