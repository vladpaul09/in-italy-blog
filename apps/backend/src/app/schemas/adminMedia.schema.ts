import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType } from "./imageBase.schema";

const adminMedia = z.object({
  id: z.string().optional(),
  name: z.string().max(255),
  image: z.object({
    src: z.string().optional(),
    title: z.string(),
  }),
  url: z.string(),
});

export const adminMediaListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(adminMedia),
    }),
  },
};

export const adminMediaSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminMedia,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

export const adminMediaCreateSchema = {
  body: adminMedia.omit({ url: true }).extend({
    image: imageBaseCreateType,
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminMedia,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminMediaDeleteSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
