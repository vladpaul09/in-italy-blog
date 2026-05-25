import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import PagesForm from "./PagesForm";
import ResourceType from "../../entries/resourceType.entry";

const PagesCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.Pages}>
    <PagesForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default PagesCreate;
