import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import MunicipalitiesForm from "./MunicipalitiesForm";

const MunicipalitiesEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <MunicipalitiesForm actionType="edit" />
  </UpdateSimpleFormHOC>
)

export default MunicipalitiesEdit;