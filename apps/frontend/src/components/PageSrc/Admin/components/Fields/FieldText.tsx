import { FC } from "react";
import { useFieldValue, useResourceContext, useTranslate, type FieldProps } from "react-admin";
import TextField from "@mui/material/TextField";

const FieldText: FC<FieldProps> = ({ source, label }) => {
  const value = useFieldValue({ source });
  const resource = useResourceContext();
  const translate = useTranslate();

  return (
    <TextField label={label ? label : translate(`resources.${resource}.fields.${source}`)} value={value || ""} slotProps={{ input: { readOnly: true } }} />
  );
};

export default FieldText;
