import { tag } from "./tag.type";

export type mapPosts = {
  type: "article" | "event" | "podcast";
  title: string;
  url: string;
  slug: string;
  image: string;
  mobileImage: string;
  description: string;
  markerImage: string | null;
  tags: Array<tag>;
  latitude: string;
  longitude: string;
  startDate?: string;
  endDate?: string;
};

