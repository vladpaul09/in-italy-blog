import { FC } from "react";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  BooleanInput,
  ImageField,
  ImageInput,
  ReferenceArrayInput,
  ReferenceInput,
  TextInput,
  useTranslate,
  useResourceContext,
  useCanAccess,
  BooleanField,
  Labeled,
  ReferenceField,
  ReferenceArrayField,
  FormDataConsumer,
  RadioButtonGroupInput,
  Button,
  useListController,
  FunctionField,
  ChipField,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LanguageArrayInput from "../../components/Inputs/LanguageArrayInput";
import config from "@/config";
import EventsDateInput from "./EventsDateInput";
import LocationButton from "../../components/Buttons/LocationButton";
import CKEditorInput from "../../components/Inputs/CKEditorInput";
import ResourceType from "../../entries/resourceType.entry";
import FieldText from "../../components/Fields/FieldText";
import CKEditorField from "../../components/Fields/CKEditorField";
import FieldDateTime from "../../components/Fields/FieldDateTime";

const EventsCommonForm: FC<{ actionType: "create" | "edit" | "show" }> = ({ actionType }) => {
  const resource = useResourceContext();
  const translate = useTranslate();

  const formContext = useFormContext();

  const { canAccess } = useCanAccess({
    action: "publish",
    resource: resource,
  });

  const { data: users } = useListController({
    resource: ResourceType.Users,
    sort: { field: "id", order: "ASC" },
    perPage: config.admin.suggestionLimit,
  });

  const { canAccess: canAccessAuthor } = useCanAccess({
    action: "field.author",
    resource: resource,
  });

  const isShow = actionType === "show";
  const isEdit = actionType === "edit";

  return (
    <Grid container spacing={2}>
      {isShow && (
        <>
          <Grid size={12}>
            <FieldText source="id" />
          </Grid>
          <Grid size={12}>
            <FieldText source="slug" />
          </Grid>
        </>
      )}
      {isEdit && (
        <>
          <Grid size={12}>
            <TextInput source="id" disabled />
          </Grid>
          <Grid size={12}>
            <TextInput source="slug" />
          </Grid>
        </>
      )}
      {canAccessAuthor && (
        <Grid size={12}>
          {!isShow ? (
            <>
              <ReferenceInput source="authorId" reference={ResourceType.Users}>
                <AutocompleteInput optionText={(record) => `${record.firstName} ${record.lastName}`} />
              </ReferenceInput>
              <FormDataConsumer<{ authorId: number }>>
                {({ formData, ...rest }) => {
                  if (formData.authorId) {
                    const author = (users || []).find((item) => item.id === formData.authorId);

                    if (author) {
                      if ((author.aliases || []).length > 0) {
                        return (
                          <>
                            <RadioButtonGroupInput
                              source="authorAliasId"
                              choices={author.aliases.map((alias: { id: number; name: string }) => ({ id: alias.id, name: alias.name }))}
                              {...rest}
                            />
                            <Button onClick={() => formContext.setValue("authorAliasId", undefined)}>Reset</Button>
                          </>
                        );
                      }
                    }
                  }
                  return null;
                }}
              </FormDataConsumer>
            </>
          ) : (
            <>
              <Labeled>
                <ReferenceField source="authorId" reference={ResourceType.Users}>
                  <FunctionField
                    render={(record) => <ChipField source="firstName" record={{ firstName: `${record.firstName} ${record.lastName}` }} />}
                  />
                </ReferenceField>
              </Labeled>
              <br />
              <Labeled>
                <ReferenceField source="authorAliasId" reference={ResourceType.Users}>
                  <FunctionField
                    render={(record) => <ChipField source="firstName" record={{ firstName: `${record.firstName} ${record.lastName}` }} />}
                  />
                </ReferenceField>
              </Labeled>
            </>
          )}
        </Grid>
      )}
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ReferenceField source="municipalityId" reference={ResourceType.Municipalities} />
          </Labeled>
        ) : (
          <ReferenceInput
            source="municipalityId"
            reference={ResourceType.Municipalities}
            sort={{ field: "id", order: "ASC" }}
            perPage={config.admin.suggestionLimit}
          >
            <AutocompleteInput disabled={isShow} />
          </ReferenceInput>
        )}
      </Grid>
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ReferenceArrayField source="categories" reference={ResourceType.CategoriesEvents} />
          </Labeled>
        ) : (
          <ReferenceArrayInput
            source="categories"
            reference={ResourceType.CategoriesEvents}
            sort={{ field: "id", order: "ASC" }}
            perPage={config.admin.suggestionLimit}
          >
            <AutocompleteArrayInput disabled={isShow} />
          </ReferenceArrayInput>
        )}
      </Grid>
      {canAccess && (
        <Grid size={12}>
          {isShow ? (
            <Labeled>
              <BooleanField source="publish" />
            </Labeled>
          ) : (
            <BooleanInput source="publish" />
          )}
        </Grid>
      )}
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ImageField source="image.src" title="image.title" />
          </Labeled>
        ) : (
          <ImageInput
            source="image"
            placeholder={
              <Typography component="p" sx={{ py: 3 }}>
                {translate(`resources.${resource}.imagePlaceholderText`)}
              </Typography>
            }
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        )}
      </Grid>
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ImageField source="mobileImage.src" title="mobileImage.title" />
          </Labeled>
        ) : (
          <ImageInput
            source="mobileImage"
            placeholder={
              <Typography component="p" sx={{ py: 3 }}>
                {translate(`resources.${resource}.mobileImagePlaceholderText`)}
              </Typography>
            }
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {isShow ? (
          <Labeled>
            <BooleanField source="regionLevel" />
          </Labeled>
        ) : (
          <BooleanInput source="regionLevel" />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {isShow ? (
          <Labeled>
            <BooleanField source="provinceLevel" />
          </Labeled>
        ) : (
          <BooleanInput source="provinceLevel" />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="latitude" /> : <TextInput source="latitude" disabled={isShow} />}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="longitude" /> : <TextInput source="longitude" disabled={isShow} />}</Grid>
      {!isShow && (
        <Grid size={12}>
          <LocationButton />
        </Grid>
      )}
      <Grid size={{ xs: 12, md: 6 }}>
        {isShow ? (
          <FieldDateTime source="dateInterval.startDate" />
        ) : (
          <EventsDateInput source="dateInterval.startDate" disablePast disabled={isShow} />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {isShow ? <FieldDateTime source="dateInterval.endDate" /> : <EventsDateInput source="dateInterval.endDate" disablePast disabled={isShow} />}
      </Grid>
      <LanguageArrayInput source="eventLanguages" isShow={isShow}>
        {isShow ? <FieldText source="title" /> : <TextInput source="title" disabled={isShow} />}
        {isShow ? <CKEditorField source="description" /> : <CKEditorInput source="description" />}
      </LanguageArrayInput>
    </Grid>
  );
};

export default EventsCommonForm;
