import { NextRequest } from "next/server";
import provincesEntries from "@/entries/provinces.entry";
import { notFound } from "next/navigation";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";

export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const searchParams = request.nextUrl.searchParams;
  const queryRegionCode = searchParams.get("regionCode");
  const queryProvinceCode = searchParams.get("provinceCode");

  if (queryRegionCode && queryProvinceCode) {
    const apiUrl = `${config.serverNameBackend}/api/website/${locale}/recent-province-events/${queryProvinceCode}`;
    const res = await fetch(apiUrl, { next: { revalidate: 0 } });
    if (res.status === 404) return notFound();
    if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
    const data = await res.json();
    return Response.json({
      posts: data,
      provinces: Object.entries(provincesEntries)
        .map(([key, value]) => ({ ...value, provinceCode: key }))
        .filter(({ regionCode }) => regionCode === queryRegionCode),
    });
  }
  if (queryRegionCode) {
    const apiUrl = `${config.serverNameBackend}/api/website/${locale}/recent-region-events/${queryRegionCode}`;
    const res = await fetch(apiUrl, { next: { revalidate: 0 } });
    if (res.status === 404) return notFound();
    if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
    const data = await res.json();
    return Response.json({
      posts: data,
      provinces: Object.entries(provincesEntries)
        .map(([key, value]) => ({ ...value, provinceCode: key }))
        .filter(({ regionCode }) => regionCode === queryRegionCode),
    });
  }
  return notFound();
}
