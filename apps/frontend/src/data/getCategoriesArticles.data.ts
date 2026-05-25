import config from "@/config";
import { categoryBase } from "@/types/category.type";
import { notFound } from "next/navigation";

export default async function getCategoriesArticles(locale: string): Promise<Array<categoryBase>> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/categories-articles`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchRevalidate } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
  return res.json();
}