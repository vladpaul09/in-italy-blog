import { FC } from "react";
import { BooleanField, BulkDeleteButton, Datagrid, List, NumberField, ReferenceField, ReferenceInput, TextField, TextInput } from "react-admin";
import ResourceType from "../../entries/resourceType.entry";

const MenuItemsList: FC = () => (
  <List filters={[<TextInput source="q" alwaysOn />, <ReferenceInput source="parentId" reference={ResourceType.MenuItems} />]}>
    <Datagrid rowClick="edit" bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
      <NumberField source="id" />
      <TextField source="title" />
      <ReferenceField source="parentId" reference={ResourceType.MenuItems} sortable={false} />
      <BooleanField source="isVisible" sortable={false} />
    </Datagrid>
  </List>
);

export default MenuItemsList;
