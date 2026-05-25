import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import GroupsForm from "./GroupsForm";

const GroupsEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <GroupsForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default GroupsEdit;
