import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import WebsiteIntlForm from "./WebsiteIntlForm";

const WebsiteIntlShow: FC = () => (
  <ShowSimpleHOC>
    <WebsiteIntlForm actionType="show" />
  </ShowSimpleHOC>
);

export default WebsiteIntlShow;
