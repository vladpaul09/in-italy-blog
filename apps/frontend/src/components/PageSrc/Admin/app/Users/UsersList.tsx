import { FC } from "react";
import {
  BulkDeleteButton,
  Datagrid,
  List,
  NumberField,
  ReferenceArrayField,
  ReferenceInput,
  TextField,
  TextInput,
  useCanAccess,
  useResourceContext,
  AutocompleteInput,
} from "react-admin";
import ResourceType from "../../entries/resourceType.entry";

const UsersList: FC = () => {
  const resource = useResourceContext();

  const { canAccess: canAccessEdit } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  return (
    <List
      filters={[
        <TextInput source="firstName" alwaysOn />,
        <TextInput source="lastName" alwaysOn />,
        <ReferenceInput source="groups" reference={ResourceType.Groups}>
          <AutocompleteInput optionText="name" />
        </ReferenceInput>,
      ]}
    >
      <Datagrid rowClick={canAccessEdit ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <NumberField source="id" />
        <TextField source="firstName" />
        <TextField source="lastName" />
        <TextField source="email" />
        <ReferenceArrayField source="groups" reference={ResourceType.Groups} sortable={false} />
      </Datagrid>
    </List>
  );
};

export default UsersList;
