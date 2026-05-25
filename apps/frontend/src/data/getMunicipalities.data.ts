import config from "@/config";
import { municipality } from "@/types/municipality.type";
import { notFound } from "next/navigation";

export default async function getMunicipalities(locale: string): Promise<Array<municipality>> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/municipalities`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
  return res.json();
}