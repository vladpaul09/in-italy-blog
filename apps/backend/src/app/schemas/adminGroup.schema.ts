import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";

const adminGroup = z.object({
  id: z.coerce.number().optional(),
  name: z.string().max(100),
  description: z.nullable(z.string().optional())
});

const adminGroupWithPermissions = adminGroup.extend({
  permissions: z.array(z.string()),
});

export const adminGroupListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(adminGroup),
    }),
  },
};

export const adminGroupSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminGroupWithPermissions,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

export const adminGroupCreateSchema = {
  body: adminGroupWithPermissions,
  response: {
    [HTTP_STATUS_CREATED]: adminGroupWithPermissions,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminGroupEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminGroupWithPermissions,
  response: {
    [HTTP_STATUS_CREATED]: adminGroupWithPermissions,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
} as const;

export const adminGroupDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
