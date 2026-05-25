import { notFound } from "next/navigation";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { province } from "@/types/province.type";
import { category, categoryRegional } from "@/types/category.type";

interface RequestParams {
  regionSlug: string;
  provinceSlug: string;
  locale: string;
}

interface ResponseData {
  categoriesArticles: Array<categoryRegional>;
  categoriesEvents: Array<category>;
  province: province;
}

export default async function getData({ regionSlug, provinceSlug, locale }: RequestParams): Promise<ResponseData> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/${regionSlug}/${provinceSlug}`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
