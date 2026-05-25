import { FC } from "react";
import { Datagrid, List, NumberField, DateField, EmailField, TextInput } from "react-admin";

const NewsletterList: FC = () => {
  return (
    <List filters={[<TextInput source="email" alwaysOn />]}>
      <Datagrid rowClick="show">
        <EmailField source="email" />
        <DateField source="createdAt" showTime />
      </Datagrid>
    </List>
  );
};

export default NewsletterList;
