import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import ProvincesForm from "./ProvincesForm";
import ResourceType from "../../entries/resourceType.entry";

const ProvincesCreate: FC = () => (
  <CreateSimpleFormHOC resource={ResourceType.Provinces} action_type="create">
    <ProvincesForm actionType="create" />
  </CreateSimpleFormHOC>
)

export default ProvincesCreate;