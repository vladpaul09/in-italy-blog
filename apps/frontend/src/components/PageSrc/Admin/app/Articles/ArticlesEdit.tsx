import { FC } from "react";
import UpdateSimpleFormHOC from "../../hoc/UpdateSimpleFormHOC";
import ArticlesCommonForm from "./ArticlesForm";

const ArticlesEdit: FC = () => (
  <UpdateSimpleFormHOC>
    <ArticlesCommonForm actionType="edit" />
  </UpdateSimpleFormHOC>
);

export default ArticlesEdit;
