import { CreateParams, CreateResult, DataProvider, UpdateParams, UpdateResult, fetchUtils } from "react-admin";
import mainDataProvider from "./mainDataProvider";
import imageToBase64 from "../utils/imageToBase64";

type InstanceParams = {
  id: string;
  homepageTopBoxOneCategoryArticleId: number;
  homepageTopBoxTwoCategoryArticleId: number;
  homepageTopBoxThreeCategoryArticleId: number;
  homepageTopBoxFourCategoryArticleId: number;
  homepageTopBoxFiveCategoryArticleId: number;
  homepageTopBoxOneCategoryEventId: number;
  homepageTopBoxTwoCategoryEventId: number;
  homepageTopBoxThreeCategoryEventId: number;
  homepageTopBoxFourCategoryEventId: number;
  homepageTopBoxFiveCategoryEventId: number;
  homepageTopBoxOneCategoryPodcastId: number;
  homepageTopBoxTwoCategoryPodcastId: number;
  homepageTopBoxThreeCategoryPodcastId: number;
  homepageTopBoxFourCategoryPodcastId: number;
  homepageTopBoxFiveCategoryPodcastId: number;
  homepageTopBoxOneArticleId: number;
  homepageTopBoxTwoArticleId: number;
  homepageTopBoxThreeArticleId: number;
  homepageTopBoxFourArticleId: number;
  homepageTopBoxFiveArticleId: number;
  homepageTopBoxOneEventId: number;
  homepageTopBoxTwoEventId: number;
  homepageTopBoxThreeEventId: number;
  homepageTopBoxFourEventId: number;
  homepageTopBoxFiveEventId: number;
  homepageTopBoxOneType: string;
  homepageTopBoxTwoType: string;
  homepageTopBoxThreeType: string;
  homepageTopBoxFourType: string;
  homepageTopBoxFiveType: string;
  homepageBottomBoxes: Array<{
    type: string;
    articleId?: number;
    eventId?: number;
    categoryArticleId?: number | null;
    categoryEventId?: number | null;
    categoryPodcastId?: number | null;
  }>;
  regionalArticles: Array<{
    categoryArticleId: number;
  }>;
  homepageAroundYou: Array<{
    categotyArticleId: number;
  }>;
  showcasePodcast: Array<{
    podcastId: number;
  }>;
  homepageHeaderImages: Array<{
    image: {
      rawFile: File;
      src?: string;
      title?: string;
    };
    mobileImage?: {
      rawFile: File;
      src?: string;
      title?: string;
    };
  }>;
  defaultImage?: {
    rawFile: File;
    src?: string;
    title?: string;
  };
};

const instanceData = async (params: CreateParams<InstanceParams> | UpdateParams<InstanceParams>) => {
  // Helper function to safely convert to number, defaulting to 0 if invalid
  const toNumber = (value: any): number => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  return {
    ...params.data,
    // Convert all number fields to proper numbers (defaulting to 0 if invalid)
    homepageTopBoxOneCategoryArticleId: toNumber(params.data.homepageTopBoxOneCategoryArticleId),
    homepageTopBoxTwoCategoryArticleId: toNumber(params.data.homepageTopBoxTwoCategoryArticleId),
    homepageTopBoxThreeCategoryArticleId: toNumber(params.data.homepageTopBoxThreeCategoryArticleId),
    homepageTopBoxFourCategoryArticleId: toNumber(params.data.homepageTopBoxFourCategoryArticleId),
    homepageTopBoxFiveCategoryArticleId: toNumber(params.data.homepageTopBoxFiveCategoryArticleId),
    homepageTopBoxOneCategoryEventId: toNumber(params.data.homepageTopBoxOneCategoryEventId),
    homepageTopBoxTwoCategoryEventId: toNumber(params.data.homepageTopBoxTwoCategoryEventId),
    homepageTopBoxThreeCategoryEventId: toNumber(params.data.homepageTopBoxThreeCategoryEventId),
    homepageTopBoxFourCategoryEventId: toNumber(params.data.homepageTopBoxFourCategoryEventId),
    homepageTopBoxFiveCategoryEventId: toNumber(params.data.homepageTopBoxFiveCategoryEventId),
    homepageTopBoxOneCategoryPodcastId: toNumber(params.data.homepageTopBoxOneCategoryPodcastId),
    homepageTopBoxTwoCategoryPodcastId: toNumber(params.data.homepageTopBoxTwoCategoryPodcastId),
    homepageTopBoxThreeCategoryPodcastId: toNumber(params.data.homepageTopBoxThreeCategoryPodcastId),
    homepageTopBoxFourCategoryPodcastId: toNumber(params.data.homepageTopBoxFourCategoryPodcastId),
    homepageTopBoxFiveCategoryPodcastId: toNumber(params.data.homepageTopBoxFiveCategoryPodcastId),
    homepageTopBoxOneArticleId: toNumber(params.data.homepageTopBoxOneArticleId),
    homepageTopBoxTwoArticleId: toNumber(params.data.homepageTopBoxTwoArticleId),
    homepageTopBoxThreeArticleId: toNumber(params.data.homepageTopBoxThreeArticleId),
    homepageTopBoxFourArticleId: toNumber(params.data.homepageTopBoxFourArticleId),
    homepageTopBoxFiveArticleId: toNumber(params.data.homepageTopBoxFiveArticleId),
    homepageTopBoxOneEventId: toNumber(params.data.homepageTopBoxOneEventId),
    homepageTopBoxTwoEventId: toNumber(params.data.homepageTopBoxTwoEventId),
    homepageTopBoxThreeEventId: toNumber(params.data.homepageTopBoxThreeEventId),
    homepageTopBoxFourEventId: toNumber(params.data.homepageTopBoxFourEventId),
    homepageTopBoxFiveEventId: toNumber(params.data.homepageTopBoxFiveEventId),
    homepageHeaderImages: await Promise.all(
      (params.data.homepageHeaderImages || []).map(async (obj) => ({
        ...obj,
        image: {
          rawFile: obj.image ? (obj.image.rawFile ? await imageToBase64(obj.image.rawFile) : undefined) : undefined,
          src: obj.image ? (obj.image.src ? obj.image.src : undefined) : undefined,
          title: obj.image ? (obj.image.rawFile ? obj.image.rawFile.name : obj.image.title) : undefined,
        },
        mobileImage: obj.mobileImage ? {
          rawFile: obj.mobileImage.rawFile ? await imageToBase64(obj.mobileImage.rawFile) : undefined,
          src: obj.mobileImage.src ? obj.mobileImage.src : undefined,
          title: obj.mobileImage.rawFile ? obj.mobileImage.rawFile.name : obj.mobileImage.title,
        } : undefined,
      }))
    ),
    defaultImage: params.data.defaultImage
      ? params.data.defaultImage.rawFile
        ? await imageToBase64(params.data.defaultImage?.rawFile)
        : undefined
      : undefined,
  };
};

const settingsDataProvider = (apiUrl: string, httpClient: Function = fetchUtils.fetchJson): DataProvider => ({
  ...mainDataProvider(apiUrl, httpClient),
  create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    const parsedParams = await instanceData(params);
    const { json } = await httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(parsedParams),
    });
    return {
      data: { ...json },
    };
  },
  update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
    const parsedParams = await instanceData(params);
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(parsedParams),
    });
    return {
      data: { ...json },
    };
  },
});

export default settingsDataProvider;
