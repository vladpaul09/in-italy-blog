import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";

// Define a schema for image responses
const imageResponseType = z.object({
  src: z.string(),
  title: z.string(),
});

// Add province languages schema
export const adminProvinceLanguages = z.object({
  langId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

// Base schema
const adminProvinceRequestBase = z.object({
  regionId: z.string().max(2),
  code: z.string().max(10),
  showFrontend: z.boolean().optional().nullable(),
  provinceLanguages: z.record(z.string(), adminProvinceLanguages),
});

// Schema for responses
const adminProvinceResponseBase = z.object({
  id: z.string().max(4),
  slug: z.string().max(100),
  code: z.string().max(10),
  regionId: z.string().max(2),
  image: imageResponseType.optional().nullable(),
  mobileImage: imageResponseType.optional().nullable(),
  showFrontend: z.boolean(),
  provinceLanguages: z.record(z.string(), adminProvinceLanguages),
});

export const adminProvinceListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(z.object({
        id: z.string(),
        name: z.string(),
        regionId: z.string(),
      })),
    }),
  },
};

export const adminProvinceSchema = {
  params: z.object({
    id: z.string().max(4),
  }),
  response: {
    [HTTP_STATUS_OK]: adminProvinceResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create schema
export const adminProvinceCreateSchema = {
  body: adminProvinceRequestBase.extend({
    id: z.string().max(4),
    image: imageBaseCreateType.optional().nullable(),
    mobileImage: imageBaseCreateType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminProvinceResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit schema
export const adminProvinceEditSchema = {
  params: z.object({
    id: z.string().max(4),
  }),
  body: adminProvinceRequestBase.extend({
    slug: z.string().max(100),
    image: imageBaseEditType.optional().nullable(),
    mobileImage: imageBaseEditType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminProvinceResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Delete schema
export const adminProvinceDeleteSchema = {
  params: z.object({
    id: z.string().max(4),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
