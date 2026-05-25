import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import MunicipalitiesForm from "./MunicipalitiesForm";
import ResourceType from "../../entries/resourceType.entry";

const MunicipalitiesCreate: FC = () => (
  <CreateSimpleFormHOC resource={ResourceType.Municipalities} action_type="create">
    <MunicipalitiesForm actionType="create" />
  </CreateSimpleFormHOC>
)

export default MunicipalitiesCreate;