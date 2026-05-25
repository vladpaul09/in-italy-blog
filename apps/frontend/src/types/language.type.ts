export type language = {
  languageId: string;
  name: string;
  description: string | null;
}

export type locale = {
  id: string;
  name: string;
  default: boolean;
  image: string;
  sortOrder: number;
}
