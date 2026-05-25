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

const MunicipalitiesList: FC = () => {
  const resource = useResourceContext();

  const { canAccess: canAccessEdit } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  return (
    <List filters={[<TextInput source="q" alwaysOn />, <ReferenceInput source="provinceId" reference={ResourceType.Provinces} alwaysOn />]}>
      <Datagrid rowClick={canAccessEdit ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <TextField source="id" />
        <TextField source="name" />
        <ReferenceField source="provinceId" reference={ResourceType.Provinces}>
          <TextField source="name" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
};

export default MunicipalitiesList;
