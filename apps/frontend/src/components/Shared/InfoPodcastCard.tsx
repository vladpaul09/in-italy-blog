import { FC } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import YoutubeFrame from "@/components/Shared/Podcast/YoutubeFrame";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import infoPostType from "@/types/infoPost.type";

interface Props {
  locale: string;
  podcast: infoPostType;
}

const InfoPodcastCard: FC<Props> = ({ locale, podcast }) => (
  <Stack className="global-border-radius" sx={{ background: "#fff", p: 2, height: { xs: "auto", lg: "100%" } }} spacing={1}>
    <Box sx={{ height: "220px" }}>
      <YoutubeFrame url={`https://www.youtube.com/embed/${podcast.youtubeLink}?autoplay=1&mute=1`} />
    </Box>
    <Typography
      component={Link}
      href={`/${locale}/podcast/${podcast.slug}`}
      sx={{ textDecoration: "none", color: "#000" }}
      variant="body1"
      fontWeight={700}
    >
      {podcast.title}
    </Typography>
    <Typography variant="body1" fontWeight={500} fontSize={14}>
      {podcast.shortDescription}
    </Typography>
  </Stack>
);

export default InfoPodcastCard;
