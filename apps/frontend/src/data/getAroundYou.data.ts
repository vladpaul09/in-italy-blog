import { notFound } from "next/navigation";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { municipality } from "@/types/municipality.type";
import { article } from "@/types/article.type";
import { category, categoryRegional } from "@/types/category.type";

interface ResponseData {
  categoriesArticles: Array<categoryRegional>;
  categoriesEvents: Array<category>;
  newsArticles: Array<article>;
  municipalityData: municipality;
}

export default async function getData(locale: string, municipalitySlug: string, lat: string, long: string, datetime: string): Promise<ResponseData> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/around-you/${municipalitySlug}/${lat}/${long}/${datetime}`;
  const res = await fetch(apiUrl, { next: { revalidate: 0 } });
  if (res.status === 404 || res.status === 422) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
