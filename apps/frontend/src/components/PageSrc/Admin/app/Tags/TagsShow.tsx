import { FC } from "react";
import TagsForm from "./TagsForm";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";

const TagsShow: FC = () => {
  return (
    <ShowSimpleHOC>
      <TagsForm actionType="show" />
    </ShowSimpleHOC>
  );
};

export default TagsShow;
