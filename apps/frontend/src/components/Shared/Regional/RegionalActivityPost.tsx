import { FC } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import stripText from "@/utils/stripText";
import Link from "next/link";
import config from "@/config";
import EventDateText from "../Widgets/EventDateText";
import { staticStrings } from "@/types/staticStrings.type";

interface Props {
  title: string;
  image: string;
  mobileImage: string;
  url: string;
  description: string;
  startDate?: string;
  endDate?: string;
  staticStrings: staticStrings;
  locale: string;
}

const RegionalActivityPost: FC<Props> = ({ title, image, mobileImage, url, description, startDate, endDate, staticStrings, locale }) => {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ width: "100%" }}>
      <Box
        component={Link}
        href={url}
        className="global-border-radius"
        sx={{
          position: "relative",
          width: { xs: "100%", md: "50%" },
          height: "225px",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <Box
          component={Image}
          src={image}
          alt={title}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 50vw"
          sx={{ objectFit: "cover" }}
        />
      </Box>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          justifyContent: "start",
          alignItems: "start",
          width: { xs: "100%", md: "50%" },
        }}
      >
        <Box component="div" sx={{ p: 0, m: 0 }}>
          <Typography
            variant="h6"
            color="inherit"
            fontWeight={config.fontWeightTitleDefault}
            fontSize={config.fontSizeArticleTitle}
            component={Link}
            href={url}
            sx={{ textDecoration: "none" }}
          >
            {title}
          </Typography>
          {startDate && endDate && <EventDateText staticStrings={staticStrings} startDate={startDate} endDate={endDate} />}
        </Box>
        {description && (
          <Typography
            component="p"
            fontWeight={400}
            fontSize={config.fontSizeDefaultText}
            dangerouslySetInnerHTML={{ __html: stripText(description, true, 100) }}
            sx={{ p: 0, m: 0 }}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default RegionalActivityPost;
