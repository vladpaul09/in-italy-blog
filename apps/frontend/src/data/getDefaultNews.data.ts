import config from "@/config";
import { article } from "@/types/article.type";
import fetchTextDebug from "@/utils/fetchTextDebug";

interface ResponseData {
  newsArticles: Array<article>;
}

const getDefaultNews = async (locale: string): Promise<ResponseData> => {
  const url = `${config.serverNameBackend}/api/website/${locale}/news`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(fetchTextDebug(url, res.status, res.statusText));
  }
  return res.json();
};

export default getDefaultNews;
