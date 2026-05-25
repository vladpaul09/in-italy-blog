import { FC } from "react";
import { useResourceContext } from "react-admin";
import CategoriesForm from "./CategoriesForm";
import ResourceType from "../../entries/resourceType.entry";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";

const CategoriesShow: FC = () => {
  const resource = useResourceContext();

  return (
    <ShowSimpleHOC>
      <CategoriesForm
        actionType="show"
        resource={resource as ResourceType.CategoriesArticles | ResourceType.CategoriesEvents | ResourceType.CategoriesPodcasts}
      />
    </ShowSimpleHOC>
  );
};

export default CategoriesShow;
