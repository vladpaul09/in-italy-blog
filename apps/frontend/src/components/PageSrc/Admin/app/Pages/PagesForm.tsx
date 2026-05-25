import { FC } from "react";
import { BooleanField, BooleanInput, TextInput } from "react-admin";
import Grid from "@mui/material/Grid";
import CKEditorInput from "../../components/Inputs/CKEditorInput";
import CKEditorField from "../../components/Fields/CKEditorField";
import FieldText from "../../components/Fields/FieldText";
import LanguageArrayInput from "../../components/Inputs/LanguageArrayInput";

const PagesForm: FC<{ actionType: "create" | "edit" | "show" }> = ({ actionType }) => {
  const isShow = actionType === "show";
  const isEdit = actionType === "edit";

  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {isShow && (
        <Grid size={12}>
          <FieldText source="id" />
        </Grid>
      )}
      {isEdit && (
        <Grid size={12}>
          <TextInput source="id" disabled />
        </Grid>
      )}
      <Grid size={12}>{isShow ? <FieldText source="slug" /> : <TextInput source="slug" fullWidth />}</Grid>
      <Grid size={12}>{isShow ? <BooleanField source="publish" /> : <BooleanInput source="publish" />}</Grid>
      <Grid size={12}>
        <LanguageArrayInput source="languages" isShow={isShow}>
          {isShow ? <FieldText source="metaTitle" /> : <TextInput source="metaTitle" fullWidth />}
          {isShow ? <FieldText source="metaDescription" /> : <TextInput source="metaDescription" multiline rows={3} fullWidth />}
          {isShow ? <FieldText source="pageTitle" /> : <TextInput source="pageTitle" fullWidth />}
          {isShow ? <CKEditorField source="pageDescription" /> : <CKEditorInput source="pageDescription" />}
        </LanguageArrayInput>
      </Grid>
    </Grid>
  );
};

export default PagesForm;
