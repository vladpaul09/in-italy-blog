import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import PagesForm from "./PagesForm";

const PagesShow: FC = () => (
  <ShowSimpleHOC>
    <PagesForm actionType="show" />
  </ShowSimpleHOC>
);

export default PagesShow;
