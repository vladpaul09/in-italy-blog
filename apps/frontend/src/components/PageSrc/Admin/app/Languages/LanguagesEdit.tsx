import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import LanguagesForm from "./LanguagesForm";

const LanguagesEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <LanguagesForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default LanguagesEdit;
