import { FC } from "react";
import {
  BulkDeleteButton,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
  useCanAccess,
  useResourceContext,
} from "react-admin";
import ResourceType from "../../entries/resourceType.entry";

const CategoriesList: FC = () => {
  const resource = useResourceContext();

  const { canAccess } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  return (
    <List
      filters={[
        <TextInput source="q" alwaysOn />,
        <ReferenceInput
          source="parent"
          reference={resource as ResourceType.CategoriesArticles | ResourceType.CategoriesEvents | ResourceType.CategoriesPodcasts}
          alwaysOn
        />,
      ]}
    >
      <Datagrid rowClick={canAccess ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <NumberField source="id" />
        <TextField source="name" sortable={false} />
        <ReferenceField
          source="parentId"
          reference={resource as ResourceType.CategoriesArticles | ResourceType.CategoriesEvents | ResourceType.CategoriesPodcasts}
          sortable={false}
        />
      </Datagrid>
    </List>
  );
};

export default CategoriesList;
