import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import RegionsForm from "./RegionsForm";

const RegionsShow: FC = () => (
  <ShowSimpleHOC>
    <RegionsForm actionType="show" />
  </ShowSimpleHOC>
);

export default RegionsShow;