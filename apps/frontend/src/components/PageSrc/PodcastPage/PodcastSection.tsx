"use client";

import { FC, useState } from "react";
import Grid from "@mui/material/Grid";
import HorizontalButtons from "../../Shared/Regional/HorizontalButtons";
import Typography from "@mui/material/Typography";
import { category } from "@/types/category.type";
import HorizontalButton from "../../Shared/Regional/HorizontalButton";
import YoutubeFrame from "@/components/Shared/Podcast/YoutubeFrame";
import PodcastThumbnail from "@/components/Shared/Podcast/PodcastThumbnail";


interface Props {
  categories: Array<category>;
  locale: string;
}

const PodcastSection: FC<Props> = ({ categories, locale }) => {
  const [activityButton, setActivityButton] = useState<number>(0);
  const handleButtonSelect = (index: number) => {
    setActivityButton(index);
  };

  return (
    <Grid container size={12} spacing={3}>
      <Grid size={12}>
        <Typography variant="h3" fontWeight={800}>
          Uploads
        </Typography>
      </Grid>
      <Grid size={12}>
        <HorizontalButtons>
          {categories.map((category, index) => (
            <HorizontalButton
              key={index}
              selected={activityButton === index}
              onClick={() => {
                handleButtonSelect(index);
              }}
            >
              {category.name}
            </HorizontalButton>
          ))}
        </HorizontalButtons>
      </Grid>
      <Grid container size={12} spacing={3}>
        {(categories[activityButton]?.podcasts || []).map((podcast, index) => (
          <Grid key={index} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
            <Grid size={3} sx={{ width: "100%" }}>
              <PodcastThumbnail image={podcast.image} podcastSlug={podcast.slug} locale={locale} scroll={false}/>
              <Typography variant="body1" fontWeight={800} fontSize={18}>
                {podcast.title}
              </Typography>
              <Typography variant="caption" fontWeight={500} fontSize={14}>
                {podcast.shortDescription}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default PodcastSection;
