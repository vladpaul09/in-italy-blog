"use client";

import { FC, useState } from "react";
import Typography from "@mui/material/Typography";
import HorizontalButtons from "./HorizontalButtons";
import Grid from "@mui/material/Grid";
import { categoryWithInfoPosts } from "@/types/category.type";
import HorizontalButton from "./HorizontalButton";
import config from "@/config";
import { staticStrings } from "@/types/staticStrings.type";
import CardListPodcast from "./CardListPodcast";

interface Props {
  title?: string;
  categories: Array<categoryWithInfoPosts>;
  locale: string;
  staticStrings: staticStrings;
  showCategoriesButtons: boolean;
}

const CardSection: FC<Props> = ({ title, categories, locale, staticStrings, showCategoriesButtons }) => {
  const [activityButton, setActivityButton] = useState<number>(0);

  const handleButtonSelect = (index: number) => {
    setActivityButton(index);
  };

  let isOneCategoryTitleEqual = false;
  if (categories.length === 1) {
    isOneCategoryTitleEqual = categories[0].name === title;
  }

  return (
    <Grid container size={12} spacing={2}>
      {title && (
        <Grid size={12}>
          <Typography
            variant="h3"
            fontWeight={config.fontWeightTitleDefault}
            fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
          >
            {title}
          </Typography>
        </Grid>
      )}
      {showCategoriesButtons && !isOneCategoryTitleEqual && (
        <Grid size={12}>
          <HorizontalButtons>
            {categories.map((category, index) => (
              <HorizontalButton
                key={index}
                selected={activityButton === categories.findIndex((cat) => cat.id === category.id)}
                onClick={() => {
                  handleButtonSelect(categories.findIndex((cat) => cat.id === category.id));
                }}
              >
                {category.name}
              </HorizontalButton>
            ))}
          </HorizontalButtons>
        </Grid>
      )}
      <Grid size={12}>
        <CardListPodcast key={activityButton} podcasts={categories[activityButton].infoPosts} locale={locale} staticStrings={staticStrings} />
      </Grid>
    </Grid>
  );
};

export default CardSection;
