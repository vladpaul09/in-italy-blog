import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import PodcastsForm from "./PodcastsForm";

const PodcastsShow: FC = () => (
  <ShowSimpleHOC>
    <PodcastsForm actionType="show" />
  </ShowSimpleHOC>
);

export default PodcastsShow;
