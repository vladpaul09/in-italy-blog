import config from "@/config";
import { region } from "@/types/region.type";
import { notFound } from "next/navigation";

export default async function getRegions(locale: string): Promise<Array<region>> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/regions`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
  return res.json();
}