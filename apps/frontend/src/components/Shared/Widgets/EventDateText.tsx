import { FC } from "react";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { staticStrings } from "@/types/staticStrings.type";
import config from "@/config";
import stripText from "@/utils/stripText";

interface Props {
  startDate: string;
  endDate: string;
  staticStrings: staticStrings;
  fontSize?: number;
}

const EventDateText: FC<Props> = ({ startDate, endDate, staticStrings, fontSize = 17 }) => (
  <Stack direction="row" spacing={0.5} sx={{ m: 0 }}>
    <Typography variant="body2" component="span" fontWeight={400} fontSize={fontSize}>
      {stripText(staticStrings.homepageEventStartDate)}{" "}
    </Typography>
    <Typography component="span" variant="body2" fontWeight={config.fontWeightTitleDefault} fontSize={fontSize}>
      {dayjs(startDate.replace('Z', '')).format("DD/MM/YYYY")}
    </Typography>
    <Typography variant="body2" component="span" fontWeight={400} fontSize={fontSize}>
      {stripText(staticStrings.homepageEventEndDate)}
    </Typography>{" "}
    <Typography component="span" variant="body2" fontWeight={config.fontWeightTitleDefault} fontSize={fontSize}>
      {dayjs(endDate.replace('Z', '')).format("DD/MM/YYYY")}
    </Typography>
  </Stack>
);

export default EventDateText;
