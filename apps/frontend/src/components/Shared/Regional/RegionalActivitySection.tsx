"use client";

import { FC, useState } from "react";
import Typography from "@mui/material/Typography";
import RegionalActivityPost from "./RegionalActivityPost";
import Grid from "@mui/material/Grid";
import { categoryWithInfoPosts } from "@/types/category.type";
import { staticStrings } from "@/types/staticStrings.type";
import HorizontalButtons from "./HorizontalButtons";
import HorizontalButton from "./HorizontalButton";
import config from "@/config";
import infoPostType from "@/types/infoPost.type";
import stripText from "@/utils/stripText";

interface Props {
  categories: Array<categoryWithInfoPosts>;
  type: "municipality" | "province" | "region";
  locationName?: string;
  staticStrings: staticStrings;
  locale: string;
}

const RegionalActivitySection: FC<Props> = ({ categories, type, locationName, staticStrings, locale }) => {
  const [activityButton, setActivityButton] = useState<number>(0);
  const handleButtonSelect = (index: number) => {
    setActivityButton(index);
  };

  return (
    <Grid container size={12} spacing={2}>
      <Grid size={12}>
        <Typography
          variant="h3"
          fontWeight={config.fontWeightTitleDefault}
          fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
        >
          {stripText(staticStrings.happensInCityA)}{" "}
          {type === "municipality"
            ? stripText(staticStrings.happensInCityB)
            : type === "province"
            ? stripText(staticStrings.happensInCityC + ` ${locationName}`)
            : locationName}
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
      <Grid container size={12} spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}>
        {(categories[activityButton]?.infoPosts || []).slice(0, 6).map((post: infoPostType, index: number) => (
          <Grid container key={index} size={{ xs: 12, md: 6 }} spacing={2}>
            <RegionalActivityPost
              title={post.title}
              image={post.image}
              mobileImage={post.mobileImage}
              url={`/${locale}${post.url}`}
              description={post.description}
              startDate={post.startDate}
              endDate={post.endDate}
              staticStrings={staticStrings}
              locale={locale}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default RegionalActivitySection;
