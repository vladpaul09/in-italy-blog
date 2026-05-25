"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import config from "@/config";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import PodcastThumbnail from "@/components/Shared/Podcast/PodcastThumbnail";
import { podcast } from "@/types/podcast.type";
import { staticStrings } from "@/types/staticStrings.type";
import { article } from "@/types/article.type";
import Skeleton from "@mui/material/Skeleton";
import stripText, { stripTextWithWord } from "@/utils/stripText";
import InfoPodcastCard from "@/components/Shared/InfoPodcastCard";
import HomepagePodcastsCarousel from "@/components/PageSrc/Homepage/HomepagePodcastsCarousel";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmblaCarouselWrapper from "@/components/Shared/EmblaCarousel/EmblaCarouselWrapper";
import EmblaCarouselWrapperViewport from "@/components/Shared/EmblaCarousel/EmblaCarouselWrapperViewport";
import EmblaCarouselContainer from "@/components/Shared/EmblaCarousel/EmblaCarouselContainer";
import EmblaCarouselSlider from "@/components/Shared/EmblaCarousel/EmblaCarouselSlider";
import CardListNavButtons from "@/components/Shared/Regional/CardListNavButtons";

interface Props {
  locale: string;
  latestPodcasts: Array<podcast>;
  defaultPodcast?: podcast;
  staticStrings: staticStrings;
  newsArticles?: Array<article>;
}

const ListNavButton = styled(IconButton)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.87)",
  fontWeight: 400,
  textTransform: "none",
  width: "40px",
  height: "40px",
  transition: "opacity 0.1s ease-in-out",
}));

const NewsBox: FC<{
  text: string;
  date: string;
  slug: string;
  locale: string;
}> = ({ text, date, locale, slug }) => {
  return (
    <Stack className="global-border-radius" direction="row" sx={{ backgroundColor: "#fff", p: 2, pl: 0, height: "100%" }}>
      <Box sx={{ px: 1.5, pt: "2px" }}>
        <AccessTimeIcon sx={{ fontSize: "16px" }} />
      </Box>
      <Box sx={{ height: "100%" }}>
        <Typography
          variant="body1"
          sx={{ textDecoration: "none", color: "black" }}
          fontSize={14}
          component={Link}
          href={`/${locale}/articolo/${slug}`}
        >
          <Typography component="span" fontWeight={700} fontSize={14}>
            {dayjs(date.replace("Z", "")).format("DD/MM/YYYY HH:mm")}{" "}
          </Typography>
          {stripTextWithWord(text, 60)}
        </Typography>
      </Box>
    </Stack>
  );
};

const HomepageNews: FC<Props> = ({ locale, latestPodcasts, defaultPodcast, staticStrings, newsArticles }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const maxStep = newsArticles ? newsArticles.length : 4;

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

  return (
    <Grid container columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} rowSpacing={1} sx={{ alignItems: "start" }}>
      <Grid container size={defaultPodcast ? { xs: 12, lg: 8 } : 12} spacing={2}>
        <Grid size={12}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }} spacing={2}>
            <Typography
              variant="h3"
              fontWeight={config.fontWeightTitleDefault}
              fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
              sx={{ m: 0, p: 0 }}
            >
              {stripText(staticStrings.homepageNews)}
            </Typography>
            <CardListNavButtons
              animationNext={scrollNext}
              animationPrev={scrollPrev}
              canScrollPrev={selectedIndex > 0}
              canScrollNext={selectedIndex < scrollSnaps.length - 1}
            />
          </Stack>
        </Grid>
        <Grid size={12}>
          <EmblaCarouselWrapper>
            <EmblaCarouselWrapperViewport ref={emblaRef}>
              <EmblaCarouselContainer spacing={2}>
                {Array.isArray(newsArticles)
                  ? newsArticles
                      .sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                      })
                      .map((item, index) => (
                        <EmblaCarouselSlider
                          key={index}
                          sx={{
                            minWidth: "0",
                            transform: "translate3d(0, 0, 0)",
                            flex: { xs: "0 0 290px", xl: "0 0 400px" },
                            height: { xs: "95px", xl: "74px" },
                          }}
                        >
                          <NewsBox text={item.title} date={item.createdAt as string} locale={locale} slug={item.slug} />
                        </EmblaCarouselSlider>
                      ))
                  : Array(maxStep)
                      .fill(null)
                      .map((_, index) => (
                        <EmblaCarouselSlider
                          key={index}
                          sx={{
                            minWidth: "0",
                            transform: "translate3d(0, 0, 0)",
                            flex: { xs: "0 0 290px", xl: "0 0 400px" },
                            height: { xs: "95px", xl: "74px" },
                          }}
                        >
                          <Skeleton
                            animation="wave"
                            variant="rounded"
                            sx={{
                              height: "100%",
                              width: "100%",
                            }}
                          />
                        </EmblaCarouselSlider>
                      ))}
              </EmblaCarouselContainer>
            </EmblaCarouselWrapperViewport>
          </EmblaCarouselWrapper>
        </Grid>
        <Grid size={12}>
          <HomepagePodcastsCarousel
            spacing={2}
            items={latestPodcasts.map((podcast, index) => (
              <EmblaCarouselSlider key={index} sx={{ minWidth: "0", transform: "translate3d(0, 0, 0)", flex: { xs: "0 0 280px", lg: "0 0 310px" } }}>
                <PodcastThumbnail podcastSlug={podcast.slug} image={podcast.image} locale={locale} />
                <Typography variant="caption" fontWeight={500} fontSize={14}>
                  {podcast.title}
                </Typography>
              </EmblaCarouselSlider>
            ))}
          />
        </Grid>
      </Grid>
      {defaultPodcast && (
        <Grid container size={{ xs: 12, lg: 4 }}>
          <Grid size={12}>
            <Typography variant="body1" fontWeight={700} sx={{ pt: { xs: 0, lg: 1.6 }, pb: { xs: 0, lg: 2.5 } }}>
              {stripText(staticStrings.homepageShowcasePodcast)}
            </Typography>
          </Grid>
          <Grid size={12}>
            <InfoPodcastCard
              locale={locale}
              podcast={{
                image: defaultPodcast.image,
                mobileImage: defaultPodcast.mobileImage,
                title: defaultPodcast.title,
                youtubeLink: defaultPodcast.youtubeLink,
                slug: defaultPodcast.slug,
                description: defaultPodcast.description,
                url: `/${locale}/podcast/${defaultPodcast.slug}`,
              }}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default HomepageNews;
