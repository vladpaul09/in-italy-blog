import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import ProvincesForm from "./ProvincesForm";

const ProvincesEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <ProvincesForm actionType="edit" />
  </UpdateSimpleFormHOC>
)

export default ProvincesEdit;