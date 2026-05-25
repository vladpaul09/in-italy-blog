import { FC } from "react";
import Box from "@mui/material/Box";
import Link from "next/link";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface Props {
  locale: string;
  podcastSlug: string;
  image: string;
  scroll?: boolean;
}

const PodcastThumbnail: FC<Props> = ({ locale, podcastSlug, image, scroll = true }) => {
  return (
    <Box
      component={Link}
      href={`/${locale}/podcast/${podcastSlug}`}
      scroll={scroll}
      className="global-border-radius"
      sx={{
        height: "160px",
        width: "100%",
        display: "flex",
        mb: 1,
        background: `url(${image})`,
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor: "white",
          borderRadius: "50%",
          p: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
        }}
      >
        <PlayArrowIcon />
      </Box>
    </Box>
  );
};

export default PodcastThumbnail;
