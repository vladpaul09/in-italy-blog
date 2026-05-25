"use client";

import { FC, ReactNode } from "react";
import useSWR, { Fetcher } from "swr";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import MapIcon from "@mui/icons-material/Map";
import dayjs, { Dayjs } from "dayjs";
import AutocompleteListBoxReactWindow from "@/components/Shared/Inputs/AutocompleteListBoxReactWindow";
import Autocomplete from "@mui/material/Autocomplete";
import StyledPopper from "@/components/Shared/Inputs/StyledPopper";
import DateCalendarIntervalInput from "@/components/Shared/Inputs/DateCalendarIntervalInput";
import fetchTextDebug from "@/utils/fetchTextDebug";
import HeaderTextField from "@/components/Shared/Inputs/HeaderTextField";
import SearchButton from "@/components/Shared/Buttons/SearchButton";
import TextField from "@mui/material/TextField";

type municipalityValueType = { id: string; name: string; url: string };

interface Props {
  locale: string;
  municipalityInputLabel: string;
  dateInputLabel: string;
  buttonLabel: string;
  validationMessageRequired: string;
  municipalityValue?: municipalityValueType;
  startDateValue?: string;
  endDateValue?: string;
}

interface IForm {
  municipality: municipalityValueType | null;
  date: { startDate: Dayjs | null; endDate: Dayjs | null };
}

const fetcher: Fetcher<Array<municipalityValueType>, string> = (url: string) =>
  fetch(url, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(fetchTextDebug(url, response.status, response.statusText));
  });

const DateIntervalCalendarForm: FC<Props> = ({
  locale,
  municipalityInputLabel,
  dateInputLabel,
  buttonLabel,
  validationMessageRequired,
  municipalityValue,
  startDateValue,
  endDateValue,
}) => {
  const { data, error, isLoading, mutate } = useSWR(`/api/${locale}/municipalities-search`, fetcher);

  const municipalities = data || [];

  const router = useRouter();
  const { control, handleSubmit } = useForm<IForm>();
  const onSubmit = handleSubmit((dataForm: IForm) => {
    const { municipality, date } = dataForm;
    if (municipality && date.startDate && date.endDate) {
      const startDate = date.startDate.format("YYYY-MM-DD");
      const endDate = date.endDate.format("YYYY-MM-DD");
      router.push(`/${locale}/destinazione/${municipality.url}/eventi/cerca?startDate=${startDate}&endDate=${endDate}`);
    }
  });

  return (
    <Grid component="form" container size={12} spacing={{ xs: 2, md: 3 }} onSubmit={onSubmit}>
      <Grid size={{ xs: 12, md: 4, xl: 2.5 }}>
        <Controller
          name="municipality"
          control={control}
          defaultValue={municipalityValue || null}
          rules={{
            required: validationMessageRequired,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Autocomplete
              id="homepage-calendar-form-municipalities-autocomplete"
              isOptionEqualToValue={(option, value) => option.name === value.name}
              options={municipalities}
              getOptionLabel={(option) => option.name}
              value={value}
              loading={isLoading}
              onChange={(_event, newValue) => {
                onChange(newValue);
              }}
              renderInput={(params) => (
                <HeaderTextField
                  {...params}
                  variant="outlined"
                  placeholder={municipalityInputLabel}
                  helperText={error?.message}
                  error={error !== undefined}
                  size="small"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      sx: {
                        backgroundColor: "#fff",
                      },
                      startAdornment: (
                        <InputAdornment position="start" variant="standard" sx={{ pl: 1, mr: 0, color: "inherit" }}>
                          <MapIcon />
                        </InputAdornment>
                      ),
                    },
                    inputLabel: {
                      ...params.InputLabelProps,
                      sx: {
                        color: "#000",
                        "&.Mui-focused": {
                          color: "#000",
                        },
                      },
                    },
                    htmlInput: {
                      ...params.inputProps,
                    },
                  }}
                />
              )}
              disableListWrap
              slotProps={{
                popper: {
                  component: StyledPopper,
                },
                listbox: {
                  component: AutocompleteListBoxReactWindow,
                },
              }}
              renderOption={(props, option, state) => [props, option.name, state.index] as ReactNode}
              renderGroup={(params) => params as any}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5, xl: 3 }}>
        <Controller
          name="date"
          control={control}
          defaultValue={{ startDate: startDateValue ? dayjs(startDateValue) : null, endDate: endDateValue ? dayjs(endDateValue) : null }}
          rules={{
            validate: (value) => {
              if (!value.startDate || !value.endDate) {
                return validationMessageRequired;
              }
              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <DateCalendarIntervalInput
              value={value ?? { startDate: null, endDate: null }}
              setValue={onChange}
              dateInputLabel={dateInputLabel}
              helperText={error?.message}
              error={error !== undefined}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2, lg: 1.5 }}>
        <SearchButton type="submit" variant="contained" fullWidth startIcon={<SearchIcon />}>
          {buttonLabel}
        </SearchButton>
      </Grid>
    </Grid>
  );
};

export default DateIntervalCalendarForm;
