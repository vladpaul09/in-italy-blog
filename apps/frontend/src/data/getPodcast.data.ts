import { notFound } from "next/navigation";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { podcast } from "@/types/podcast.type";

interface RequestParams {
  locale: string;
  podcastSlug: string;
}

interface ResponseData {
  podcast: podcast;
  latestPodcasts: Array<podcast>;
}

export default async function getData({ locale, podcastSlug }: RequestParams): Promise<ResponseData> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/podcast/${podcastSlug}`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
