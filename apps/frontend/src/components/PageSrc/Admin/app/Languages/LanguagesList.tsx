import { FC } from "react";
import {
  BooleanField,
  BulkDeleteButton,
  Button,
  CreateButton,
  Datagrid,
  ExportButton,
  FilterButton,
  ImageField,
  List,
  NumberField,
  TextField,
  TopToolbar,
  useCanAccess,
  useResourceContext,
  useTranslate,
} from "react-admin";
import { Link } from "react-router-dom";
import SortIcon from "@mui/icons-material/Sort";
import ResourceType from "../../entries/resourceType.entry";

const LanguagesOrderButton: FC = () => {
  const translate = useTranslate();

  const { isPending, canAccess } = useCanAccess({
    resource: ResourceType.Languages,
    action: "list",
  });

  if (isPending || !canAccess) {
    return <></>;
  }

  return (
    <Button component={Link} to="order" label={translate("ra.action.sort")}>
      <SortIcon />
    </Button>
  );
};

const LanguagesList: FC = () => {
  const resource = useResourceContext();

  const { canAccess: canAccessEdit } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  return (
    <List
      actions={
        <TopToolbar>
          {/* <FilterButton /> */}
          <LanguagesOrderButton />
          <CreateButton />
          <ExportButton />
        </TopToolbar>
      }
    >
      <Datagrid rowClick={canAccessEdit ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <NumberField source="id" />
        <TextField source="name" />
        <BooleanField source="default" />
        <BooleanField source="status" />
        <ImageField source="image.src" title="image.title" sortable={false} />
      </Datagrid>
    </List>
  );
};

export default LanguagesList;
