import { FC } from "react";
import { 
  BulkDeleteButton, 
  Datagrid, 
  List, 
  NumberField, 
  TextField, 
  TextInput,
  useCanAccess,
  useResourceContext,
} from "react-admin";

const RegionsList: FC = () => {
  const resource = useResourceContext();

  const { canAccess: canAccessEdit } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  return (
    <List filters={[<TextInput source="q" alwaysOn />]}>
      <Datagrid rowClick={canAccessEdit ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <NumberField source="id" />
        <TextField source="name" />
      </Datagrid>
    </List>
  );
};

export default RegionsList;