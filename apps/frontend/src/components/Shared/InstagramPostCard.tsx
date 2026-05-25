"use client";

import { FC } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import LazyBackgroundImage from "./LazyBackgroundImage";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import config from "@/config";
import stripText from "@/utils/stripText";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: config.borderRadius,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  cursor: "pointer",
}));

interface Props {
  post: {
    id: string;
    caption: string | null;
    media_url: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    permalink: string;
    comments_count: number;
    like_count: number;
    view_count?: number;
  };
  locale: string;
}

const InstagramPostCard: FC<Props> = ({ post, locale }) => {
  const handleCardClick = () => {
    window.open(post.permalink, "_blank", "noopener,noreferrer");
  };

  const formatCaption = (caption: string | null) => {
    if (!caption) return "Check out this Instagram post";

    // Sanitize caption to prevent hydration errors
    const sanitizedCaption = caption
      .replace(/[\uD800-\uDFFF]/g, "") // Remove surrogate pairs that cause hydration issues
      .replace(/[\uFFFD]/g, "") // Remove replacement characters
      .replace(/[\n\r]+/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace

    return stripText(sanitizedCaption, true, 150);
  };

  return (
    <StyledCard onClick={handleCardClick} role="button" tabIndex={0} aria-label="View Instagram post">
      <LazyBackgroundImage
        image={post.media_url}
        height="280px"
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)",
          }}
        />
      </LazyBackgroundImage>

      <CardContent sx={{ p: 2, height: "150px" }}>
        <Typography
          variant="body2"
          color="text.secondary"
          component="p"
          fontSize={config.fontSizeDefaultText}
          dangerouslySetInnerHTML={{ __html: formatCaption(post.caption) || "" }}
        />
      </CardContent>
      <CardActions disableSpacing>
        <Button variant="text" size="small" startIcon={<FavoriteIcon />} sx={{ color: "text.secondary", px: 0 }}>
          {post.like_count.toLocaleString()}
        </Button>
        {post.comments_count > 0 && (
          <Button variant="text" size="small" startIcon={<CommentIcon />} sx={{ color: "text.secondary", px: 0 }}>
            {post.comments_count.toLocaleString()}
          </Button>
        )}
        {post.view_count && (
          <Button variant="text" size="small" startIcon={<VisibilityIcon />} sx={{ color: "text.secondary", px: 0 }}>
            {post.view_count?.toLocaleString()}
          </Button>
        )}
      </CardActions>
    </StyledCard>
  );
};

export default InstagramPostCard;
