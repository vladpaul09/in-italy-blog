import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { adminCommonListSchema, adminCommonQueryStringSchema } from "./adminCommon.schema";
import { imageBaseCreateType, imageBaseEditType } from "./imageBase.schema";
import PostScope from "../../entries/postScope.entry";

// Base Podcast Schema
const adminPodcastBase = z.object({
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
  youtubeLink: z.string(),
});

export const adminPodcastLanguages = z.object({
  langId: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  description: z.string().optional().nullable(),
});

const adminPodcast = adminPodcastBase.extend({
  slug: z.string().max(100),
  podcastLanguages: z.record(z.string(), adminPodcastLanguages),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
});

const adminPodcastForm = adminPodcastBase.extend({
  podcastLanguages: z.record(z.string(), adminPodcastLanguages),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
});

// List Schema
export const adminPodcastListSchema = {
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

export const adminPodcastSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: adminPodcast,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Create Podcast Schema
export const adminPodcastCreateSchema = {
  body: adminPodcastForm.extend({
    image: imageBaseCreateType.optional().nullable(),
    mobileImage: imageBaseCreateType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminPodcast,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Edit Podcast Schema
export const adminPodcastEditSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: adminPodcastForm.extend({
    slug: z.string().max(100),
    image: imageBaseEditType.optional().nullable(),
    mobileImage: imageBaseEditType.optional().nullable(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: adminPodcast,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Delete Podcast Schema
export const adminPodcastDeleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_NO_CONTENT]: z.boolean(),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
