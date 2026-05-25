import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import EventsCommonForm from "./EventsForm";
import ResourceType from "../../entries/resourceType.entry";

const EventsCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.Events}>
    <EventsCommonForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default EventsCreate;
