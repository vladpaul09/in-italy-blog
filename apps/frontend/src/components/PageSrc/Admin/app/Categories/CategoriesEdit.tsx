import { FC } from "react";
import { useResourceContext } from "react-admin";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import CategoriesForm from "./CategoriesForm";
import ResourceType from "../../entries/resourceType.entry";

const CategoriesEdit: FC = () => {
  const resource = useResourceContext();

  return (
    <UpdateSimpleFormHOC>
      <CategoriesForm
        actionType="edit"
        resource={resource as ResourceType.CategoriesArticles | ResourceType.CategoriesEvents | ResourceType.CategoriesPodcasts}
      />
    </UpdateSimpleFormHOC>
  );
};

export default CategoriesEdit;
