import { z } from "zod";
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNPROCESSABLE_CONTENT,
} from "../../config/httpStatus.config";
import { MenuItemType } from "../../entries/menuTypes.entry";
import PostScope from "../../entries/postScope.entry";
import { CategoryPageView } from "../../entries/categoriesType.entry";

// Schema for languages response
const LanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  default: z.boolean(),
  image: z.string(),
  sortOrder: z.number(),
});

// Region Schema
export const RegionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

// Province Schema
export const ProvinceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable().optional(),
  region: RegionSchema,
});

// Municipality Schema (main response)
export const MunicipalitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  latitude: z.string(),
  longitude: z.string(),
  radius: z.number(),
  radiusUnit: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  province: ProvinceSchema,
});

// Tag Schema
export const TagSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  markerImage: z.string().nullable(),
});

// Map Post Schema
export const MapPostSchema = z.object({
  type: z.enum(["article", "event", "podcast"]),
  slug: z.string(),
  title: z.string(),
  url: z.string(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  markerImage: z.string().nullable(),
  tags: z.array(TagSchema),
  latitude: z.string(),
  longitude: z.string(),
  description: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Article Schema
export const ArticleSchema = z.object({
  id: z.number(),
  slug: z.string(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.date(),
  author: z.string(),
});

// Podcast Schema
export const PodcastSchema = z.object({
  id: z.number(),
  slug: z.string(),
  youtubeLink: z.string(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  title: z.string(),
  shortDescription: z.string().nullable(),
  description: z.string().nullable().optional(),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
  scope: z.nativeEnum(PostScope),
  municipalities: z.array(z.string().max(10)),
  createdAt: z.date(),
  author: z.string(),
});

// Event Schema
export const EventSchema = z.object({
  id: z.number(),
  slug: z.string(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  createdAt: z.date(),
  author: z.string(),
});

// Category Schema
export const CategorySchema = z.object({
  id: z.number(),
  parentId: z.number().nullable(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  pageView: z.enum(Object.values(CategoryPageView) as [CategoryPageView, ...CategoryPageView[]]),
});

// Article Category Schema
export const ArticleCategorySchema = CategorySchema.extend({
  articles: z.array(ArticleSchema),
});

// Event Category Schema
export const EventCategorySchema = CategorySchema.extend({
  events: z.array(EventSchema),
});

export const MenuItemSchema = z.object({
  id: z.number(),
  parentId: z.number().nullable(),
  categoryId: z.number().nullable(),
  url: z.string().nullable(),
  type: z.nativeEnum(MenuItemType),
  title: z.string(),
  icon: z
    .object({
      title: z.string(),
      src: z.string(),
    })
    .nullable(),
  isVisible: z.boolean(),
  position: z.number(),
});

export const websiteRegionalSlugsSchema = {
  response: {
    [HTTP_STATUS_OK]: z.array(
      z.object({
        regionSlug: z.string(),
        provincesSlugs: z.array(
          z.object({
            provinceSlug: z.string(),
            municipalitiesSlugs: z.array(
              z.object({
                municipalitySlug: z.string(),
              })
            ),
          })
        ),
      })
    ),
  },
};



export const websiteLanguagesSchema = {
  response: {
    [HTTP_STATUS_OK]: z.array(LanguageSchema),
  },
};

export const websiteTranslationsSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.record(z.string(), z.string()),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const websiteMunicipalitiesSearchSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
    ),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

export const websiteLatestArticlesSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(ArticleSchema),
  },
};

const RecursiveCategoryArticleSchema: any = CategorySchema.extend({
  categoriesArticles: z.lazy(() => z.array(RecursiveCategoryArticleSchema)),
  articles: z.array(ArticleSchema).optional(),
});

// Newsletter Schemas
export const websiteNewsletterSubscribeSchema = {
  body: z.object({
    email: z.string().email(),
  }),
  response: {
    [HTTP_STATUS_CREATED]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_OK]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};

// List endpoint schemas
export const websiteCategoriesArticlesSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(CategorySchema),
  },
};

export const websiteCategoriesEventsSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(CategorySchema),
  },
};

export const websiteTagsSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(TagSchema),
  },
};

export const websiteRegionsSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(RegionSchema),
  },
};

export const websiteMunicipalitiesSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(MunicipalitySchema),
  },
};
