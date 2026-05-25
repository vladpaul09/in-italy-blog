import { FC } from "react";
import { BooleanField, BulkDeleteButton, Datagrid, List, NumberField, TextField, TextInput, useCanAccess, useResourceContext } from "react-admin";

const PagesList: FC = () => {
  const resource = useResourceContext();

  const { canAccess } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  return (
    <List filters={[<TextInput source="q" alwaysOn />]}>
      <Datagrid rowClick={canAccess ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <NumberField source="id" />
        <TextField source="name" sortable={false} />
        <TextField source="slug" sortable={false} />
        <BooleanField source="publish" sortable={false} />
      </Datagrid>
    </List>
  );
};

export default PagesList;
