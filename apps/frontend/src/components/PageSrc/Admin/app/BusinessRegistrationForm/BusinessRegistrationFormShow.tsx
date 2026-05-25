import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import { NumberField, TextField, DateField, EmailField } from "react-admin";

const BusinessRegistrationFormShow: FC = () => (
  <ShowSimpleHOC>
    <NumberField source="id" />
    <TextField source="company" />
    <TextField source="fiscalCode" />
    <TextField source="name" />
    <TextField source="surname" />
    <EmailField source="email" />
    <TextField source="phone" />
    <TextField source="note" />
    <DateField source="createdAt" showTime />
  </ShowSimpleHOC>
);

export default BusinessRegistrationFormShow;
