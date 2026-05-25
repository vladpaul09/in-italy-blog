import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Settings } from "../models";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { adminSettingsSchema, adminSettingsEditSchema } from "../schemas/adminSetting.schema";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import { resourceUnionEntryDefaultValue, settingsTopBoxesTypeLabels } from "../../entries/settingsType.entry";
import randomString from "../../utils/randomString";
import { saveUploadedFile, deleteUploadedFile } from "../../utils/upload";
import config from "../../config/app.config";

const adminSettingsController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getAllInstances = async () => {
    const homepageTopBoxOneCategoryArticleId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_ARTICLE_ID },
    });
    const homepageTopBoxTwoCategoryArticleId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_ARTICLE_ID },
    });
    const homepageTopBoxThreeCategoryArticleId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_ARTICLE_ID },
    });
    const homepageTopBoxFourCategoryArticleId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_ARTICLE_ID },
    });
    const homepageTopBoxFiveCategoryArticleId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_ARTICLE_ID },
    });

    const homepageTopBoxOneCategoryEventId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_EVENT_ID },
    });
    const homepageTopBoxTwoCategoryEventId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_EVENT_ID },
    });
    const homepageTopBoxThreeCategoryEventId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_EVENT_ID },
    });
    const homepageTopBoxFourCategoryEventId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_EVENT_ID },
    });
    const homepageTopBoxFiveCategoryEventId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_EVENT_ID },
    });

    const homepageTopBoxOneCategoryPodcastId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_PODCAST_ID },
    });
    const homepageTopBoxTwoCategoryPodcastId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_PODCAST_ID },
    });
    const homepageTopBoxThreeCategoryPodcastId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_PODCAST_ID },
    });
    const homepageTopBoxFourCategoryPodcastId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_PODCAST_ID },
    });
    const homepageTopBoxFiveCategoryPodcastId = await Settings.findOne({
      where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_PODCAST_ID },
    });

    const homepageTopBoxOneArticleId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_ARTICLE_ID } });
    const homepageTopBoxTwoArticleId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_ARTICLE_ID } });
    const homepageTopBoxThreeArticleId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_ARTICLE_ID } });
    const homepageTopBoxFourArticleId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_ARTICLE_ID } });
    const homepageTopBoxFiveArticleId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_ARTICLE_ID } });

    const homepageTopBoxOneEventId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_EVENT_ID } });
    const homepageTopBoxTwoEventId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_EVENT_ID } });
    const homepageTopBoxThreeEventId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_EVENT_ID } });
    const homepageTopBoxFourEventId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_EVENT_ID } });
    const homepageTopBoxFiveEventId = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_EVENT_ID } });

    const homepageTopBoxOneType = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_TYPE } });
    const homepageTopBoxTwoType = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_TYPE } });
    const homepageTopBoxThreeType = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_TYPE } });
    const homepageTopBoxFourType = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_TYPE } });
    const homepageTopBoxFiveType = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_TYPE } });

    const homepageBottomBoxes = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_BOTTOM_BOXES } });
    const regionalArticles = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.REGIONAL_ARTICLES } });
    const homepageAroundYou = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_AROUND_YOU } });
    const showcasePodcast = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.SHOWCASE_PODCAST } });
    const homepageHeaderImages = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_HEADER_IMAGES } });
    const defaultImageSetting = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.DEFAULT_IMAGE } });

    let homepageHeaderImagesArr: { image: { src: string; title: string }; mobileImage?: { src: string; title: string } | null; link: string }[] = [];
    if (homepageHeaderImages && homepageHeaderImages.value) {
      const arr: Array<{ title: string; mobileTitle?: string | null; link: string }> = JSON.parse(homepageHeaderImages.value);
      if (Array.isArray(arr)) {
        homepageHeaderImagesArr = arr
          .filter((img) => typeof img === "object")
          .map((img) => ({
            image: {
              src: `${config.serverNameStatics}/uploads/images/homepage-header/${img.title}`,
              title: img.title,
            },
            mobileImage:
              img.mobileTitle && img.mobileTitle !== img.title
                ? {
                    src: `${config.serverNameStatics}/uploads/images/homepage-header/${img.mobileTitle}`,
                    title: img.mobileTitle,
                  }
                : null,
            link: img.link,
          }));
      }
    }
    // Handle defaultImage for GET (as { src, title, link })
    let defaultImageObj: { src: string; title: string } | null = null;
    if (defaultImageSetting && defaultImageSetting.value) {
      defaultImageObj = {
        src: `${config.serverNameStatics}/uploads/images/defaults/${defaultImageSetting.value}`,
        title: defaultImageSetting.value,
      };
    }

    return {
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_ARTICLE_ID]: homepageTopBoxOneCategoryArticleId
        ? Number(homepageTopBoxOneCategoryArticleId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_ARTICLE_ID]: homepageTopBoxTwoCategoryArticleId
        ? Number(homepageTopBoxTwoCategoryArticleId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_ARTICLE_ID]: homepageTopBoxThreeCategoryArticleId
        ? Number(homepageTopBoxThreeCategoryArticleId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_ARTICLE_ID]: homepageTopBoxFourCategoryArticleId
        ? Number(homepageTopBoxFourCategoryArticleId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_ARTICLE_ID]: homepageTopBoxFiveCategoryArticleId
        ? Number(homepageTopBoxFiveCategoryArticleId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_EVENT_ID]: homepageTopBoxOneCategoryEventId
        ? Number(homepageTopBoxOneCategoryEventId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_EVENT_ID]: homepageTopBoxTwoCategoryEventId
        ? Number(homepageTopBoxTwoCategoryEventId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_EVENT_ID]: homepageTopBoxThreeCategoryEventId
        ? Number(homepageTopBoxThreeCategoryEventId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_EVENT_ID]: homepageTopBoxFourCategoryEventId
        ? Number(homepageTopBoxFourCategoryEventId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_EVENT_ID]: homepageTopBoxFiveCategoryEventId
        ? Number(homepageTopBoxFiveCategoryEventId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_PODCAST_ID]: homepageTopBoxOneCategoryPodcastId
        ? Number(homepageTopBoxOneCategoryPodcastId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_PODCAST_ID]: homepageTopBoxTwoCategoryPodcastId
        ? Number(homepageTopBoxTwoCategoryPodcastId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_PODCAST_ID]: homepageTopBoxThreeCategoryPodcastId
        ? Number(homepageTopBoxThreeCategoryPodcastId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_PODCAST_ID]: homepageTopBoxFourCategoryPodcastId
        ? Number(homepageTopBoxFourCategoryPodcastId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_PODCAST_ID]: homepageTopBoxFiveCategoryPodcastId
        ? Number(homepageTopBoxFiveCategoryPodcastId!.value)
        : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_ARTICLE_ID]: homepageTopBoxOneArticleId ? Number(homepageTopBoxOneArticleId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_ARTICLE_ID]: homepageTopBoxTwoArticleId ? Number(homepageTopBoxTwoArticleId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_ARTICLE_ID]: homepageTopBoxThreeArticleId ? Number(homepageTopBoxThreeArticleId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_ARTICLE_ID]: homepageTopBoxFourArticleId ? Number(homepageTopBoxFourArticleId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_ARTICLE_ID]: homepageTopBoxFiveArticleId ? Number(homepageTopBoxFiveArticleId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_EVENT_ID]: homepageTopBoxOneEventId ? Number(homepageTopBoxOneEventId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_EVENT_ID]: homepageTopBoxTwoEventId ? Number(homepageTopBoxTwoEventId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_EVENT_ID]: homepageTopBoxThreeEventId ? Number(homepageTopBoxThreeEventId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_EVENT_ID]: homepageTopBoxFourEventId ? Number(homepageTopBoxFourEventId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_EVENT_ID]: homepageTopBoxFiveEventId ? Number(homepageTopBoxFiveEventId!.value) : 0,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_TYPE]: homepageTopBoxOneType ? homepageTopBoxOneType!.value : resourceUnionEntryDefaultValue,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_TYPE]: homepageTopBoxTwoType ? homepageTopBoxTwoType!.value : resourceUnionEntryDefaultValue,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_TYPE]: homepageTopBoxThreeType
        ? homepageTopBoxThreeType!.value
        : resourceUnionEntryDefaultValue,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_TYPE]: homepageTopBoxFourType
        ? homepageTopBoxFourType!.value
        : resourceUnionEntryDefaultValue,
      [settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_TYPE]: homepageTopBoxFiveType
        ? homepageTopBoxFiveType!.value
        : resourceUnionEntryDefaultValue,
      [settingsTopBoxesTypeLabels.HOMEPAGE_BOTTOM_BOXES]: homepageBottomBoxes ? JSON.parse(homepageBottomBoxes.value) : [],
      [settingsTopBoxesTypeLabels.REGIONAL_ARTICLES]: regionalArticles ? JSON.parse(regionalArticles.value) : [],
      [settingsTopBoxesTypeLabels.HOMEPAGE_AROUND_YOU]: homepageAroundYou ? JSON.parse(homepageAroundYou.value) : [],
      [settingsTopBoxesTypeLabels.SHOWCASE_PODCAST]: showcasePodcast ? JSON.parse(showcasePodcast.value) : [],
      [settingsTopBoxesTypeLabels.HOMEPAGE_HEADER_IMAGES]: homepageHeaderImagesArr,
      [settingsTopBoxesTypeLabels.DEFAULT_IMAGE]: defaultImageObj,
    };
  };

  app.get(`${routePrefix}/:id`, { schema: adminSettingsSchema, preParsing: app.permGuard("admin.settings.show") }, async (request, reply) => {
    const { id } = request.params;
    if (id !== "all") {
      return reply.status(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    return reply.status(HTTP_STATUS_OK).send({ id: "all", ...(await getAllInstances()) });
  });

  app.put(`${routePrefix}/:id`, { schema: adminSettingsEditSchema, preParsing: app.permGuard("admin.settings.edit") }, async (request, reply) => {
    try {
      const { id } = request.params;
      if (id !== "all") {
        return reply.status(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      const {
        homepageTopBoxOneCategoryArticleId,
        homepageTopBoxTwoCategoryArticleId,
        homepageTopBoxThreeCategoryArticleId,
        homepageTopBoxFourCategoryArticleId,
        homepageTopBoxFiveCategoryArticleId,

        homepageTopBoxOneCategoryEventId,
        homepageTopBoxTwoCategoryEventId,
        homepageTopBoxThreeCategoryEventId,
        homepageTopBoxFourCategoryEventId,
        homepageTopBoxFiveCategoryEventId,

        homepageTopBoxOneCategoryPodcastId,
        homepageTopBoxTwoCategoryPodcastId,
        homepageTopBoxThreeCategoryPodcastId,
        homepageTopBoxFourCategoryPodcastId,
        homepageTopBoxFiveCategoryPodcastId,

        homepageTopBoxOneArticleId,
        homepageTopBoxTwoArticleId,
        homepageTopBoxThreeArticleId,
        homepageTopBoxFourArticleId,
        homepageTopBoxFiveArticleId,
        homepageTopBoxOneEventId,
        homepageTopBoxTwoEventId,
        homepageTopBoxThreeEventId,
        homepageTopBoxFourEventId,
        homepageTopBoxFiveEventId,
        homepageTopBoxOneType,
        homepageTopBoxTwoType,
        homepageTopBoxThreeType,
        homepageTopBoxFourType,
        homepageTopBoxFiveType,
        homepageBottomBoxes,
        regionalArticles,
        homepageAroundYou,
        showcasePodcast,
        homepageHeaderImages,
        defaultImage,
      } = request.body;

      await sequelizeConnector.transaction(async (t) => {
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_ARTICLE_ID, value: homepageTopBoxOneCategoryArticleId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_ARTICLE_ID, value: homepageTopBoxTwoCategoryArticleId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_ARTICLE_ID, value: homepageTopBoxThreeCategoryArticleId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_ARTICLE_ID, value: homepageTopBoxFourCategoryArticleId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_ARTICLE_ID, value: homepageTopBoxFiveCategoryArticleId },
          { transaction: t }
        );

        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_EVENT_ID, value: homepageTopBoxOneCategoryEventId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_EVENT_ID, value: homepageTopBoxTwoCategoryEventId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_EVENT_ID, value: homepageTopBoxThreeCategoryEventId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_EVENT_ID, value: homepageTopBoxFourCategoryEventId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_EVENT_ID, value: homepageTopBoxFiveCategoryEventId },
          { transaction: t }
        );

        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_PODCAST_ID, value: homepageTopBoxOneCategoryPodcastId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_PODCAST_ID, value: homepageTopBoxTwoCategoryPodcastId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_PODCAST_ID, value: homepageTopBoxThreeCategoryPodcastId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_PODCAST_ID, value: homepageTopBoxFourCategoryPodcastId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_PODCAST_ID, value: homepageTopBoxFiveCategoryPodcastId },
          { transaction: t }
        );

        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_ARTICLE_ID, value: homepageTopBoxOneArticleId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_ARTICLE_ID, value: homepageTopBoxTwoArticleId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_ARTICLE_ID, value: homepageTopBoxThreeArticleId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_ARTICLE_ID, value: homepageTopBoxFourArticleId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_ARTICLE_ID, value: homepageTopBoxFiveArticleId },
          { transaction: t }
        );
        await Settings.upsert({ id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_EVENT_ID, value: homepageTopBoxOneEventId }, { transaction: t });
        await Settings.upsert({ id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_EVENT_ID, value: homepageTopBoxTwoEventId }, { transaction: t });
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_EVENT_ID, value: homepageTopBoxThreeEventId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_EVENT_ID, value: homepageTopBoxFourEventId },
          { transaction: t }
        );
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_EVENT_ID, value: homepageTopBoxFiveEventId },
          { transaction: t }
        );
        await Settings.upsert({ id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_TYPE, value: homepageTopBoxOneType }, { transaction: t });
        await Settings.upsert({ id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_TYPE, value: homepageTopBoxTwoType }, { transaction: t });
        await Settings.upsert({ id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_TYPE, value: homepageTopBoxThreeType }, { transaction: t });
        await Settings.upsert({ id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_TYPE, value: homepageTopBoxFourType }, { transaction: t });
        await Settings.upsert({ id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_TYPE, value: homepageTopBoxFiveType }, { transaction: t });
        await Settings.upsert(
          { id: settingsTopBoxesTypeLabels.HOMEPAGE_BOTTOM_BOXES, value: JSON.stringify(homepageBottomBoxes) },
          { transaction: t }
        );

        await Settings.upsert({ id: settingsTopBoxesTypeLabels.REGIONAL_ARTICLES, value: JSON.stringify(regionalArticles) }, { transaction: t });

        await Settings.upsert({ id: settingsTopBoxesTypeLabels.HOMEPAGE_AROUND_YOU, value: JSON.stringify(homepageAroundYou) }, { transaction: t });

        await Settings.upsert({ id: settingsTopBoxesTypeLabels.SHOWCASE_PODCAST, value: JSON.stringify(showcasePodcast || []) }, { transaction: t });

        if (Array.isArray(homepageHeaderImages)) {
          const currentSetting = await Settings.findOne({
            where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_HEADER_IMAGES },
            transaction: t,
          });

          const currentImages: { title: string; mobileTitle?: string | null; link?: string }[] = currentSetting?.value
            ? JSON.parse(currentSetting.value)
            : [];

          const updatedImages: { title: string; mobileTitle?: string | null; link?: string | null }[] = [];

          for (const incoming of homepageHeaderImages) {
            const { rawFile: desktopRawFile, title: imageTitle } = incoming.image;
            const { rawFile: mobileRawFile, title: mobileImageTitle } = incoming.mobileImage || {};
            const { link } = incoming;

            const matchedPrev = currentImages.find((img) => img.title === imageTitle);

            // Handle desktop image
            const desktopTitle = desktopRawFile ? await saveUploadedFile(desktopRawFile, ["images", "homepage-header"], imageTitle) : imageTitle;

            // Handle mobile image
            const mobileTitle = mobileImageTitle
              ? mobileRawFile
                ? await saveUploadedFile(mobileRawFile, ["images", "homepage-header"], mobileImageTitle)
                : mobileImageTitle
              : null;

            if (matchedPrev) {
              if (desktopRawFile) {
                deleteUploadedFile(matchedPrev.title, ["images", "homepage-header"]);
              }
              if (mobileRawFile) {
                if (matchedPrev.mobileTitle) {
                  deleteUploadedFile(matchedPrev.mobileTitle, ["images", "homepage-header"]);
                }
              }
            }

            updatedImages.push({ title: desktopTitle, mobileTitle, link });
          }

          for (const old of currentImages) {
            if (!updatedImages.some((img) => img.title === old.title)) {
              deleteUploadedFile(old.title, ["images", "homepage-header"]);
              // Also delete mobile image if exists
              if (old.mobileTitle) {
                deleteUploadedFile(old.mobileTitle, ["images", "homepage-header"]);
              }
            }
          }

          // Save new image list
          await Settings.upsert(
            {
              id: settingsTopBoxesTypeLabels.HOMEPAGE_HEADER_IMAGES,
              value: JSON.stringify(updatedImages),
            },
            { transaction: t }
          );
        }

        // Handle defaultImage for PUT using processSettingImage
        const currentDefaultImageSetting = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.DEFAULT_IMAGE }, transaction: t });
        const currentDefaultImage = currentDefaultImageSetting?.value || null;

        if (defaultImage) {
          if (currentDefaultImage) deleteUploadedFile(currentDefaultImage, ["images", "defaults"]);
          const newDefaultImage = await saveUploadedFile(defaultImage, ["images", "defaults"], `${randomString(16)}-${Date.now()}`);
          await Settings.upsert({ id: settingsTopBoxesTypeLabels.DEFAULT_IMAGE, value: newDefaultImage || "" }, { transaction: t });
        } else if (defaultImage === null && currentDefaultImage) {
          await Settings.destroy({
            where: {
              id: settingsTopBoxesTypeLabels.DEFAULT_IMAGE,
            },
            transaction: t,
          });
        }
      });

      return reply.status(HTTP_STATUS_OK).send({ id: "all", ...(await getAllInstances()) });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });
};

// Helper to convert base64 string to file object
function base64ToFileObject(base64: string) {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 string");
  const type = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  return { type, buffer };
}

export default adminSettingsController;
