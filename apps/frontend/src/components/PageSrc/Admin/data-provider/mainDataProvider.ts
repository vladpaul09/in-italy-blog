import {
  CreateParams,
  CreateResult,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
  fetchUtils,
  DataProvider,
  Identifier,
  PaginationPayload,
  SortPayload,
} from "react-admin";
import { stringify } from "query-string";

const mainDataProvider = (apiUrl: string, httpClient: Function = fetchUtils.fetchJson): DataProvider => {
  const getOneJson = (resource: string, id: Identifier) => httpClient(`${apiUrl}/${resource}/${id}`).then((response: Response) => response.json);

  return {
    getList: async (resource: string, params: GetListParams): Promise<GetListResult> => {
      const { page, perPage } = params.pagination as PaginationPayload;
      const { field, order } = params.sort as SortPayload;
      const query = {
        sortBy: field,
        sortOrder: order,
        rangeFirst: (page - 1) * perPage,
        rangeLast: page * perPage - 1,
        filter: JSON.stringify(params.filter),
      };
      const { json } = await httpClient(`${apiUrl}/${resource}?${stringify(query)}`, { signal: params.signal });
      return {
        data: json.data,
        total: json.total,
      };
    },

    getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
      const data = await getOneJson(resource, params.id);
      return {
        data,
      };
    },

    getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
      const query = {
        filter: JSON.stringify({ ids: params.ids.flat() }),
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      const { json } = await httpClient(url, { signal: params.signal });
      return { data: json.data };
    },

    getManyReference: async (resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult> => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify(params.filter),
      };
      const { json } = await httpClient(`${apiUrl}/${resource}/?${stringify(query)}`);
      return {
        data: json.data,
        total: json.total,
      };
    },

    create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
      const { json } = await httpClient(`${apiUrl}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return {
        data: { ...json },
      };
    },

    update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });
      return { data: { ...json}};
    },

    updateMany: async (resource: string, params: UpdateManyParams): Promise<UpdateManyResult> =>
      Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(params.data),
          }),
        ),
      ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),

    delete: async (resource: string, params: DeleteParams): Promise<DeleteResult> =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "DELETE",
        body: JSON.stringify({}),
      }).then(() => ({ data: params.previousData })),

    deleteMany: async (resource: string, params: DeleteManyParams): Promise<DeleteManyResult> =>
      Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: "DELETE",
            body: JSON.stringify({}),
          }),
        ),
      ).then(() => ({ data: [] })),
  };
};

export default mainDataProvider;
