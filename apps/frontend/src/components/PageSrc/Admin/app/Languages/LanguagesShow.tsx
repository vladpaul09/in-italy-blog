import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import LanguagesForm from "./LanguagesForm";

const LanguagesShow: FC = () => (
  <ShowSimpleHOC>
    <LanguagesForm actionType="show" />
  </ShowSimpleHOC>
);

export default LanguagesShow;
