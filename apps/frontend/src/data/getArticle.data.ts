import { notFound } from "next/navigation";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { municipality } from "@/types/municipality.type";
import { article } from "@/types/article.type";

interface RequestParams {
  locale: string;
  articleSlug: string;
}

interface ResponseData {
  article: article;
  latestArticles: Array<article>;
  municipality?: municipality;
}

export default async function getData({ locale, articleSlug }: RequestParams): Promise<ResponseData> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/article/${articleSlug}`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
