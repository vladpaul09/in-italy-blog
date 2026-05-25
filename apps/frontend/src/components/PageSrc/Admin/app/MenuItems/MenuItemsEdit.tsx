import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import MenuItemsForm from "./MenuItemsForm";

const MenuItemsEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <MenuItemsForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default MenuItemsEdit;
