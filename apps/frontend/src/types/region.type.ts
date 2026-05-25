import { language } from "./language.type";
import { provinceResponse } from "./province.type";

export type region = {
  id: string;
  slug: string;
  image: string;
  mobileImage: string;
  name: string;
  description: string
}

export type regionResponse = {
  regionSlug: string;
  provincesSlugs: provinceResponse[];
}