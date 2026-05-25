import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import UsersForm from "./UsersForm";

const UsersEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <UsersForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default UsersEdit;
