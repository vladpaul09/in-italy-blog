import { FC, ReactNode } from "react";
import {
  Show,
  SimpleShowLayout,
  EditButton,
  ListButton,
  RefreshButton,
  DeleteWithConfirmButton,
  TopToolbar,
  useRecordContext,
  ShowProps,
} from "react-admin";

interface IShowSimpleHOC {
  restProps?: ShowProps;
  children: ReactNode | Array<ReactNode>;
}

const PostShowActions: FC = () => {
  const record = useRecordContext();
  return (
    <TopToolbar>
      <EditButton />
      <ListButton />
      <RefreshButton />
      {record && <DeleteWithConfirmButton />}
    </TopToolbar>
  );
};

const ShowSimpleHOC: FC<IShowSimpleHOC> = ({ children, restProps }) => (
  <Show actions={<PostShowActions />} {...restProps}>
    <SimpleShowLayout>{children}</SimpleShowLayout>
  </Show>
);

export default ShowSimpleHOC;
