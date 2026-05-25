import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import ProvincesForm from "./ProvincesForm";

const ProvincesShow: FC = () => (
  <ShowSimpleHOC>
    <ProvincesForm actionType="show" />
  </ShowSimpleHOC>
);

export default ProvincesShow;