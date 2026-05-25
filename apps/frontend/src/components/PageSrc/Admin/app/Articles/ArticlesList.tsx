import { FC } from "react";
import {
  BulkDeleteButton,
  Datagrid,
  List,
  NumberField,
  ReferenceArrayField,
  ReferenceInput,
  TextField,
  TextInput,
  useCanAccess,
  useResourceContext,
  BooleanField,
  ReferenceField,
  FunctionField,
  DateField,
  AutocompleteInput,
  SelectInput,
  useLocale,
} from "react-admin";
import ResourceType from "../../entries/resourceType.entry";
import BooleanSelectInput from "../../components/Inputs/BooleanSelectInput";
import EventsDateInput from "../Events/EventsDateInput";
import { postScopeChoices } from "../../entries/postScopeType.entry";

const ArticlesList: FC = () => {
  const resource = useResourceContext();
  const locale = useLocale();

  const { canAccess: canAccessReview } = useCanAccess({
    action: "review",
    resource: resource,
  });

  const { canAccess: canAccessEdit } = useCanAccess({
    action: "edit",
    resource: resource,
  });

  let filtersArray = [];
  filtersArray.push(<TextInput source="q" alwaysOn />);
  filtersArray.push(<ReferenceInput source="category" reference={ResourceType.CategoriesArticles} alwaysOn />);
  if (canAccessReview) {
    filtersArray.push(<BooleanSelectInput source="needsReview" alwaysOn />);
    filtersArray.push(<BooleanSelectInput source="publish" alwaysOn />);
    filtersArray.push(
      <ReferenceInput source="author" reference={ResourceType.Users}>
        <AutocompleteInput optionText={(record) => `${record.firstName} ${record.lastName}`} />
      </ReferenceInput>
    );
    filtersArray.push(<SelectInput source="scope" choices={postScopeChoices} />);
  }
  filtersArray.push(<EventsDateInput source="createdAtStart" size="small" />);
  filtersArray.push(<EventsDateInput source="createdAtEnd" size="small" />);
  filtersArray.push(
    <ReferenceInput source="municipality" reference={ResourceType.Municipalities}>
      <AutocompleteInput optionText="name" />
    </ReferenceInput>
  );

  return (
    <List filters={filtersArray}>
      <Datagrid rowClick={canAccessEdit ? "edit" : "show"} bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}>
        <NumberField source="id" />
        <TextField source="name" sortable={false} />
        <TextField source="authorName" sortable={false} />
        <ReferenceArrayField source="categories" reference={ResourceType.Categories} sortable={false} />
        <ReferenceArrayField source="municipalities" reference={ResourceType.Municipalities} sortable={false} />
        {canAccessReview && (
          <ReferenceField source="authorId" reference={ResourceType.Users} sortable={false} link={false}>
            <FunctionField render={(record) => `${record.firstName} ${record.lastName}`} />
          </ReferenceField>
        )}
        {canAccessReview && <BooleanField source="publish" sortable={false} />}
        <DateField
          source="createdAt"
          showTime
          locales={locale}
          options={{
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "numeric",
            second: "numeric",
            hour12: false,
          }}
        />
      </Datagrid>
    </List>
  );
};

export default ArticlesList;
