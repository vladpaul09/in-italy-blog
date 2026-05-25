import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { mapPosts } from "@/types/mapPostData.type";
import { podcast } from "@/types/podcast.type";
import { article } from "@/types/article.type";

type homepageBoxType = {
  name: string;
  image: string | null;
  url: string;
};

interface HomepageDataResponse {
  mapPosts: Array<mapPosts>;
  homepageTopBoxOne: homepageBoxType;
  homepageTopBoxTwo: homepageBoxType;
  homepageTopBoxThree: homepageBoxType;
  homepageTopBoxFour: homepageBoxType;
  homepageTopBoxFive: homepageBoxType;
  homepageBottomBoxes: Array<homepageBoxType>;
  defaultPodcast?: podcast;
  newsArticles: Array<article>;
  latestPodcasts: Array<podcast>;
  homepageHeaderImage: {
    src: string;
    mobileSrc?: string;
    link?: string;
  };
}

export default async function getData(locale: string): Promise<HomepageDataResponse> {
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/homepage-data`;
  const res = await fetch(apiUrl, { next: { revalidate: config.fetchHomepageRevalidate } });
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
}
