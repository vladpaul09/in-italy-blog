import { language } from "./language.type";
import { municipalityResponse } from "./municipality.type";
import { region } from "./region.type";

export type province = {
  id: string;
  slug: string;
  image: string;
  mobileImage: string;
  region: region;
  name: string;
  description: string
}

export type provinceResponse = {
  provinceSlug: string;
  municipalitiesSlugs: municipalityResponse[]
}