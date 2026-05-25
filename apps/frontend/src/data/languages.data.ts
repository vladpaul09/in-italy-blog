import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { locale } from "@/types/language.type";

export default async function getData(): Promise<Array<locale>> {
  const apiUrl = `${config.serverNameBackend}/api/website/languages`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
