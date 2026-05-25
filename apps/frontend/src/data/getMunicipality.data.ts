import { notFound } from "next/navigation";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { municipality } from "@/types/municipality.type";
import { category, categoryRegional } from "@/types/category.type";
import { mapPosts } from "@/types/mapPostData.type";

interface RequestParams {
  regionSlug: string;
  provinceSlug: string;
  municipalitySlug: string;
  locale: string;
}

interface ResponseData {
  municipality: municipality;
  categoriesArticles: Array<categoryRegional>;
  categoriesEvents: Array<category>;
  mapPosts: Array<mapPosts>;
}

export default async function getData({ regionSlug, provinceSlug, municipalitySlug, locale }: RequestParams): Promise<ResponseData> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/${regionSlug}/${provinceSlug}/${municipalitySlug}`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
