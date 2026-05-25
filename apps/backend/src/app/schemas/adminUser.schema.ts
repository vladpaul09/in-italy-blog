import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";

const adminUser = z.object({
  id: z.coerce.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().min(3),
  groups: z.array(z.coerce.number()),
  aliases: z.array(z.object({ id: z.number().optional(), name: z.string() })),
});

const adminUserAllProps = adminUser.extend({
  regions: z.array(z.string().max(2)),
  provinces: z.array(z.string().max(4)),
  municipalities: z.array(z.string().max(10)),
});

export const adminUserListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(adminUser),
    }),
  },
};

export const adminUserSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminUserAllProps,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

export const adminUserCreateSchema = {
  body: adminUserAllProps.extend({
    password: z
      .object({
        current: z.string(),
        confirm: z.string(),
      })
      .refine((data) => data.confirm === data.current, {
        message: "Passwords don't match",
        path: ["confirm"],
      }),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminUserAllProps,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const adminUserEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminUserAllProps,
  response: {
    [HTTP_STATUS_CREATED]: adminUserAllProps,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
} as const;

export const adminUserDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
