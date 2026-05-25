import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import { NumberField, TextField, DateField, EmailField } from "react-admin";

const ContactFormShow: FC = () => (
  <ShowSimpleHOC>
    <NumberField source="id" />
    <TextField source="name" />
    <TextField source="surname" />
    <EmailField source="email" />
    <TextField source="phone" />
    <TextField source="note" />
    <DateField source="createdAt" showTime />
  </ShowSimpleHOC>
);

export default ContactFormShow;
