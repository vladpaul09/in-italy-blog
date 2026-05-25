import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";

// Define a schema for image responses
const imageResponseType = z.object({
  src: z.string(),
  title: z.string(),
});

export const adminMunicipalityLanguages = z.object({
  langId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

// Base schema for common fields
const adminMunicipalityRequestBase = z.object({
  provinceId: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  radius: z.number(),
  radiusUnit: z.string().max(2),
  showFrontend: z.boolean().optional().nullable(),
  municipalityLanguages: z.record(z.string(), adminMunicipalityLanguages),
});

// Schema for responses
const adminMunicipalityResponseBase = z.object({
  id: z.string().max(10),
  slug: z.string().max(100),
  provinceId: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  image: imageResponseType.optional().nullable(),
  mobileImage: imageResponseType.optional().nullable(),
  showFrontend: z.boolean(),
  municipalityLanguages: z.record(z.string(), adminMunicipalityLanguages),
});

export const adminMunicipalityListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(z.object({
        id: z.string(),
        name: z.string(),
        provinceId: z.string(),
      })),
    }),
  },
};

export const adminMunicipalitySchema = {
  params: z.object({
    id: z.string().max(10),
  }),
  response: {
    [HTTP_STATUS_OK]: adminMunicipalityResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create schema
export const adminMunicipalityCreateSchema = {
  body: adminMunicipalityRequestBase.extend({
    id: z.string().max(10),
    image: imageBaseCreateType.optional().nullable(),
    mobileImage: imageBaseCreateType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminMunicipalityResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit schema
export const adminMunicipalityEditSchema = {
  params: z.object({
    id: z.string().max(10),
  }),
  body: adminMunicipalityRequestBase.extend({
    slug: z.string().max(100),
    image: imageBaseEditType.optional().nullable(),
    mobileImage: imageBaseEditType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminMunicipalityResponseBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminMunicipalityDeleteSchema = {
  params: z.object({
    id: z.string().max(10),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
