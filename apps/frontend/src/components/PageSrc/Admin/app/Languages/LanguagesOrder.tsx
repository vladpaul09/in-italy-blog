import { FC } from "react";
import { Loading, useGetList, CanAccess, AccessDenied } from "react-admin";
import { useNotify } from "ra-core";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Sortable, Props as SortableProps } from "../../components/Sortable/Sortable";
import httpClient from "../../data-provider/httpClient";
import config from "@/config";
import ResourceType from "../../entries/resourceType.entry";

const props: Partial<SortableProps> = {
  strategy: verticalListSortingStrategy,
  itemCount: 50,
};

const CompanyProviderOrder: FC = () => {
  const { data, isLoading } = useGetList(ResourceType.Languages, { pagination: { page: 1, perPage: 100 }, filter: { status: 1 } });
  const notify = useNotify();

  const postData = (list: Array<number>) => {
    httpClient(`${config.admin.mainDataProviderUrlBase}/languages/list/sort`, {
      method: "POST",
      body: JSON.stringify({ data: list }),
    })
      .then(() => notify("Success!", { type: "success" }))
      .catch(() => {
        notify("Server error!", { type: "error" });
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <CanAccess resource={ResourceType.Languages} action="list" accessDenied={<AccessDenied />}>
      <Sortable
        {...props}
        handler={postData}
        data={
          data ? data.sort((a, b) => a.sort_order - b.sort_order).map((item, index) => ({ id: item.id, name: item.name, orderId: index + 1 })) : []
        }
      />
    </CanAccess>
  );
};

export default CompanyProviderOrder;
