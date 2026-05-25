import { FC, ReactNode } from "react";
import { Create, CreateProps, SimpleForm, SimpleFormProps } from "react-admin";
import ResourceType from "../entries/resourceType.entry";

interface ICreateSimpleFormHOC {
  action_type: "create";
  resource: ResourceType;
  children: ReactNode | ReactNode[];
  simpleFormProps?: Omit<SimpleFormProps, "children">;
  createProps?: CreateProps;
}

const CreateSimpleFormHOC: FC<ICreateSimpleFormHOC> = ({ action_type, resource, children, simpleFormProps, createProps }) => (
  <Create redirect="list" {...createProps}>
    <SimpleForm {...simpleFormProps}>{children}</SimpleForm>
  </Create>
);

export default CreateSimpleFormHOC;
