import { FC } from "react";
import CreateSimpleFormHOC from "../../hoc/CreateSimpleFormHOC";
import TagsForm from "./TagsForm";
import ResourceType from "../../entries/resourceType.entry";

const TagsCreate: FC = () => {
  return (
    <CreateSimpleFormHOC resource={ResourceType.Tags} action_type="create">
      <TagsForm actionType="create" />
    </CreateSimpleFormHOC>
  );
};

export default TagsCreate;
