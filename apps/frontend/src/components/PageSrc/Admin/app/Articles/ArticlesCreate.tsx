import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import ArticlesCommonForm from "./ArticlesForm";
import ResourceType from "../../entries/resourceType.entry";

const ArticlesCreate: FC = () => (
  <CreateSimpleFormHOC action_type="create" resource={ResourceType.Articles}>
    <ArticlesCommonForm actionType="create" />
  </CreateSimpleFormHOC>
);

export default ArticlesCreate;
