"use client";

import { FC, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import HorizontalButtons from "./HorizontalButtons";
import AccomodationCardList from "../../PageSrc/MunicipalityPage/AccomodationCardList";
import HorizontalButton from "./HorizontalButton";
import config from "@/config";
import AccomodationCardListSkeleton from "./AccomodationCardListSkeleton";

interface Props {
  title: string;
  locale: string;
  location?: string;
  regionalObject?: {
    latitude: string;
    longitude: string;
    radius: number;
    radiusUnit: string;
  };
}

const activities = [
  { id: "hotels", name: "Hotels", category: "hotels" },
  // { id: "b&b", name: "B&B", category: "hotels" },
  // { id: "appartamenti", name: "Appartamenti", category: "hotels" },
  { id: "restaurants", name: "Ristoranti", category: "restaurants" },
  // { id: "pizzerie", name: "Pizzerie", category: "restaurants" },
  // { id: "trattorie", name: "Trattorie", category: "restaurants" },
  // { id: "osterie", name: "Osterie", category: "restaurants" },
  // { id: "pub", name: "Pub", category: "restaurants" },
];

const AccomodationCardSection: FC<Props> = ({ title, locale, location, regionalObject }) => {
  const [activityButton, setActivityButton] = useState<(typeof activities)[number]>(activities[0]);

  return (
    <Grid container size={12} spacing={2}>
      <Grid size={12}>
        <Typography variant="h3" fontWeight={800} fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}>
          {title}
        </Typography>
      </Grid>
      <Grid size={12}>
        <HorizontalButtons>
          {activities.map((activity) => (
            <HorizontalButton
              key={activity.id}
              selected={activityButton.id === activity.id}
              onClick={() => {
                setActivityButton(activity);
              }}
            >
              {activity.name}
            </HorizontalButton>
          ))}
        </HorizontalButtons>
      </Grid>
      <Grid size={12}>
        {!regionalObject ? (
          <AccomodationCardListSkeleton />
        ) : (
          <AccomodationCardList key={activityButton.id} locale={locale} regionalObject={regionalObject} activityState={activityButton} />
        )}
      </Grid>
    </Grid>
  );
};

export default AccomodationCardSection;
