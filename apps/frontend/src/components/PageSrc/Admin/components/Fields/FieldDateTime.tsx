import { FC } from "react";
import { useFieldValue, useResourceContext, useTranslate, type FieldProps } from "react-admin";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

const FieldDateTime: FC<FieldProps> = ({ source, label }) => {
  const value = useFieldValue({ source });
  const resource = useResourceContext();
  const translate = useTranslate();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <DateTimeField
        label={label ? label : translate(`resources.${resource}.fields.${source}`)}
        value={dayjs(value)}
        slotProps={{ textField: { readOnly: true } }}
      />
    </LocalizationProvider>
  );
};

export default FieldDateTime;
