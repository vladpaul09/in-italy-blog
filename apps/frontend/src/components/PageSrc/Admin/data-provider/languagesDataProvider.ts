import { CreateParams, CreateResult, DataProvider, UpdateParams, UpdateResult, fetchUtils } from "react-admin";
import mainDataProvider from "./mainDataProvider";
import imageToBase64 from "../utils/imageToBase64";

type InstanceParams = {
  id: number;
  name: string;
  default: boolean;
  status: boolean;
  image: {
    rawFile: File;
    src?: string;
    title?: string;
  };
};

const instanceData = async (params: CreateParams<InstanceParams> | UpdateParams<InstanceParams>) => {
  return {
    ...params.data,
    image: params.data.image ? (params.data.image.rawFile ? await imageToBase64(params.data.image?.rawFile) : undefined) : undefined,
  };
};

const languagesDataProvider = (apiUrl: string, httpClient: Function = fetchUtils.fetchJson): DataProvider => ({
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

export default languagesDataProvider;
