"use client";

import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import EmblaCarouselWrapper from "@/components/Shared/EmblaCarousel/EmblaCarouselWrapper";
import EmblaCarouselWrapperViewport from "@/components/Shared/EmblaCarousel/EmblaCarouselWrapperViewport";
import EmblaCarouselContainer from "@/components/Shared/EmblaCarousel/EmblaCarouselContainer";

interface Props {
  items: Array<ReactNode>;
  spacing: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  align?: "center" | "start" | "end";
}

const HomepagePodcastsCarousel: FC<Props> = ({ items, spacing, align = "start" }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const maxStep = items.length;

  const onSelect = useCallback(
    (emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    },
    [setSelectedIndex]
  );

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  // const changeSlideHandler = useCallback(
  //   (index: number) => {
  //     if (!emblaApi) return;
  //     emblaApi.scrollTo(index);
  //   },
  //   [emblaApi]
  // );

  return (
    <EmblaCarouselWrapper>
      <EmblaCarouselWrapperViewport ref={emblaRef}>
        <EmblaCarouselContainer spacing={spacing}>{items.map((slide) => slide)}</EmblaCarouselContainer>
      </EmblaCarouselWrapperViewport>
    </EmblaCarouselWrapper>
  );
};

export default HomepagePodcastsCarousel;
