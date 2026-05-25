import { province } from "./province.type";

export type municipality = {
  id: string;
  slug: string;
  image: string;
  mobileImage: string;
  province: province;
  latitude: string;
  longitude: string;
  radius: number;
  radiusUnit: string;
  name: string;
  description: string;
}

export type municipalityResponse = {
  municipalitySlug: string;
}