import config from "@/config";
import { article } from "@/types/article.type";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { notFound } from "next/navigation";

export async function getLatestStaticArticles(locale: string): Promise<Array<article>> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/latest-articles`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}