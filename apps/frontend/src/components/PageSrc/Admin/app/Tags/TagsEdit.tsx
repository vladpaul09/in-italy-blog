import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import TagsForm from "./TagsForm";

const TagsEdit: FC = () => {
  return (
    <UpdateSimpleFormHOC>
      <TagsForm actionType="edit" />
    </UpdateSimpleFormHOC>
  );
};

export default TagsEdit;

