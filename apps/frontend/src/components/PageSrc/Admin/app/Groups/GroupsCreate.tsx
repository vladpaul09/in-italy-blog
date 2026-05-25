import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import GroupsForm from "./GroupsForm";
import ResourceType from "../../entries/resourceType.entry";

const GroupsCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.Groups}>
    <GroupsForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default GroupsCreate;
