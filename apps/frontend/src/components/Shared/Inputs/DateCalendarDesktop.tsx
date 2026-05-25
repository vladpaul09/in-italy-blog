"use client";
import { FC, useState } from "react";
import Stack from "@mui/material/Stack";
import { DateCalendar, LocalizationProvider, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";

interface CustomPickerDayProps extends PickersDayProps {
  isSelected: boolean;
  isHovered: boolean;
  startdate: Dayjs | null | undefined;
  enddate: Dayjs | null | undefined;
  hovereddate: Dayjs | null | undefined;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day, startdate, enddate, hovereddate }) => ({
  borderRadius: 0,
  transition: "0s background-color",
  border: "none !important",
  backgroundColor: "#fff !important",

  ...((isHovered || hovereddate === day) && {
    backgroundColor: "#e6e7e9",

    "&:hover, &:focus": {
      backgroundColor: "#e6e7e9",
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.primary.dark,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
  }),

  ...((isSelected || startdate?.isSame(day) || enddate?.isSame(day)) && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
    },
  }),

  ...(startdate?.isSame(day) && {
    color: theme.palette.primary.contrastText,
    borderRadius: "14px 0 0 14px",
  }),
  ...((enddate?.isSame(day) || (startdate && hovereddate?.isAfter(startdate) && !enddate && hovereddate?.isSame(day))) && {
    color: theme.palette.primary.contrastText,
    borderRadius: "0 14px 14px 0",
  }),
}));

const dateChecker = (day: Dayjs, startDate: Dayjs | null | undefined, endDate: Dayjs | null | undefined) => {
  if (startDate == null || startDate === undefined || endDate == null || endDate === undefined) {
    return false;
  }

  if ((day.isAfter(startDate, "day") && day.isBefore(endDate, "day")) || day.isSame(startDate) || day.isSame(endDate)) {
    return true;
  } else {
    return false;
  }
};

const dateCheckerHover = (
  day: Dayjs,
  startDate: Dayjs | null | undefined,
  endDate: Dayjs | null | undefined,
  hoverDate: Dayjs | null | undefined
) => {
  if (startDate == null || startDate === undefined || hoverDate == null || hoverDate === undefined) {
    return false;
  }

  if (day.isAfter(startDate, "day") && day.isBefore(hoverDate, "day") && (endDate === null || endDate === undefined)) {
    return true;
  } else {
    return false;
  }
};

function Day(
  props: PickersDayProps & {
    startDate?: Dayjs | null;
    endDate?: Dayjs | null;
    hoveredDate?: Dayjs | null;
  }
) {
  const { day, startDate, endDate, hoveredDate, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      startdate={startDate}
      enddate={endDate}
      hovereddate={hoveredDate}
      isSelected={dateChecker(day, startDate, endDate)}
      isHovered={dateCheckerHover(day, startDate, endDate, hoveredDate)}
    />
  );
}

interface Props {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
  setEntireDate: (start: Dayjs | null, end: Dayjs | null) => void;
  handleClose: () => void;
}

const DateCalendarDesktop: FC<Props> = ({ startDate, setStartDate, endDate, setEndDate, setEntireDate, handleClose }) => {
  const [hoveredDate, setHoveredDate] = useState<Dayjs | null>(null);
  const [monthController, setMonthController] = useState<Dayjs>(dayjs());

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      return;
    }

    if (startDate === null) {
      setStartDate(newValue);
    } else if (endDate === null) {
      if (newValue.isBefore(startDate, "day") || newValue.isSame(startDate, "day")) {
        setStartDate(newValue);
      } else {
        setEndDate(newValue);
        handleClose();
      }
    } else {
      setEntireDate(newValue, null);
    }
  };

  return (
    <Stack direction="row" sx={{ width: "min-content", margin: "auto" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <DateCalendar
          slots={{ day: Day }}
          referenceDate={monthController}
          onMonthChange={(newMonth) => {
            setMonthController(newMonth);
          }}
          disablePast
          value={monthController}
          reduceAnimations
          slotProps={{
            day: (ownerState) => ({
              startDate: startDate,
              endDate: endDate,
              hoveredDate: hoveredDate,
              onClick: () => {
                handleDateChange(ownerState.day);
              },
              onPointerEnter: () => {
                setHoveredDate(ownerState.day);
              },
            }),
          }}
        />
        <DateCalendar
          slots={{ day: Day }}
          onMonthChange={(newMonth) => {
            setMonthController(newMonth.subtract(1, "month"));
          }}
          view="day"
          disablePast
          reduceAnimations
          readOnly
          value={monthController.add(1, "month")}
          slotProps={{
            day: (ownerState) => ({
              startDate: startDate,
              endDate: endDate,
              hoveredDate: hoveredDate,
              onClick: () => {
                handleDateChange(ownerState.day);
              },
              onPointerEnter: () => {
                setHoveredDate(ownerState.day);
              },
            }),
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
};

export default DateCalendarDesktop;
