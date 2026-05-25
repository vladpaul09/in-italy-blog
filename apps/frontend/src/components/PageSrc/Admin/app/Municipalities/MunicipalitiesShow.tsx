import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import MunicipalitiesForm from "./MunicipalitiesForm";

const MunicipalitiesShow: FC = () => (
  <ShowSimpleHOC>
    <MunicipalitiesForm actionType="show" />
  </ShowSimpleHOC>
);

export default MunicipalitiesShow;