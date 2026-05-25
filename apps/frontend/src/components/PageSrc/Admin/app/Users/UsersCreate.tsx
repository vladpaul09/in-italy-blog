import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import UsersForm from "./UsersForm";
import ResourceType from "../../entries/resourceType.entry";

const UsersCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.Users}>
    <UsersForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default UsersCreate;
