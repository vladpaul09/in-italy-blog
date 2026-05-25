import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";

export const adminPageLanguages = z.object({
  langId: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  pageTitle: z.string(),
  pageDescription: z.string(),
});

// Base Page Schema
const adminPageBase = z.object({
  id: z.coerce.number().optional(),
  slug: z.string().max(100),
  publish: z.boolean().optional(),
});

const adminPage = adminPageBase.extend({
  languages: z.record(z.string(), adminPageLanguages),
});

const adminPageForm = z.object({
  slug: z.string().max(100),
  languages: z.record(z.string(), adminPageLanguages),
  publish: z.boolean().optional(),
});

const adminPageFormCreate = adminPageForm.extend({});

const adminPageFormEdit = adminPageForm.extend({});

// List Schema
export const adminPageListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          slug: z.string(),
          publish: z.boolean(),
          createdAt: z.date(),
        })
      ),
    }),
  },
};

export const adminPageSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminPage,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

export const adminPageCreateSchema = {
  body: adminPageFormCreate,
  response: {
    [HTTP_STATUS_CREATED]: adminPage,
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminPageEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminPageFormEdit,
  response: {
    [HTTP_STATUS_CREATED]: adminPage,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminPageDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
