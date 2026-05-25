import { FC } from "react";
import Grid from "@mui/material/Grid";
import {
  AutocompleteInput,
  BooleanInput,
  ImageField,
  ImageInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  FormDataConsumer,
} from "react-admin";
import LanguageArrayInput from "../../components/Inputs/LanguageArrayInput";
import config from "@/config";
import menuItemTypeEntry from "../../entries/menuItemType.entry";
import ResourceType from "../../entries/resourceType.entry";

const MenuItemsCommonForm: FC<{ actionType: "create" | "edit" }> = ({ actionType }) => {
  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {actionType === "edit" && (
        <>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput disabled source="id" fullWidth />
          </Grid>
        </>
      )}
      <Grid size={12}>
        <SelectInput source="type" choices={menuItemTypeEntry} fullWidth />
      </Grid>
      <FormDataConsumer<{ type: (typeof menuItemTypeEntry)[number]["id"] }>>
        {({ formData, ...rest }) => {
          switch (formData.type) {
            case ResourceType.CategoriesArticles:
            case ResourceType.CategoriesEvents:
              const references = {
                [ResourceType.CategoriesArticles]: ResourceType.CategoriesArticles,
                [ResourceType.CategoriesEvents]: ResourceType.CategoriesEvents,
              };
              return (
                <>
                  <Grid size={12}>
                    <ReferenceInput
                      {...rest}
                      source="categoryId"
                      reference={references[formData.type]}
                      sort={{ field: "id", order: "ASC" }}
                      perPage={config.admin.suggestionLimit}
                    >
                      <AutocompleteInput />
                    </ReferenceInput>
                  </Grid>
                  <Grid size={12}>
                    <NumberInput source="maxItems" fullWidth />
                  </Grid>
                </>
              );
            case "link":
              return (
                <Grid size={12}>
                  <TextInput source="url" fullWidth />
                </Grid>
              );
            default:
              return null;
          }
        }}
      </FormDataConsumer>
      <Grid size={12}>
        <ReferenceInput source="parentId" reference="menu-items" perPage={config.admin.suggestionLimit}>
          <AutocompleteInput optionText="title" fullWidth />
        </ReferenceInput>
      </Grid>
      <Grid size={12}>
        <ImageInput source="icon">
          <ImageField source="src" title="title" />
        </ImageInput>
      </Grid>
      <Grid size={12}>
        <BooleanInput source="isVisible" />
      </Grid>
      <Grid size={12}>
        <NumberInput source="position" fullWidth />
      </Grid>
      <Grid size={12}>
        <LanguageArrayInput source="menuItemLanguages">
          <TextInput source="title" fullWidth />
        </LanguageArrayInput>
      </Grid>
    </Grid>
  );
};

export default MenuItemsCommonForm;
