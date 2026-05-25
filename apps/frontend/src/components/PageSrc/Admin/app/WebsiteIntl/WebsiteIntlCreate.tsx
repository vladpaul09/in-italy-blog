import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import WebsiteIntlForm from "./WebsiteIntlForm";
import ResourceType from "../../entries/resourceType.entry";

const WebsiteIntlCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.WebsiteIntl}>
    <WebsiteIntlForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default WebsiteIntlCreate;
