import { FC, ReactNode } from "react";
import { Edit, EditProps, SimpleForm, SimpleFormProps } from "react-admin";

interface IUpdateSimpleFormHOC {
  children: ReactNode | ReactNode[];
  simpleFormProps?: Omit<SimpleFormProps, "children">;
  updateProps?: EditProps;
}

const UpdateSimpleFormHOC: FC<IUpdateSimpleFormHOC> = ({ children, simpleFormProps, updateProps }) => (
  <Edit {...updateProps} mutationMode="pessimistic">
    <SimpleForm {...simpleFormProps}>{children}</SimpleForm>
  </Edit>
);

export default UpdateSimpleFormHOC;
