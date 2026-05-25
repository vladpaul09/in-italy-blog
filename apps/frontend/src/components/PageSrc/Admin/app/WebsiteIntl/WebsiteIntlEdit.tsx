import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import WebsiteIntlForm from "./WebsiteIntlForm";

const WebsiteIntlEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <WebsiteIntlForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default WebsiteIntlEdit;
