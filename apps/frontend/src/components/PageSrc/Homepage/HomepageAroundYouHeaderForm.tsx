"use client";

import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useSWR, { Fetcher } from "swr";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import Skeleton from "@mui/material/Skeleton";
import HeaderTextField from "@/components/Shared/Inputs/HeaderTextField";
import SearchButton from "@/components/Shared/Buttons/SearchButton";
import SearchIcon from "@mui/icons-material/Search";
import { staticStrings } from "@/types/staticStrings.type";
import fetchTextDebug from "@/utils/fetchTextDebug";
import fetcherUserLocationType from "@/types/fetcherUserLocation.type";
import stripText from "@/utils/stripText";
import InputAdornment from "@mui/material/InputAdornment";
import MapIcon from "@mui/icons-material/Map";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import apiLocationUrl from "@/utils/apiLocationUrl.util";

interface IForm {
  dateTime: "today" | "tomorrow" | "next-7-days";
}

interface Props {
  coords: [number, number] | null;
  staticStrings: staticStrings;
  locale: string;
}

const fetcherUserLocation: Fetcher<fetcherUserLocationType, string> = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(fetchTextDebug(url, response.status, response.statusText));
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch location data");
  }
};

const HomepageAroundYouHeaderFormSkeleton: FC = () => (
  <>
    <Grid size={{ xs: 12, md: 4, xl: 2.5 }}>
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ bgcolor: "grey.300" }} />
    </Grid>
    <Grid size={{ xs: 12, md: 5, xl: 3 }}>
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ bgcolor: "grey.300" }} />
    </Grid>
    <Grid size={{ xs: 12, md: 2, lg: 1.5 }}>
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ bgcolor: "grey.300" }} />
    </Grid>
  </>
);

const HomepageAroundYouHeaderForm: FC<Props> = ({ staticStrings, locale, coords }) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<IForm>();

  const timeIntervalOptions = [
    { id: "today", label: stripText(staticStrings.dateTimeIntervalSeachInputLabelToday) },
    { id: "tomorrow", label: stripText(staticStrings.dateTimeIntervalSeachInputLabelTomorrow) },
    { id: "next-7-days", label: stripText(staticStrings.dateTimeIntervalSeachInputLabelNextWeek) },
  ];

  const { data: dataUserLocation, isLoading: isLoadingUserLocation } = useSWR(
    coords ? apiLocationUrl(locale, coords[0], coords[1]) : null,
    fetcherUserLocation,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 2,
    }
  );

  const onSubmit = handleSubmit((dataForm: IForm) => {
    const { dateTime } = dataForm;
    if (dateTime) {
      if (dataUserLocation && coords) {
        router.push(
          `/${locale}/destinazione/${dataUserLocation.municipalityData.province.region.slug}/${dataUserLocation.municipalityData.province.slug}/${dataUserLocation.municipalityData.slug}/intorno-a-te?datetime=${dateTime}&lat=${coords[0]}&long=${coords[1]}`
        );
      }
    }
  });

  return (
    <Grid container size={12} spacing={{ xs: 2, md: 3 }} component="form" onSubmit={onSubmit}>
      {isLoadingUserLocation || !coords ? (
        <HomepageAroundYouHeaderFormSkeleton />
      ) : (
        <>
          {dataUserLocation ? (
            <>
              <Grid size={{ xs: 12, md: 4, xl: 2.5 }}>
                <HeaderTextField
                  value={dataUserLocation.municipalityData.name}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true,
                      sx: {
                        backgroundColor: "white",
                      },
                      startAdornment: (
                        <InputAdornment position="start" variant="standard" sx={{ color: "inherit" }}>
                          <MapIcon />
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
              </Grid>
              <Grid size={{ xs: 12, md: 5, xl: 3 }}>
                <Controller
                  name="dateTime"
                  control={control}
                  rules={{
                    required: stripText(staticStrings.validationFormInputMessageRequired),
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Autocomplete
                      id="homepage-calendar-form-municipalities-autocomplete-time-interval"
                      options={timeIntervalOptions}
                      value={timeIntervalOptions.find((option) => option.id === value) || null}
                      onChange={(_event, newValue) => {
                        onChange(newValue ? newValue.id : null);
                      }}
                      renderInput={(params) => (
                        <HeaderTextField
                          {...params}
                          variant="outlined"
                          placeholder={stripText(staticStrings.dateTimeIntervalSeachInputLabel)}
                          helperText={error?.message}
                          error={error !== undefined}
                          size="small"
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              sx: {
                                backgroundColor: "white",
                              },
                              startAdornment: (
                                <InputAdornment position="start" variant="standard" sx={{ pl: 1, mr: 0, color: "inherit" }}>
                                  <CalendarTodayIcon />
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
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2, lg: 1.5 }}>
                <SearchButton type="submit" variant="contained" fullWidth startIcon={<SearchIcon />}>
                  {stripText(staticStrings.dateIntervalSearchButtonLabel)}
                </SearchButton>
              </Grid>
            </>
          ) : (
            <HomepageAroundYouHeaderFormSkeleton />
          )}
        </>
      )}
    </Grid>
  );
};

export default HomepageAroundYouHeaderForm;
