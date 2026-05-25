import { FC } from "react";
import { 
  BulkDeleteButton, 
  Datagrid, 
  List, 
  ReferenceField, 
  ReferenceInput, 
  TextField, 
  TextInput,
  useCanAccess,
  useResourceContext,
} from "react-admin";
import ResourceType from "../../entries/resourceType.entry";

const ProvincesList: FC = () => {
  const resource = useResourceContext();

  const { canAccess: canAccessEdit } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  return (
    <List filters={[<TextInput source="q" alwaysOn />, <ReferenceInput source="regionId" reference={ResourceType.Regions} alwaysOn />]}>
      <Datagrid rowClick={canAccessEdit ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <TextField source="id" />
        <TextField source="name" />
        <ReferenceField source="regionId" reference={ResourceType.Regions}>
          <TextField source="name" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
};

export default ProvincesList;
