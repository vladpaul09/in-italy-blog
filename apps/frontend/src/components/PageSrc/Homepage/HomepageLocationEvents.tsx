import { FC } from "react";
import Grid from "@mui/material/Grid";
import { event } from "@/types/event.type";
import config from "@/config";
import HomepageEventItem from "./HomepageEventItem";
import { staticStrings } from "@/types/staticStrings.type";

interface Props {
  locale: string;
  staticStrings: staticStrings;
  events: Array<event>;
}

const HomepageLocationEvents: FC<Props> = ({ locale, staticStrings, events }) => {
  return (
    <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
      {events.map((event, index) => (
        <Grid container spacing={2} size={{ xs: 12, md: 6 }} key={index}>
          <HomepageEventItem key={index} event={event} staticStrings={staticStrings} locale={locale} />
        </Grid>
      ))}
    </Grid>
  );
};

export default HomepageLocationEvents;
