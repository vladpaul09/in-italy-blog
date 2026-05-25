import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";

interface ResponseData {
  [key: string]: string;
}

export default async function getStaticStrings(locale: string): Promise<ResponseData> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/translations`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}