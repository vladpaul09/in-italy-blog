import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";
import { MenuItemType } from "../../entries/menuTypes.entry";

// Menu Language Schema
export const adminMenuLanguage = z.object({
  langId: z.string(),
  name: z.string(),
});

// Menu Item Language Schema
export const adminMenuItemLanguage = z.object({
  langId: z.string(),
  title: z.string(),
});

// Base Menu Item Schema
const adminMenuItemBase = z.object({
  id: z.number().optional(),
  parentId: z.number().nullable(),
  categoryId: z.number().nullable().optional(),
  url: z.string().max(500).nullable().optional(),
  icon: z.object({
    src: z.string(),
    title: z.string(),
  }).nullable().optional(),
  type: z.nativeEnum(MenuItemType),
  isVisible: z.boolean(),
  position: z.number(),
  maxItems: z.number().min(1).max(50).nullable().optional(),
  menuItemLanguages: z.record(z.string(), adminMenuItemLanguage),
});

type AdminMenuItemType = z.infer<typeof adminMenuItemBase> & {
  children?: AdminMenuItemType[];
};

export const adminMenuItem: z.ZodType<AdminMenuItemType> = adminMenuItemBase.extend({
  children: z.array(z.lazy(() => adminMenuItem)).optional(),
});

const adminMenuItemForm = adminMenuItemBase.extend({
  children: z.array(z.lazy(() => adminMenuItem)).optional(),
});

const adminMenuItemFormCreate = adminMenuItemForm.extend({
  parentId: z.number().nullable().optional(),
});

const adminMenuItemFormEdit = adminMenuItemForm.extend({});

// List Schema
export const adminMenuItemListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.coerce.number(),
          title: z.string(),
          type: z.string(),
          categoryId: z.number().nullable(),
          isVisible: z.boolean(),
          parentId: z.number().nullable(),
        })
      ),
    }),
  },
};

export const adminMenuItemSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminMenuItem,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create Schema
export const adminMenuItemCreateSchema = {
  body: adminMenuItemFormCreate.extend({
    icon: imageBaseCreateType.nullable().optional(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminMenuItem,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit Schema
export const adminMenuItemEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminMenuItemFormEdit.extend({
    icon: imageBaseEditType,
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminMenuItem,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Delete Schema
export const adminMenuItemDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Menu Base Schema
const adminMenuBase = z.object({
  id: z.number().optional(),
  slug: z.string().max(100),
  menuLanguages: z.record(z.string(), adminMenuLanguage),
});

const adminMenu = adminMenuBase.extend({
  menuItems: z.array(adminMenuItem).optional(),
});

const adminMenuForm = adminMenuBase.extend({
  menuItems: z.array(adminMenuItem).optional(),
});

const adminMenuFormCreate = adminMenuBase.extend({
  menuItems: z.array(adminMenuItemFormCreate).optional(),
});

const adminMenuFormEdit = adminMenuForm.extend({});

export const adminMenuListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.coerce.number(),
          slug: z.string(),
        })
      ),
    }),
  },
};

export const adminMenuSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminMenu,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

export const adminMenuCreateSchema = {
  body: adminMenuFormCreate,
  response: {
    [HTTP_STATUS_CREATED]: adminMenu,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminMenuEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminMenuFormEdit,
  response: {
    [HTTP_STATUS_CREATED]: adminMenu,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminMenuDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
}; 