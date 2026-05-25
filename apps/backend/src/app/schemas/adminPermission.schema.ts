import z from "zod";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";

const adminPermission = z.object({
  id: z.string(),
  name: z.string(),
  codename: z.string(),
  resource: z.string(),
  action: z.string(),
});

export const adminPermissionListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(adminPermission),
    }),
  },
};

export const adminPermissionSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminPermission,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};