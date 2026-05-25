import { notFound } from "next/navigation";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";

export const revalidate = 0;

export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/municipalities-search`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return Response.json(await res.json());
}
