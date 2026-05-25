import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";
import { CategoryPageView } from "../../entries/categoriesType.entry";

const adminCategoryBase = z.object({
  id: z.number().optional(),
  parent: z.number().optional().nullable(),
  pageView: z.enum(Object.values(CategoryPageView) as [CategoryPageView, ...CategoryPageView[]]),
  tags: z.array(z.number()).optional(),
  image: z.object({
    src: z.string().optional(),
    title: z.string(),
  }).optional().nullable(),
  mobileImage: z.object({
    src: z.string().optional(),
    title: z.string(),
  }).optional().nullable(),
});

export const adminCategoryLanguages = z.object({
  langId: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

const adminCategory = adminCategoryBase.extend({
  slug: z.string().max(100),
  categoryLanguages: z.record(z.string(), adminCategoryLanguages),
});

const adminCategoryForm = adminCategoryBase.extend({
  categoryLanguages: z.record(z.string(), adminCategoryLanguages),
});

const adminCategoryFormCreate = adminCategoryForm.extend({});

const adminCategoryFormEdit = adminCategoryForm.extend({
  slug: z.string().max(100),
});

export const adminCategoryListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          slug: z.string(),
          parentId: z.coerce.number().optional().nullable(),
        })
      ),
    }),
  },
};

export const adminCategorySchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminCategory,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create category schema
export const adminCategoryCreateSchema = {
  body: adminCategoryFormCreate.extend({
    image: imageBaseCreateType.optional().nullable(),
    mobileImage: imageBaseCreateType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminCategory,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit category schema
export const adminCategoryEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminCategoryFormEdit.extend({
    image: imageBaseEditType.optional().nullable(),
    mobileImage: imageBaseEditType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminCategory,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminCategorySortSchema = {
  body: z.object({
    data: z.array(z.number()).min(1),
  }),
  response: {
    [HTTP_STATUS_OK]: z.string(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminCategoryDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
