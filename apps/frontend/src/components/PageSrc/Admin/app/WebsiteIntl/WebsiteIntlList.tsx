import { FC } from "react";
import {
  BulkDeleteButton,
  Datagrid,
  List,
  TextField,
  TextInput,
  useCanAccess,
  useResourceContext,
  NumberField,
} from "react-admin";

const WebsiteIntlList: FC = () => {
  const resource = useResourceContext();

  const { canAccess: canAccessEdit } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  return (
    <List filters={[<TextInput source="q" alwaysOn />, <TextInput source="id" />]}>
      <Datagrid rowClick={canAccessEdit ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <NumberField source="id" />
        <TextField source="languages.it.value" />
      </Datagrid>
    </List>
  );
};

export default WebsiteIntlList;
