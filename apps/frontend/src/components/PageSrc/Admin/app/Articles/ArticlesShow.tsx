import { FC } from "react";
import ShowSimpleHOC from "../../hoc/ShowSimpleHOC";
import ArticlesForm from "./ArticlesForm";

const ArticlesShow: FC = () => (
  <ShowSimpleHOC>
    <ArticlesForm actionType="show" />
  </ShowSimpleHOC>
);

export default ArticlesShow;
