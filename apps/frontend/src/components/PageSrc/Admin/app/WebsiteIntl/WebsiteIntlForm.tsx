import { FC } from "react";
import { TextInput } from "react-admin";
import Grid from "@mui/material/Grid";
import LanguageArrayInput from "../../components/Inputs/LanguageArrayInput";
import CKEditorInput from "../../components/Inputs/CKEditorInput";
import CKEditorField from "../../components/Fields/CKEditorField";
import FieldText from "../../components/Fields/FieldText";

const WebsiteIntlForm: FC<{ actionType: "create" | "edit" | "show" }> = ({ actionType }) => {
  const isShow = actionType === "show";

  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      <Grid size={12}>
        {isShow ? <FieldText source="id" /> : <TextInput source="id" />}
      </Grid>
      <Grid size={12}>
        <LanguageArrayInput source="languages" isShow={isShow}>
          {isShow ? <CKEditorField source="value" /> : <CKEditorInput source="value" />}
        </LanguageArrayInput>
      </Grid>
    </Grid>
  );
};

export default WebsiteIntlForm;
