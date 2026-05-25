"use client";

import { FC, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import InfoPodcastCard from "../InfoPodcastCard";
import CardListNavButtons from "./CardListNavButtons";
import CardListProgress from "./CardListProgress";
import { staticStrings } from "@/types/staticStrings.type";
import EmblaCarouselWrapper from "../EmblaCarousel/EmblaCarouselWrapper";
import EmblaCarouselWrapperViewport from "../EmblaCarousel/EmblaCarouselWrapperViewport";
import EmblaCarouselContainer from "../EmblaCarousel/EmblaCarouselContainer";
import EmblaCarouselSlider from "../EmblaCarousel/EmblaCarouselSlider";
import { EmblaCarouselType } from "embla-carousel";
import infoPostType from "@/types/infoPost.type";

interface Props {
  podcasts: Array<infoPostType>;
  locale: string;
  staticStrings: staticStrings;
}

const CardListPodcast: FC<Props> = ({ podcasts, locale, staticStrings }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

  const onSelect = useCallback(
    (emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    },
    [setSelectedIndex]
  );

  const onProgress = useCallback(
    (emblaApi: EmblaCarouselType) => {
      // Use requestAnimationFrame to batch progress updates and prevent forced reflows
      requestAnimationFrame(() => {
        setProgress(emblaApi.scrollProgress());
      });
    },
    [setProgress]
  );

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    onProgress(emblaApi);
    const reInit = (emblaApiReInit: EmblaCarouselType) => {
      onSelect(emblaApiReInit);
      onProgress(emblaApiReInit);
    };
    emblaApi.on("reInit", reInit);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onProgress);

    return () => {
      emblaApi.off("reInit", reInit);
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onProgress);
    };
  }, [emblaApi, onSelect, onProgress]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <>
      <EmblaCarouselWrapper>
        <EmblaCarouselWrapperViewport ref={emblaRef}>
          <EmblaCarouselContainer spacing={2}>
            {podcasts.map((podcast, index) => (
              <EmblaCarouselSlider key={index} sx={{ height: "260px", flex: { xs: "0 0 290px", xl: "0 0 375px" } }}>
                <InfoPodcastCard locale={locale} podcast={podcast} />
              </EmblaCarouselSlider>
            ))}
          </EmblaCarouselContainer>
        </EmblaCarouselWrapperViewport>
      </EmblaCarouselWrapper>
      <CardListProgress progress={progress * 100} />
      <CardListNavButtons
        animationNext={scrollNext}
        animationPrev={scrollPrev}
        canScrollPrev={selectedIndex > 0}
        canScrollNext={selectedIndex < scrollSnaps.length - 1}
      />
    </>
  );
};

export default CardListPodcast;
