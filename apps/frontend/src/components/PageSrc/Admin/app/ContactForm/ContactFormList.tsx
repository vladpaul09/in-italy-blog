import { FC } from "react";
import {
  Datagrid,
  List,
  NumberField,
  TextField,
  DateField,
  EmailField,
  TextInput,
} from "react-admin";

const ContactFormList: FC = () => {
  return (
    <List
      filters={[
        <TextInput source="name" alwaysOn />,
        <TextInput source="surname" alwaysOn />,
        <TextInput source="email" />,
        <TextInput source="phone" />
      ]}
    >
      <Datagrid rowClick="show">
        <NumberField source="id" />
        <TextField source="name" />
        <TextField source="surname" />
        <EmailField source="email" />
        <TextField source="phone" />
        <DateField source="createdAt" showTime />
      </Datagrid>
    </List>
  );
};

export default ContactFormList;
