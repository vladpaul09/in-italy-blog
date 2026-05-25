import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import UsersForm from "./UsersForm";

const UsersShow: FC = () => (
  <ShowSimpleHOC>
    <UsersForm actionType="show" />
  </ShowSimpleHOC>
);

export default UsersShow;
