import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import validateItalianPhone from "../../utils/validateItalianPhone.util";

// Base Contact Form Schema
export const adminContactFormBase = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).refine(validateItalianPhone, {
    message: "Please enter a valid Italian phone number (e.g., +39 3XX XXX XXXX)",
  }),
  note: z.string().min(1),
});

const adminContactForm = adminContactFormBase.extend({});

// List Schema
export const adminContactFormListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          surname: z.string(),
          email: z.string(),
          phone: z.string(),
          note: z.string(),
          createdAt: z.date(),
        })
      ),
    }),
  },
};

export const adminContactFormSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminContactForm,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};