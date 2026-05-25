import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import GroupsForm from "./GroupsForm";

const GroupsShow: FC = () => (
  <ShowSimpleHOC>
    <GroupsForm actionType="show" />
  </ShowSimpleHOC>
);

export default GroupsShow;
