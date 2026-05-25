import z from "zod";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";

const adminTagBase = z.object({
  id: z.number().optional(),
});

export const adminTagLanguages = z.object({
  langId: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

const adminTag = adminTagBase.extend({
  slug: z.string().max(100),
  mapMarkerImage: z
    .object({
      src: z.string().optional(),
      title: z.string(),
    })
    .optional()
    .nullable(),
  tagLanguages: z.record(z.string(), adminTagLanguages),
});

const adminTagForm = adminTagBase.extend({
  tagLanguages: z.record(z.string(), adminTagLanguages),
});

const adminTagFormCreate = adminTagForm.extend({
  mapMarkerImage: imageBaseCreateType.optional().nullable(),
});

const adminTagFormEdit = adminTagForm.extend({
  slug: z.string().max(100),
  mapMarkerImage: imageBaseEditType.optional().nullable(),
});

export const adminTagListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          slug: z.string(),
        })
      ),
    }),
  },
};

export const adminTagSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminTag,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create tag schema
export const adminTagCreateSchema = {
  body: adminTagFormCreate,
  response: {
    [HTTP_STATUS_CREATED]: adminTag,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit tag schema
export const adminTagEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminTagFormEdit,
  response: {
    [HTTP_STATUS_CREATED]: adminTag,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminTagDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
