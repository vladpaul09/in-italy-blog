import { FC } from "react";
import { Datagrid, List, NumberField, TextField, DateField, EmailField, TextInput } from "react-admin";

const BusinessRegistrationFormList: FC = () => {
  return (
    <List
      filters={[
        <TextInput source="company" alwaysOn />,
        <TextInput source="name" alwaysOn />,
        <TextInput source="surname" alwaysOn />,
        <TextInput source="email" />,
        <TextInput source="phone" />,
      ]}
    >
      <Datagrid rowClick="show">
        <NumberField source="id" />
        <TextField source="company" />
        <TextField source="fiscalCode" />
        <TextField source="name" />
        <TextField source="surname" />
        <EmailField source="email" />
        <TextField source="phone" />
        <DateField source="createdAt" showTime />
      </Datagrid>
    </List>
  );
};

export default BusinessRegistrationFormList;
