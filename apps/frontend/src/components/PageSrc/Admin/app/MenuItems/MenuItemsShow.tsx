import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import { BooleanField, ImageField, NumberField, ReferenceField, TextField } from "react-admin";

const MenuItemsShow: FC = () => (
  <ShowSimpleHOC>
    <NumberField source="id" />
        <TextField source="url" />
        <ImageField source="icon.src" title="icon.title" />
        <TextField source="type" />
        <BooleanField source="isVisible" />
        <NumberField source="position" />
        <ReferenceField source="parentId" reference="menu-items">
          <TextField source="title" />
        </ReferenceField>
        <TextField source="title" />
  </ShowSimpleHOC>
);

export default MenuItemsShow;
