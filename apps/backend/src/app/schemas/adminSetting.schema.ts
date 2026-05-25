import { z } from "zod";
import { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import { resourceUnionEntryIds, settingsTopBoxesTypeLabels } from "../../entries/settingsType.entry";
import { imageBaseEditType } from "./imageBase.schema";

const homepageBottomBoxSchema = z.object({
  type: z.enum(resourceUnionEntryIds),
  categoryArticleId: z.coerce.number().nullable().optional(),
  categoryEventId: z.coerce.number().nullable().optional(),
  categoryPodcastId: z.coerce.number().nullable().optional(),
  articleId: z.coerce.number().nullable().optional(),
  eventId: z.coerce.number().nullable().optional(),
});

export const settingsSchema = z.object({
  id: z.enum(["all"]),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_PODCAST_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_PODCAST_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_PODCAST_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_PODCAST_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_PODCAST_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_ARTICLE_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_EVENT_ID]: z.coerce.number(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_TYPE]: z.string(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_TYPE]: z.string(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_TYPE]: z.string(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_TYPE]: z.string(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_TYPE]: z.string(),
  [settingsTopBoxesTypeLabels.HOMEPAGE_BOTTOM_BOXES]: z.array(homepageBottomBoxSchema),
  [settingsTopBoxesTypeLabels.REGIONAL_ARTICLES]: z.array(
    z.object({
      categoryArticleId: z.coerce.number(),
    })
  ),
  [settingsTopBoxesTypeLabels.HOMEPAGE_AROUND_YOU]: z.array(
    z.object({
      categoryArticleId: z.coerce.number(),
    })
  ),
  [settingsTopBoxesTypeLabels.SHOWCASE_PODCAST]: z.array(z.object({ podcastId: z.coerce.number() })),
  [settingsTopBoxesTypeLabels.HOMEPAGE_HEADER_IMAGES]: z.array(
    z.object({ 
      image: z.object({ src: z.string(), title: z.string() }), 
      mobileImage: z.object({ src: z.string(), title: z.string() }).nullable().optional(),
      link: z.string().optional().nullable() 
    })
  ),
  [settingsTopBoxesTypeLabels.DEFAULT_IMAGE]: z.object({ src: z.string(), title: z.string() }).nullable(),
});

export const adminSettingsSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: settingsSchema,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

export const adminSettingsEditSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: settingsSchema.extend({
    [settingsTopBoxesTypeLabels.HOMEPAGE_HEADER_IMAGES]: z.array(
      z.object({
        image: z.object({
          rawFile: imageBaseEditType.optional(),
          src: z.string(),
          title: z.string(),
        }),
        mobileImage: z.object({
          rawFile: imageBaseEditType.optional(),
          src: z.string(),
          title: z.string(),
        }).nullable().optional(),
        link: z.string().optional().nullable(),
      })
    ),
    [settingsTopBoxesTypeLabels.DEFAULT_IMAGE]: imageBaseEditType,
  }),
  response: {
    [HTTP_STATUS_OK]: settingsSchema,
    [HTTP_STATUS_NOT_FOUND]: z.string(),
    [HTTP_STATUS_SERVER_ERROR]: z.string(),
  },
};
