import config from "@/config";
import {category, categoryRegional } from "@/types/category.type";
import { region } from "@/types/region.type";
import { notFound } from "next/navigation";

interface RequestParams {
  regionSlug: string;
  locale: string; 
}

interface ResponseData {
  categoriesArticles: Array<categoryRegional>;
  categoriesEvents: Array<category>;
  region: region;
}

export default async function getData({regionSlug, locale}: RequestParams): Promise<ResponseData> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/${regionSlug}`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
  return res.json();
}