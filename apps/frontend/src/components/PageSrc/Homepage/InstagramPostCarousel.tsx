"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import config from "@/config";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { staticStrings } from "@/types/staticStrings.type";
import { InstagramUserProfile } from "@/types/instagram.type";
import InstagramPostCard from "@/components/Shared/InstagramPostCard";
import Button from "@mui/material/Button";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmblaCarouselWrapper from "@/components/Shared/EmblaCarousel/EmblaCarouselWrapper";
import EmblaCarouselWrapperViewport from "@/components/Shared/EmblaCarousel/EmblaCarouselWrapperViewport";
import EmblaCarouselContainer from "@/components/Shared/EmblaCarousel/EmblaCarouselContainer";
import EmblaCarouselSlider from "@/components/Shared/EmblaCarousel/EmblaCarouselSlider";
import CardListNavButtons from "@/components/Shared/Regional/CardListNavButtons";
import stripText from "@/utils/stripText";

interface Props {
  locale: string;
  instagramData: InstagramUserProfile;
  staticStrings: staticStrings;
}

const InstagramProfilePicture = styled("img")(({ theme }) => ({
  borderRadius: "50%",
}));

const InstagramPostCarousel: FC<Props> = ({ locale, instagramData, staticStrings }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  // Get Instagram posts data
  const posts = instagramData?.media?.data || [];

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(
    (emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    },
    [setSelectedIndex]
  );

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Don't render if no posts available
  if (posts.length === 0) {
    return null;
  }

  return (
    <Grid container size={12} spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}>
      {/* Instagram Section Header */}
      <Grid size={12}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", alignItems: "center" }} spacing={2}>
          {/* Left side - Title and description */}
          <Box component="div" sx={{ m: 0, p: 0 }}>
            <Typography
              variant="h3"
              fontWeight={config.fontWeightTitleDefault}
              fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
              sx={{ mb: 2 }}

            >
              {stripText(staticStrings.homepageInstagramTitle) || "Condividi con noi #InItaly"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1, fontSize: config.fontSizeDefaultText }}>
              {stripText(staticStrings.homepageInstagramDescription) || "InItaly | Ambasciatori del territorio, unisciti alla community e posta le tue esperienze. Condividi i tuoi momenti #Initaly su Instagram e usa il tag @initaly.eu per avere la possibilità di essere incluso nella nostra selezione settimanale."}
            </Typography>
          </Box>

          {/* Right side - Profile info */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: { xs: "start", md: "end" },
              minWidth: { xs: "auto", md: 250 },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <a href={`https://instagram.com/${instagramData.username}`} target="_blank">
              <InstagramProfilePicture
                loading="lazy"
                src={instagramData.profile_picture_url}
                alt={`${instagramData.username} profile picture`}
                width="80"
                height="80"
              />
            </a>
            <Stack direction="column" spacing={1}>
              <Button
                variant="text"
                component="a"
                href={`https://instagram.com/${instagramData.username}`}
                target="_blank"
                sx={{ color: "#000", fontWeight: config.fontWeightTitleDefault, textTransform: "none", p: 0, m: 0 }}
              >
                @{instagramData.username}
              </Button>
              <Button
                component="a"
                href={`https://instagram.com/${instagramData.username}`}
                target="_blank"
                variant="outlined"
                size="small"
                startIcon={<InstagramIcon sx={{ fontSize: 18 }} />}
                sx={{ color: "#000", borderColor: "#000" }}
              >
                {stripText(staticStrings.homepageInstagramFollowButton) || "Seguici"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Grid>

      {/* Instagram Posts Carousel */}
      <Grid size={12}>
        <EmblaCarouselWrapper>
          <EmblaCarouselWrapperViewport ref={emblaRef}>
            <EmblaCarouselContainer spacing={2}>
              {posts.map((post, index) => (
                <EmblaCarouselSlider
                  key={index}
                  sx={{
                    minWidth: "0",
                    transform: "translate3d(0, 0, 0)",
                    flex: { xs: "0 0 280px", sm: "0 0 320px", md: "0 0 350px" },
                  }}
                >
                  <InstagramPostCard post={post} locale={locale} />
                </EmblaCarouselSlider>
              ))}
            </EmblaCarouselContainer>
          </EmblaCarouselWrapperViewport>
        </EmblaCarouselWrapper>
      </Grid>

      {/* Navigation Buttons */}
      <Grid size={12}>
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
          <CardListNavButtons
            animationPrev={scrollPrev}
            animationNext={scrollNext}
            canScrollPrev={selectedIndex > 0}
            canScrollNext={selectedIndex < scrollSnaps.length - 1}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default InstagramPostCarousel;
