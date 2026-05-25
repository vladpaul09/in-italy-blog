import z from "zod";
import { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";

// Base Newsletter Schema
export const adminNewsletterBase = z.object({
  email: z.string().email(),
  createdAt: z.date(),
});

// List Schema
export const adminNewsletterListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          email: z.string().email(),
          createdAt: z.date(),
        })
      ),
    }),
  },
};

export const adminNewsletterSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminNewsletterBase,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
}; 