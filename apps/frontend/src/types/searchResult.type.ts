export interface searchResult {
  id: number;
  slug: string;
  title: string;
  image: string;
  mobileImage: string;
  url: string;
  type: "category" | "article" | "event" | "podcast";
}

export interface searchResponse {
  results: Array<searchResult>;
  total: number;
}

