import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import PodcastsForm from "./PodcastsForm";
import ResourceType from "../../entries/resourceType.entry";

const PodcastsCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.Podcasts}>
    <PodcastsForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default PodcastsCreate;
