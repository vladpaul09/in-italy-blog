import { FC } from "react";
import {
  TextInput,
  ReferenceInput,
  ImageInput,
  ImageField,
  AutocompleteInput,
  useTranslate,
  Labeled,
  ReferenceField,
  SelectInput,
  SelectField,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  ReferenceArrayField,
} from "react-admin";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LanguageArrayInput from "../../components/Inputs/LanguageArrayInput";
import CKEditorInput from "../../components/Inputs/CKEditorInput";
import ResourceType from "../../entries/resourceType.entry";
import FieldText from "../../components/Fields/FieldText";
import CKEditorField from "../../components/Fields/CKEditorField";
import CategoryPageView from "@/entries/categoryPageView.entry";
import config from "@/config";

const CategoriesForm: FC<{ actionType: "edit" | "create" | "show"; resource: ResourceType }> = ({ actionType, resource }) => {
  const translate = useTranslate();

  const isShow = actionType === "show";
  const isEdit = actionType === "edit";

  const pageViewChoices =
    resource === ResourceType.CategoriesArticles
      ? [
          { id: CategoryPageView.POSTS_VIEW, name: `pageViewValues.${CategoryPageView.POSTS_VIEW}` },
          { id: CategoryPageView.REGIONAL_VIEW, name: `pageViewValues.${CategoryPageView.REGIONAL_VIEW}` },
          { id: CategoryPageView.PARENT_CATEGORY_VIEW, name: `pageViewValues.${CategoryPageView.PARENT_CATEGORY_VIEW}` },
        ]
      : [
          { id: CategoryPageView.POSTS_VIEW, name: `pageViewValues.${CategoryPageView.POSTS_VIEW}` },
          { id: CategoryPageView.REGIONAL_VIEW, name: `pageViewValues.${CategoryPageView.REGIONAL_VIEW}` },
        ];

  return (
    <Grid container spacing={1} sx={{ width: "100%" }}>
      {isEdit && (
        <Grid size={12}>
          <TextInput disabled source="id" />
        </Grid>
      )}
      {isShow && (
        <Grid size={12}>
          <FieldText source="id" />
        </Grid>
      )}
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ReferenceField source="parent" reference={resource} />
          </Labeled>
        ) : (
          <ReferenceInput source="parent" reference={resource}>
            <AutocompleteInput optionText="name" disabled={isShow} />
          </ReferenceInput>
        )}
      </Grid>
      {isEdit && (
        <Grid size={12}>
          <TextInput source="slug" disabled={isShow} />
        </Grid>
      )}
      {isShow && (
        <Grid size={12}>
          <FieldText source="slug" />
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
            <SelectField source="pageView" choices={pageViewChoices} />
          </Labeled>
        ) : (
          <SelectInput source="pageView" defaultValue={CategoryPageView.POSTS_VIEW} choices={pageViewChoices} />
        )}
      </Grid>
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ReferenceArrayField source="tags" reference={ResourceType.Tags} />
          </Labeled>
        ) : (
          <ReferenceArrayInput
            source="tags"
            reference={ResourceType.Tags}
            sort={{ field: "id", order: "ASC" }}
            perPage={config.admin.suggestionLimit}
          >
            <AutocompleteArrayInput optionText="name" />
          </ReferenceArrayInput>
        )}
      </Grid>
      <Grid size={12}>
        <LanguageArrayInput source="categoryLanguages" isShow={isShow}>
          {isShow ? <FieldText source="name" /> : <TextInput source="name" />}
          {isShow ? <CKEditorField source="description" /> : <CKEditorInput source="description" />}
        </LanguageArrayInput>
      </Grid>
    </Grid>
  );
};

export default CategoriesForm;
