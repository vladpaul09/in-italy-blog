"use client";

import { FC } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import stripText from "@/utils/stripText";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import config from "@/config";

interface Props {
  title: string;
  image: string;
  mobileImage: string;
  description: string;
  url: string;
  locale: string;
}

const InfoPostCard: FC<Props> = ({ title, image, mobileImage, description, url }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const imageSrc = isMobile && mobileImage ? mobileImage : image;

  return (
    <CardActionArea component={Link} href={url} sx={{ height: "inherit" }}>
      <Card variant="outlined" sx={{ width: "100%", height: "100%" /*borderRadius: "12px"*/ }}>
        <Box sx={{ position: "relative", width: "100%", height: "225px" }}>
          <Box
            component={Image}
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            sx={{ objectFit: "cover" }}
          />
        </Box>
        <CardContent sx={{ height: "255px" }}>
          <Box sx={{ height: "100%" }}>
            <br />
            <Typography fontSize={config.fontSizeArticleTitle} fontWeight={config.fontWeightTitleDefault}>
              {title}
            </Typography>
            <br />
            <Typography
              fontWeight={400}
              fontSize={config.fontSizeDefaultText}
              dangerouslySetInnerHTML={{ __html: stripText(description, true, 100) }}
            />
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default InfoPostCard;
