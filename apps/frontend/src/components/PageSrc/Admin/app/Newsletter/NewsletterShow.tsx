import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import { NumberField, DateField, EmailField } from "react-admin";

const NewsletterShow: FC = () => (
  <ShowSimpleHOC>
    <NumberField source="id" />
    <EmailField source="email" />
    <DateField source="createdAt" showTime />
  </ShowSimpleHOC>
);

export default NewsletterShow;
