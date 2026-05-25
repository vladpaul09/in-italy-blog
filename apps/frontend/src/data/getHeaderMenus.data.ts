import config from "@/config";
import { headerMenu } from "@/types/headerMenu";
import fetchTextDebug from "@/utils/fetchTextDebug";

export default async function getHeaderMenus(locale: string): Promise<Array<headerMenu>> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/menus`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
