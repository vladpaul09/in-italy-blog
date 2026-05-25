import { z } from "zod";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";

// Base schemas
const i18nLanguageSchema = z.object({
  langId: z.string(),
  value: z.string(),
});

export const i18nSchema = z.object({
  id: z.string(),
  languages: z.record(z.string(), i18nLanguageSchema),
});

export const i18nResponseSchema = z.object({
  id: z.string(),
  languages: z.record(z.string(), i18nLanguageSchema),
});

export const i18nUpdateSchema = z.object({
  id: z.string(),
  languages: z.record(z.string(), i18nLanguageSchema),
});

// Route schemas
export const i18nListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(i18nResponseSchema),
    }),
  },
};

export const i18nGetSchema = {
  params: z.object({ id: z.string() }),
  response: {
    [HTTP_STATUS_OK]: i18nResponseSchema,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

export const i18nCreateSchema = {
  body: i18nSchema,
  response: {
    [HTTP_STATUS_CREATED]: i18nResponseSchema,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const i18nUpdateRouteSchema = {
  params: z.object({ id: z.string() }),
  body: i18nUpdateSchema,
  response: {
    [HTTP_STATUS_OK]: i18nResponseSchema,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const i18nDeleteSchema = {
  params: z.object({ id: z.string() }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.void(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
