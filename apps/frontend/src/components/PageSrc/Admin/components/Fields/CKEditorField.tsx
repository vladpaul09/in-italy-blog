import { FC } from "react";
import Box from "@mui/material/Box";
import { useFieldValue, useResourceContext, useTranslate, type FieldProps } from "react-admin";

const CKEditorField: FC<FieldProps> = ({ source, label }) => {
  const value = useFieldValue({ source });
  const resource = useResourceContext();
  const translate = useTranslate();
 
  return (
    <Box component="div" sx={{ m: 0, p: 0 }}>
      <label>{label ? label : translate(`resources.${resource}.fields.${source}`)}</label>
      <Box className="ck-content" dangerouslySetInnerHTML={{ __html: value }} sx={{ overflow: "hidden", m: 0, p: 0 }} />
    </Box>
  );
};

export default CKEditorField;
