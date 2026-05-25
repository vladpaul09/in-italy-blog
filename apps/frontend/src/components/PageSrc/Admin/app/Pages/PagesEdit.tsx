import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import PagesForm from "./PagesForm";

const PagesEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <PagesForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default PagesEdit;
