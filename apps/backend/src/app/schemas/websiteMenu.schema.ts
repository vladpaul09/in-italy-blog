import { z } from "zod";
import { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND } from "../../config/httpStatus.config";
import { MenuItemType } from "../../entries/menuTypes.entry";

// Define the base type for menu items
type MenuItemBaseType = {
  id: number;
  parentId: number | null;
  categoryId: number | null;
  url: string | null;
  type: MenuItemType;
  title: string;
  icon: {
    title: string;
    src: string;
  } | null;
  isVisible: boolean;
  position: number;
  children?: MenuItemBaseType[];
};

// Create the schema with proper type annotation
export const MenuItemSchema: z.ZodType<MenuItemBaseType> = z.object({
  id: z.number(),
  parentId: z.number().nullable(),
  categoryId: z.number().nullable(),
  url: z.string().nullable(),
  type: z.nativeEnum(MenuItemType),
  title: z.string(),
  icon: z
    .object({
      title: z.string(),
      src: z.string(),
    })
    .nullable(),
  isVisible: z.boolean(),
  position: z.number(),
  children: z.array(z.lazy(() => MenuItemSchema)).optional(),
});

export type MenuItemSchemaType = z.infer<typeof MenuItemSchema>;

// Menu Language Schema
const MenuLanguageSchema = z.object({
  name: z.string(),
});

// Menu Schema
export const MenuSchema = z.object({
  id: z.number(),
  menuItems: z.array(MenuItemSchema).optional(),
  menuLanguages: z.record(z.string(), MenuLanguageSchema),
});

// List Schema
export const websiteMenuItemsSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(MenuItemSchema),
  },
};

// List Menus Schema
export const websiteMenusSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(MenuSchema),
  },
};

// Single Menu Schema
export const websiteMenuSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(MenuItemSchema),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};
