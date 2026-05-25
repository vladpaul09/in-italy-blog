"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import config from "@/config";
import { staticStrings } from "@/types/staticStrings.type";

interface Props {
  title: string;
  image: string;
  mobileImage: string;
  url: string;
  locale: string;
  type: "category" | "article" | "event" | "podcast";
  staticStrings: staticStrings;
}

const SearchInfoPostCard: FC<Props> = ({ title, image, mobileImage, url, type, staticStrings }) => {
  const getTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      category: staticStrings.search_type_category || "Category",
      article: staticStrings.search_type_article || "Article",
      event: staticStrings.search_type_event || "Event",
      podcast: staticStrings.search_type_podcast || "Podcast",
    };
    return typeLabels[type] || type;
  };

  return (
    <CardActionArea component={Link} href={url} sx={{ height: "inherit" }}>
      <Card variant="outlined" sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ position: "relative", width: "100%", height: "225px" }}>
          <Box
            component={Image}
            src={image}
            alt={title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            sx={{ objectFit: "cover" }}
          />
        </Box>
        <CardContent sx={{ height: "155px" }}>
          <Box sx={{ height: "100%" }}>
            <Typography variant="caption" fontWeight={600} color="primary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              {getTypeLabel(type)}
            </Typography>
            <Typography fontSize={config.fontSizeArticleTitle} fontWeight={config.fontWeightTitleDefault} sx={{ mt: 1.5 }}>
              {title}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default SearchInfoPostCard;
