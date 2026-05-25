import { article } from "./article.type";
import { event } from "./event.type";
import infoPostType from "./infoPost.type";
import { podcast } from "./podcast.type";
import CategoryPageView from "@/entries/categoryPageView.entry";

export type categoryBase = {
  id: number;
  slug: string;
  image: string;
  mobileImage: string;
  parentId: number;
  name: string;
  pageView: CategoryPageView;
  description: string;
};

export type category = categoryBase & {
  articles?: Array<article>;
  podcasts?: Array<podcast>;
  events?: Array<event>;
};

export type categoryWithInfoPosts = categoryBase & {
  infoPosts: Array<infoPostType>;
};

export type categoryRegional = category & {
  subcategories: Array<category>;
};
