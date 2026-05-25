"use client";

import { FC, useState } from "react";
import { Dayjs } from "dayjs";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateCalendarMobile from "@/components/Shared/Inputs/DateCalendarMobile";
import DateCalendarDesktop from "@/components/Shared/Inputs/DateCalendarDesktop";
import HeaderTextField from "./HeaderTextField";

interface Props {
  value: { startDate: Dayjs | null; endDate: Dayjs | null };
  setValue: (value: { startDate: Dayjs | null; endDate: Dayjs | null }) => void;
  dateInputLabel: string;
  helperText?: string;
  error?: boolean;
}

const DateCalendarIntervalInput: FC<Props> = ({ value, setValue, dateInputLabel, helperText, error }) => {
  const { startDate, endDate } = value;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const parseDate = (startDate: Dayjs | null, endDate: Dayjs | null) => {
    if (startDate && endDate) {
      const start = startDate.format("DD/MM/YYYY");
      const end = endDate.format("DD/MM/YYYY");
      return `${start} - ${end}`;
    }
    return "";
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartDate = (date: Dayjs | null) => {
    setValue({ ...value, startDate: date });
  };

  const handleEndDate = (date: Dayjs | null) => {
    setValue({ ...value, endDate: date });
  };

  const handleEntireDate = (start: Dayjs | null, end: Dayjs | null) => {
    setValue({ startDate: start, endDate: end });
  };

  return (
    <>
      <HeaderTextField
        fullWidth
        value={parseDate(startDate, endDate)}
        variant="outlined"
        placeholder={dateInputLabel}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        helperText={helperText}
        error={error}
        size="small"
        slotProps={{
          input: {
            readOnly: true,
            sx: {
              backgroundColor: "white",
              "&.Mui-focused": {
                color: "#000",
              },
            },
            startAdornment: (
              <InputAdornment position="start" variant="standard" sx={{ color: "inherit" }}>
                <CalendarTodayIcon />
              </InputAdornment>
            ),
          },
          inputLabel: {
            sx: {
              color: "#000",
              "&.Mui-focused": {
                color: "#000",
              },
            },
          },
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{ display: { xs: "none", md: "block" } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <DateCalendarDesktop
          startDate={startDate}
          endDate={endDate}
          setStartDate={handleStartDate}
          setEndDate={handleEndDate}
          setEntireDate={handleEntireDate}
          handleClose={handleClose}
        />
      </Popover>
      <Dialog fullScreen open={open} onClose={handleClose} sx={{ display: { md: "none" } }}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DateCalendarMobile
          startDate={startDate}
          endDate={endDate}
          setStartDate={handleStartDate}
          setEndDate={handleEndDate}
          setEntireDate={handleEntireDate}
          handleClose={handleClose}
        />
      </Dialog>
    </>
  );
};

export default DateCalendarIntervalInput;
