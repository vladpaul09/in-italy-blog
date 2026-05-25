import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import RegionsForm from "./RegionsForm";

const RegionsEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <RegionsForm actionType="edit" />
  </UpdateSimpleFormHOC>
)

export default RegionsEdit;