"use client";

import { FC, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import InfoCard from "./InfoCard";
import CardListNavButtons from "./CardListNavButtons";
import CardListProgress from "./CardListProgress";
import { staticStrings } from "@/types/staticStrings.type";
import infoPostType from "@/types/infoPost.type";
import EmblaCarouselWrapper from "../EmblaCarousel/EmblaCarouselWrapper";
import EmblaCarouselWrapperViewport from "../EmblaCarousel/EmblaCarouselWrapperViewport";
import EmblaCarouselContainer from "../EmblaCarousel/EmblaCarouselContainer";
import EmblaCarouselSlider from "../EmblaCarousel/EmblaCarouselSlider";
import { EmblaCarouselType } from "embla-carousel";

interface Props {
  objectArray: Array<infoPostType>;
  locale: string;
  staticStrings: staticStrings;
}

const CardList: FC<Props> = ({ objectArray, locale, staticStrings }) => {
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
            {objectArray.map((object, index) => (
              <EmblaCarouselSlider key={index} sx={{ height: "auto", flex: { xs: "0 0 290px", xl: "0 0 375px" } }}>
                <InfoCard object={object} locale={locale} staticStrings={staticStrings} />
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

export default CardList;
