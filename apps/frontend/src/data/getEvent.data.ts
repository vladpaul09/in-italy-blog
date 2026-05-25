import { notFound } from "next/navigation";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { municipality } from "@/types/municipality.type";
import { event } from "@/types/event.type";

interface RequestParams {
  locale: string;
  eventSlug: string;
}

interface ResponseData {
  event: event;
  latestEvents: Array<event>;
  municipality?: municipality;
}

export default async function getData({ locale, eventSlug }: RequestParams): Promise<ResponseData> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/event/${eventSlug}`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
