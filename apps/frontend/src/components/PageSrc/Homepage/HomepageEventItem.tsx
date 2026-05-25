import { FC } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { event } from "@/types/event.type";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { staticStrings } from "@/types/staticStrings.type";
import Link from "next/link";
import stripText from "@/utils/stripText";

const HomepageEventItem: FC<{ event: event; staticStrings: staticStrings; locale: string }> = ({ event, staticStrings, locale }) => (
  <>
    <Grid size={{ xs: 4, sm: 3, md: 4, lg: 3, xl: 2 }}>
      <Box
        component={Link}
        href={`/${locale}/evento/${event.slug}`}
        sx={{
          position: "relative",
          height: { xs: "75px", md: "90px" },
          width: "100%",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <Box
          component={Image}
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 600px) 25vw, (max-width: 1200px) 20vw, 15vw"
          sx={{ objectFit: "cover" }}
        />
      </Box>
    </Grid>
    <Grid size={{ xs: 8, sm: 9, md: 8, lg: 9, xl: 10 }}>
      <Link href={`/${locale}/evento/${event.slug}`} style={{ textDecoration: "none" }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: "#000" }}>
          {event.title}
        </Typography>
      </Link>
      <Stack direction="row" spacing={1} sx={{ margin: "0 !important" }}>
        <Typography variant="body2" fontWeight={400}>
          {stripText(staticStrings.homepageEventStartDate)}{" "}
          <Typography component="span" variant="body2" fontWeight={600}>
            {dayjs(event.startDate.replace("Z", "")).format("DD/MM/YYYY")}
          </Typography>
        </Typography>
        <Typography variant="body2" fontWeight={400}>
          {stripText(staticStrings.homepageEventEndDate)}{" "}
          <Typography component="span" variant="body2" fontWeight={600}>
            {dayjs(event.endDate.replace("Z", "")).format("DD/MM/YYYY")}
          </Typography>
        </Typography>
      </Stack>
    </Grid>
  </>
);

export default HomepageEventItem;
