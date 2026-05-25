import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";

// Base Event Schema
const adminEventBase = z.object({
  id: z.coerce.number().optional(),
  municipalityId: z.string().max(10),
  categories: z.array(z.coerce.number()),
  image: z.object({
    src: z.string().optional(),
    title: z.string(),
  }).optional().nullable(),
  mobileImage: z.object({
    src: z.string().optional(),
    title: z.string(),
  }).optional().nullable(),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
  publish: z.boolean().optional(),
  authorId: z.number().nullable().optional(),
  authorAliasId: z.number().nullable().optional(),
  dateInterval: z
    .object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    })
    .superRefine((data, ctx) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (startDate > endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: "End date must be after start date",
          path: ["endDate"],
        });

        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: "Start date must be before end date",
          path: ["startDate"],
        });

        return false;
      }

      return true;
    }),
});

export const adminEventLanguages = z.object({
  langId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
});

const adminEvent = adminEventBase.extend({
  slug: z.string().max(100),
  eventLanguages: z.record(z.string(), adminEventLanguages),
});

const adminEventForm = adminEventBase.extend({
  eventLanguages: z.record(z.string(), adminEventLanguages),
});

const adminEventFormCreate = adminEventForm.extend({});

const adminEventFormEdit = adminEventForm.extend({
  slug: z.string().max(100),
});

// List Schema
export const adminEventListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          startDate: z.date(),
          endDate: z.date(),
          municipality: z.string(),
          user: z.coerce.number(),
          userReview: z.coerce.number().nullable(),
          categories: z.array(z.coerce.number()),
          publish: z.boolean(),
          createdAt: z.date(),
        })
      ),
    }),
  },
};

export const adminEventSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminEvent,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create Event Schema
export const adminEventCreateSchema = {
  body: adminEventFormCreate.extend({
    image: imageBaseCreateType.optional().nullable(),
    mobileImage: imageBaseCreateType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminEvent,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit Event Schema
export const adminEventEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminEventFormEdit.extend({
    image: imageBaseEditType.optional().nullable(),
    mobileImage: imageBaseEditType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminEvent,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Delete Event Schema
export const adminEventDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
