import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import MenuItemsForm from "./MenuItemsForm";
import ResourceType from "../../entries/resourceType.entry";

const MenuItemsCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.MenuItems}>
    <MenuItemsForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default MenuItemsCreate;
