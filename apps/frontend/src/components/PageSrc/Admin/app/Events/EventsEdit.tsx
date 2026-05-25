import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import EventsCommonForm from "./EventsForm";

const EventsEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <EventsCommonForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default EventsEdit;
