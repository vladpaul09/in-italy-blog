import HeaderMenuType from "@/entries/headerMenuType.entry";

export type headerMenu = {
  id: number;
  parentId: number | null;
  slug: string;
  url: string;
  icon?: {
    src: string;
    title: string;
  } | null;
  type: HeaderMenuType;
  position: number;
  title: string;
  children: Array<headerMenu>;
};
