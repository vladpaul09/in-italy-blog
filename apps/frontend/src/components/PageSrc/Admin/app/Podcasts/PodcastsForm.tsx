import { FC } from "react";
import {
  AutocompleteArrayInput,
  Labeled,
  BooleanField,
  BooleanInput,
  ImageField,
  ImageInput,
  ReferenceArrayInput,
  required,
  SelectInput,
  SelectField,
  TextInput,
  useCanAccess,
  useResourceContext,
  useTranslate,
  ReferenceArrayField,
  ReferenceInput,
  AutocompleteInput,
  FormDataConsumer,
  useListController,
  RadioButtonGroupInput,
  Button,
  ReferenceField,
  ChipField,
  FunctionField,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LanguageArrayInput from "../../components/Inputs/LanguageArrayInput";
import config from "@/config";
import CKEditorInput from "../../components/Inputs/CKEditorInput";
import { postScopeChoices } from "../../entries/postScopeType.entry";
import ResourceType from "../../entries/resourceType.entry";
import LocationButton from "../../components/Buttons/LocationButton";
import CKEditorField from "../../components/Fields/CKEditorField";
import FieldText from "../../components/Fields/FieldText";
import { recordTraceEvents } from "next/dist/trace";

const PodcastsForm: FC<{ actionType: "create" | "edit" | "show" }> = ({ actionType }) => {
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
            <ReferenceArrayField
              source="municipalities"
              reference={ResourceType.Municipalities}
              sort={{ field: "id", order: "ASC" }}
              perPage={config.admin.suggestionLimit}
            />
          </Labeled>
        ) : (
          <ReferenceArrayInput
            source="municipalities"
            reference={ResourceType.Municipalities}
            sort={{ field: "id", order: "ASC" }}
            perPage={config.admin.suggestionLimit}
          >
            <AutocompleteArrayInput disabled={isShow} />
          </ReferenceArrayInput>
        )}
      </Grid>

      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ReferenceArrayField source="categories" reference={ResourceType.CategoriesPodcasts} />
          </Labeled>
        ) : (
          <ReferenceArrayInput
            source="categories"
            reference={ResourceType.CategoriesPodcasts}
            sort={{ field: "id", order: "ASC" }}
            perPage={config.admin.suggestionLimit}
          >
            <AutocompleteArrayInput optionText="name" />
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
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="latitude" /> : <TextInput source="latitude" disabled={isShow} />}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="longitude" /> : <TextInput source="longitude" disabled={isShow} />}</Grid>
      {!isShow && (
        <Grid size={12}>
          <LocationButton />
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
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <SelectField source="scope" choices={postScopeChoices} />
          </Labeled>
        ) : (
          <SelectInput source="scope" validate={required()} defaultValue={postScopeChoices[0].id} choices={postScopeChoices} />
        )}
      </Grid>
      <Grid size={12}>{isShow ? <FieldText source="youtubeLink" /> : <TextInput source="youtubeLink" disabled={isShow} />}</Grid>
      <Grid size={12}>
        <LanguageArrayInput source="podcastLanguages" isShow={isShow}>
          {isShow ? <FieldText source="title" /> : <TextInput source="title" disabled={isShow} />}
          {isShow ? <FieldText source="shortDescription" /> : <TextInput source="shortDescription" disabled={isShow} />}
          {isShow ? <CKEditorField source="description" /> : <CKEditorInput source="description" />}
        </LanguageArrayInput>
      </Grid>
    </Grid>
  );
};

export default PodcastsForm;
