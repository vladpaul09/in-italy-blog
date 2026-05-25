import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";

// Define a schema
const imageResponseType = z.object({
  src: z.string(),
  title: z.string(),
});

// Define schema for region languages
export const adminRegionLanguages = z.object({
  langId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

// Base request schema
const adminRegionRequestBase = z.object({
  id: z.string().max(2),
  slug: z.string().max(100).optional(),
  image: imageBaseCreateType.optional().nullable(),
  mobileImage: imageBaseCreateType.optional().nullable(),
  showFrontend: z.boolean().optional().nullable(),
  regionLanguages: z.record(z.string(), adminRegionLanguages),
});

// Base response schema
const adminRegionResponseBase = z.object({
  id: z.string().max(2),
  slug: z.string().max(100),
  image: imageResponseType.optional().nullable(),
  mobileImage: imageResponseType.optional().nullable(),
  showFrontend: z.boolean(),
  regionLanguages: z.record(z.string(), adminRegionLanguages),
});

export const adminRegionListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    }),
  },
};

export const adminRegionSchema = {
  params: z.object({
    id: z.string().max(2),
  }),
  response: {
    [HTTP_STATUS_OK]: adminRegionResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create schema
export const adminRegionCreateSchema = {
  body: adminRegionRequestBase,
  response: {
    [HTTP_STATUS_CREATED]: adminRegionResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit schema
export const adminRegionEditSchema = {
  params: z.object({
    id: z.string().max(2),
  }),
  body: adminRegionRequestBase
    .omit({ id: true })
    .extend({
      image: imageBaseEditType.optional().nullable(),
      mobileImage: imageBaseEditType.optional().nullable(),
    }),
  response: {
    [HTTP_STATUS_OK]: adminRegionResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Delete schema
export const adminRegionDeleteSchema = {
  params: z.object({
    id: z.string().max(2),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
