import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import stripText from "@/utils/stripText";
import config from "@/config";
import EventDateText from "@/components/Shared/Widgets/EventDateText";
import { staticStrings } from "@/types/staticStrings.type";
import infoPostType from "@/types/infoPost.type";

interface Props extends infoPostType {
  locale: string;
  staticStrings: staticStrings;
}

const RelatedNew: FC<Props> = ({ image, title, url, description, staticStrings, startDate, endDate }) => {
  return (
    <Grid container size={12} spacing={1}>
      <Grid size={12}>
        <Typography
          component={Link}
          color="inherit"
          href={url}
          variant="h6"
          fontWeight={config.fontWeightTitleDefault}
          fontSize={config.fontSizeArticleTitle}
          sx={{ textDecoration: "none" }}
        >
          {title}
        </Typography>
      </Grid>
      {startDate && endDate && (
        <Grid size={12}>
          <EventDateText staticStrings={staticStrings} startDate={startDate} endDate={endDate} />
        </Grid>
      )}
      <Grid container size={12} spacing={2} sx={{ alignItems: "start" }}>
        <Grid size={5}>
          <Link href={url}>
            <Box
              className="global-border-radius"
              sx={{
                position: "relative",
                width: "100%",
                height: "120px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <Box
                component={Image}
                src={image}
                alt={title}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
                sx={{ objectFit: "cover" }}
              />
            </Box>
          </Link>
        </Grid>
        <Grid size={7}>
          <Typography
            component="p"
            fontWeight={400}
            fontSize={config.fontSizeDefaultText}
            dangerouslySetInnerHTML={{ __html: description !== null ? stripText(description, true, 100) : "" }}
            sx={{ p: 0, m: 0 }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RelatedNew;
