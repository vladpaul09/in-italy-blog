import { CreateParams, CreateResult, DataProvider, UpdateParams, UpdateResult, fetchUtils } from "react-admin";
import mainDataProvider from "./mainDataProvider";
import imageToBase64 from "../utils/imageToBase64";
import menuItemTypeEntry from "../entries/menuItemType.entry";

type InstanceParams = {
  id: number;
  type: (typeof menuItemTypeEntry)[number]["id"];
  isVisible: boolean;
  position: number;
  parentId?: number | null;
  categoryId?: number | null;
  url?: string;
  icon?: {
    rawFile: File;
    src?: string;
    title?: string;
  };
  menuItemLanguages: Array<{
    lang_id: number;
    title: string;
  }>;
};

const instanceData = async (params: CreateParams<InstanceParams> | UpdateParams<InstanceParams>) => {
  return {
    ...params.data,
    icon: params.data.icon ? (params.data.icon.rawFile ? await imageToBase64(params.data.icon?.rawFile) : undefined) : undefined,
  };
};

const menuItemsDataProvider = (apiUrl: string, httpClient: Function = fetchUtils.fetchJson): DataProvider => ({
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

export default menuItemsDataProvider;
