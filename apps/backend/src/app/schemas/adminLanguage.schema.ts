import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";

const adminLanguageBase = z.object({
  id: z.string(),
  name: z.string(),
  default: z.boolean(),
  status: z.boolean(),
});

const adminLanguageWithImageSchema = adminLanguageBase.extend({
  image: z.object({
    src: z.string(),
    title: z.string(),
  }),
});


const adminLanguageResponseSchema = adminLanguageWithImageSchema.extend({
});

export const adminLanguageListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(adminLanguageWithImageSchema),
    }),
  },
};

export const adminLanguageSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminLanguageWithImageSchema,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

export const adminLanguageCreateSchema = {
  body: adminLanguageBase.extend({
    image: imageBaseCreateType,
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminLanguageResponseSchema,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminLanguageEditSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: adminLanguageBase.extend({
    image: imageBaseEditType,
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminLanguageResponseSchema,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminLanguageSortSchema = {
  body: z.object({
    data: z.array(z.string()),
  }),
  response: {
    [HTTP_STATUS_OK]: z.string(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminLanguageDeleteSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
