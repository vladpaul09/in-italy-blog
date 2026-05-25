import { z } from "zod";
import { HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR, HTTP_STATUS_NOT_FOUND } from "../../config/httpStatus.config";
import {
  EventSchema,
  ArticleCategorySchema,
  CategorySchema,
  EventCategorySchema,
  ArticleSchema,
  PodcastSchema,
  MunicipalitySchema,
  MapPostSchema,
} from "./websiteBase.schema";

// Schema for province recent events endpoint
export const websiteProvinceRecentEventsSchema = {
  params: z.object({
    locale: z.string(),
    provinceCode: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(MapPostSchema),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

// Schema for region recent events endpoint
export const websiteRegionRecentEventsSchema = {
  params: z.object({
    locale: z.string(),
    regionCode: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(MapPostSchema),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const homepageBoxSchema = z.object({
  name: z.string(),
  image: z.string().nullable(),
  url: z.string(),
});

// Schema for Italy-wide recent events endpoint
export const websiteHomepageDataSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      homepageTopBoxOne: homepageBoxSchema.nullable(),
      homepageTopBoxTwo: homepageBoxSchema.nullable(),
      homepageTopBoxThree: homepageBoxSchema.nullable(),
      homepageTopBoxFour: homepageBoxSchema.nullable(),
      homepageTopBoxFive: homepageBoxSchema.nullable(),
      homepageBottomBoxes: z.array(homepageBoxSchema),
      homepageHeaderImage: z
        .object({
          src: z.string(),
          mobileSrc: z.string().nullable().optional(),
          link: z.string().nullable().optional(),
        })
        .nullable(),
      mapPosts: z.array(MapPostSchema),
      defaultPodcast: PodcastSchema.nullable().optional(),
      latestPodcasts: z.array(PodcastSchema),
      newsArticles: z.array(ArticleSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// Define recursive schemas for recent-posts endpoint
export const RecentPostsParentArticleCategorySchema = CategorySchema.extend({
  subcategories: z.array(ArticleCategorySchema),
});

export const RecentPostsParentEventCategorySchema = CategorySchema.extend({
  subcategories: z.array(EventCategorySchema),
});

export const websiteRecentPostsSchema = {
  params: z.object({
    locale: z.string(),
    lat: z.string(),
    long: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      municipalityData: MunicipalitySchema,
      categoriesArticles: z.array(RecentPostsParentArticleCategorySchema),
      categoriesEvents: z.array(RecentPostsParentEventCategorySchema),
      news: z.array(ArticleSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};
