"use client";

import { FC, Fragment } from "react";
import useSWR from "swr";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import { staticStrings } from "@/types/staticStrings.type";
import stripText from "@/utils/stripText";
import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";

interface Props {
  latitude: string;
  longitude: string;
  staticStrings: staticStrings;
  locale: string;
  days: 1 | 2 | 3 | 4 | 5;
}

interface WeatherCondition {
  text: string;
  icon: string;
}

interface CurrentWeather {
  temp_c: number;
  condition: WeatherCondition;
}

interface DayWeather {
  maxtemp_c: number;
  mintemp_c: number;
  condition: WeatherCondition;
}

interface ForecastDay {
  date: string;
  day: DayWeather;
}

interface WeatherForecast {
  forecastday: Array<ForecastDay>;
}

interface WeatherApiResponse {
  current: CurrentWeather;
  forecast: WeatherForecast;
}

const WeatherWidgetSkeleton: FC = () => (
  <Skeleton animation="wave" variant="rounded" sx={{ width: "100%", height: "312px", bgcolor: "#000000aa", mb: 2 }} />
);

const WeatherWidget: FC<Props> = ({ latitude, longitude, staticStrings, locale, days }) => {
  const { data, error, isLoading, mutate } = useSWR<WeatherApiResponse, Error>(
    latitude && longitude
      ? `https://api.weatherapi.com/v1/forecast.json?key=${config.weatherAPIKey}&q=${latitude},${longitude}&days=${days}&aqi=no&alerts=no&lang=${locale}`
      : null,
    (url: string) =>
      fetch(url, { headers: { accept: "application/json", "Content-Type": "application/json" } }).then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error(fetchTextDebug(url, r.status, r.statusText));
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const getDayString = (date: string) => {
    const localeOptions: { [k: string]: string } = {
      en: "en-GB",
      it: "it-IT",
    };

    const out = new Date(date).toLocaleString(localeOptions[locale], {
      weekday: "long",
    });

    return out.slice(0, days).toUpperCase();
  };

  const getDayNumber = (date: string) => {
    const out = new Date(date);
    return out.getDate();
  };

  if (!data || isLoading) {
    return <WeatherWidgetSkeleton />;
  }

  return (
    <List className="global-border-radius" sx={{ backgroundColor: "#fff", padding: "8px 0 0", height: "312px", mb: 2, width: "100%" }}>
      <ListItem>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1, width: "100%" }}>
          <Typography sx={{ width: "50px", textAlign: "center", fontWeight: 500 }}>{stripText(staticStrings.weatherCurrent)}</Typography>
          <Box>
            <Typography sx={{ textAlign: "center", fontSize: "26px", fontWeight: 400 }}>{data.current.temp_c} °C</Typography>
          </Box>
          <img loading="lazy" src={data.current.condition.icon} alt={data.current.condition.text} width="70" height="70" />
        </Stack>
      </ListItem>
      <ListItem sx={{ pt: 0 }}>
        <Typography sx={{ textAlign: "center", fontSize: "16px", fontWeight: 300, color: "#000000aa", width: "100%" }}>
          {data.current.condition.text}
        </Typography>
      </ListItem>
      {data.forecast.forecastday.map((day, index) => (
        <Fragment key={index}>
          <Divider />
          <ListItem>
            <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <Box sx={{ width: "50px" }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#000000aa", textAlign: "center" }}>{getDayString(day.date)}</Typography>
                <Typography sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>{getDayNumber(day.date)}</Typography>
              </Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 500, textAlign: "center" }}>{day.day.condition.text}</Typography>
              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <img loading="lazy" src={day.day.condition.icon} alt={day.day.condition.text} width="42" height="42" />
                  <Box>
                    <Typography sx={{ fontSize: "14px", fontWeight: 500, textAlign: "center" }}>{day.day.maxtemp_c} °C</Typography>
                    <Typography sx={{ color: "#000000aa", fontSize: "14px", fontWeight: 500 }}>{day.day.mintemp_c} °C</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </ListItem>
        </Fragment>
      ))}
    </List>
  );
};

export default WeatherWidget;
