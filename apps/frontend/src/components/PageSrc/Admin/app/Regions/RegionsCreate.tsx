import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import RegionsForm from "./RegionsForm";
import ResourceType from "../../entries/resourceType.entry";

const RegionsCreate: FC = () => (
  <CreateSimpleFormHOC resource={ResourceType.Regions} action_type="create">
    <RegionsForm actionType="create" />
  </CreateSimpleFormHOC>
)

export default RegionsCreate;