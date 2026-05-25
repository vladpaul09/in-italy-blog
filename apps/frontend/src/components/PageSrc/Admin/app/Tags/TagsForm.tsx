import { FC } from "react";
import { TextInput, ImageInput, ImageField, Labeled, useTranslate, useResourceContext } from "react-admin";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LanguageArrayInput from "../../components/Inputs/LanguageArrayInput";
import CKEditorInput from "../../components/Inputs/CKEditorInput";
import CKEditorField from "../../components/Fields/CKEditorField";
import FieldText from "../../components/Fields/FieldText";

const TagsForm: FC<{ actionType: "edit" | "create" | "show" }> = ({ actionType }) => {
  const translate = useTranslate();
  const resource = useResourceContext();
  const isShow = actionType === "show";
  const isEdit = actionType === "edit";

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
      {isEdit && (
        <Grid size={12}>
          <TextInput source="slug" />
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
            <ImageField source="mapMarkerImage.src" title="mapMarkerImage.title" />
          </Labeled>
        ) : (
          <ImageInput
            source="mapMarkerImage"
            placeholder={
              <Typography component="p" sx={{ py: 3 }}>
                {translate(`resources.${resource}.mapMarkerImagePlaceholderText`)}
              </Typography>
            }
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        )}
      </Grid>
      <Grid size={12}>
        <LanguageArrayInput source="tagLanguages" isShow={isShow}>
          {isShow ? <FieldText source="name" /> : <TextInput source="name" />}
          {isShow ? <CKEditorField source="description" /> : <CKEditorInput source="description" />}
        </LanguageArrayInput>
      </Grid>
    </Grid>
  );
};

export default TagsForm;
