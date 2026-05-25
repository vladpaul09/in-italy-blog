import { FC } from "react";
import { useInput, useResourceContext, useTranslate } from "react-admin";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

const EventsDateInput: FC<{ source: string; label?: string; size?: "small" | "medium", disablePast?: boolean, disabled?: boolean }> = ({ source, label, size, disablePast, disabled }) => {
  const t = useTranslate();
  const resource = useResourceContext();
  
  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useInput({ source: source, defaultValue: dayjs().toISOString() });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <DateTimePicker
        sx={{ mb: "8px", mt: "16px" }}
        label={label ? label : t(`resources.${resource}.fields.${source}`)}
        disabled={disabled}
        disablePast={disablePast}
        value={dayjs(value)}
        onChange={(newValue) => {
          if (newValue) onChange(newValue.toISOString());
        }}
        slotProps={{
          textField: {
            size: size,
            error: invalid,
            helperText: error?.message,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default EventsDateInput;
