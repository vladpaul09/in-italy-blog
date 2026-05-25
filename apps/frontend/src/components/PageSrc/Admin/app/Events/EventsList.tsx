import { FC } from "react";
import {
  BooleanField,
  BulkDeleteButton,
  Datagrid,
  DateField,
  FunctionField,
  AutocompleteInput,
  List,
  NumberField,
  ReferenceArrayField,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
  useCanAccess,
  useLocale,
  useResourceContext,
} from "react-admin";
import ResourceType from "../../entries/resourceType.entry";
import BooleanSelectInput from "../../components/Inputs/BooleanSelectInput";
import EventsDateInput from "./EventsDateInput";

const EventsList: FC = () => {
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
  filtersArray.push(<ReferenceInput source="category" reference={ResourceType.CategoriesEvents} alwaysOn />);
  if (canAccessReview) {
    filtersArray.push(<BooleanSelectInput source="needsReview" alwaysOn />);
    filtersArray.push(<BooleanSelectInput source="publish" alwaysOn />);
    filtersArray.push(
      <ReferenceInput source="author" reference={ResourceType.Users}>
        <AutocompleteInput optionText={(record) => `${record.firstName} ${record.lastName}`} />
      </ReferenceInput>
    );
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
        <DateField
          source="startDate"
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
        <DateField
          source="endDate"
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
        <ReferenceArrayField source="categories" reference={ResourceType.CategoriesEvents} sortable={false} />
        <ReferenceField source="municipality" reference={ResourceType.Municipalities} sortable={false} link={false}>
          <FunctionField render={(record) => `${record.name}`} />
        </ReferenceField>
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

export default EventsList;
