import { FC } from "react";
import EventsForm from "./EventsForm";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";

const EventsShow: FC = () => (
  <ShowSimpleHOC>
    <EventsForm actionType="show" />
  </ShowSimpleHOC>
);

export default EventsShow;
