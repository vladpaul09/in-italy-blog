"use client";

import { FC } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import RegionalRestaurantCategory from "./RegionalRestaurantCategory";
import { staticStrings } from "@/types/staticStrings.type";
import stripText from "@/utils/stripText";

interface Props {
  staticStrings: staticStrings;
}

const RegionalRestaurantSection: FC<Props> = ({ staticStrings }) => {
  const categories = [
    {
      name: stripText(staticStrings.restaurantPasta),
      image: "/statics/website/marketplace/pasta.png",
    },
    {
      name: stripText(staticStrings.restaurantSalse),
      image: "/statics/website/marketplace/salse.png",
    },
    {
      name: stripText(staticStrings.restaurantVino),
      image: "/statics/website/marketplace/vini.png",
    },
    {
      name: stripText(staticStrings.restaurantDolci),
      image: "/statics/website/marketplace/dolci.png",
    },
    {
      name: stripText(staticStrings.restaurantFormaggi),
      image: "/statics/website/marketplace/formaggi.png",
    },
    {
      name: stripText(staticStrings.restaurantOlio),
      image: "/statics/website/marketplace/olio.png",
    },
  ];
  return null; //temporary

  // return (
  //   <Grid container size={12} spacing={2}>
  //     <Grid size={12}>
  //       <Stack direction={{ md: "row", xs: "column" }} spacing={2} sx={{ alignItems: "center", justifyContent: "start" }}>
  //         <Typography
  //           variant="h3"
  //           fontWeight={config.fontWeightTitleDefault}
  //           fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
  //         >
  //           {stripText(staticStrings.restaurantSectionTitle)}
  //         </Typography>
  //       </Stack>
  //     </Grid>
  //     <Grid size={12}>
  //       <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", justifyContent: { md: "space-between", xs: "center" } }} spacing={4}>
  //         {categories.map((category, index) => (
  //           <RegionalRestaurantCategory key={index} category={category.name} image={category.image} />
  //         ))}
  //       </Stack>
  //     </Grid>
  //   </Grid>
  // );
};

export default RegionalRestaurantSection;
