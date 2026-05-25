import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import ResourceType from "../../entries/resourceType.entry";
import LanguagesForm from "./LanguagesForm";

const LanguagesCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.Languages}>
    <LanguagesForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default LanguagesCreate;
