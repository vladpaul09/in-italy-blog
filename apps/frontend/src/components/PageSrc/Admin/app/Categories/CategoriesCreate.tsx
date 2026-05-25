import { FC } from "react";
import { useResourceContext } from "react-admin";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import CategoriesForm from "./CategoriesForm";
import ResourceType from "../../entries/resourceType.entry";

const CategoriesCreate: FC = () => {
  const resource = useResourceContext();
  
  return (
    <CreateSimpleFormHOC
      resource={resource as ResourceType.CategoriesArticles | ResourceType.CategoriesEvents | ResourceType.CategoriesPodcasts}
      action_type="create"
    >
      <CategoriesForm
        actionType="create"
        resource={resource as ResourceType.CategoriesArticles | ResourceType.CategoriesEvents | ResourceType.CategoriesPodcasts}
      />
    </CreateSimpleFormHOC>
  );
};

export default CategoriesCreate;
