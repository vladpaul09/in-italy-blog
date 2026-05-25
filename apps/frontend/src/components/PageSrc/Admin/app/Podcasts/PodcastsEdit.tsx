import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import PodcastsForm from "./PodcastsForm";

const PodcastsEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <PodcastsForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default PodcastsEdit;
