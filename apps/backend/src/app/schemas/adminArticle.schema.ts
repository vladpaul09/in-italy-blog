import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";
import PostScope from "../../entries/postScope.entry";

// Base Article Schema
const adminArticleBase = z.object({
  id: z.coerce.number().optional(),
  municipalities: z.array(z.string().max(10)),
  categories: z.array(z.coerce.number()),
  scope: z.nativeEnum(PostScope),
  publish: z.boolean().optional(),
  authorId: z.number().nullable().optional(),
  authorAliasId: z.number().nullable().optional(),
  image: z.object({
    src: z.string().optional(),
    title: z.string(),
  }).optional().nullable(),
  mobileImage: z.object({
    src: z.string().optional(),
    title: z.string(),
  }).optional().nullable(),
});

export const adminArticleLanguages = z.object({
  langId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
});

const adminArticle = adminArticleBase.extend({
  slug: z.string().max(100),
  articleLanguages: z.record(z.string(), adminArticleLanguages),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
});

const adminArticleForm = adminArticleBase.extend({
  articleLanguages: z.record(z.string(), adminArticleLanguages),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
});

// List Schema
export const adminArticleListSchema = {
  querystring: adminCommonQueryStringSchema,
  response: {
    [HTTP_STATUS_OK]: adminCommonListSchema.extend({
      data: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          municipalities: z.array(z.string()),
          categories: z.array(z.coerce.number()),
          publish: z.boolean(),
          user: z.coerce.number(),
          userReview: z.coerce.number().nullable(),
          authorId: z.number().nullable(),
          createdAt: z.date(),
        })
      ),
    }),
  },
};

export const adminArticleSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminArticle,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create Article Schema
export const adminArticleCreateSchema = {
  body: adminArticleForm.extend({
    image: imageBaseCreateType.optional().nullable(),
    mobileImage: imageBaseCreateType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminArticle,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit Article Schema
export const adminArticleEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminArticleForm.extend({
    slug: z.string().max(100),
    image: imageBaseEditType.optional().nullable(),
    mobileImage: imageBaseEditType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminArticle,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Delete Article Schema
export const adminArticleDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
