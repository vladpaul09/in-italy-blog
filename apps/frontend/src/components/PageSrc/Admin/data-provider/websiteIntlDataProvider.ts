import { DataProvider, UpdateParams, UpdateResult, fetchUtils } from "react-admin";
import mainDataProvider from "./mainDataProvider";

const websiteIntlDataProvider = (apiUrl: string, httpClient: Function = fetchUtils.fetchJson): DataProvider => ({
  ...mainDataProvider(apiUrl, httpClient),
  update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });
    return { data: { ...json, id: params.id } };
  },
});

export default websiteIntlDataProvider;
