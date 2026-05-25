"use client";

import { FC, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import AccomodationCard from "./AccomodationCard";
import CardListNavButtons from "../../Shared/Regional/CardListNavButtons";
import CardListProgress from "../../Shared/Regional/CardListProgress";
import useGetAccomodationListData from "@/hooks/useGetAccomodationListData";
import AccomodationCardListSkeleton from "../../Shared/Regional/AccomodationCardListSkeleton";
import EmblaCarouselWrapper from "@/components/Shared/EmblaCarousel/EmblaCarouselWrapper";
import EmblaCarouselWrapperViewport from "@/components/Shared/EmblaCarousel/EmblaCarouselWrapperViewport";
import EmblaCarouselContainer from "@/components/Shared/EmblaCarousel/EmblaCarouselContainer";
import EmblaCarouselSlider from "@/components/Shared/EmblaCarousel/EmblaCarouselSlider";

interface Props {
  locale: string;
  regionalObject: {
    latitude: string;
    longitude: string;
    radius: number;
    radiusUnit: string;
  };
  activityState: {
    id: string;
    name: string;
    category: string;
  };
}

const AccomodationCardList: FC<Props> = ({ locale, regionalObject, activityState }) => {
  const { data, isLoading, error } = useGetAccomodationListData(
    activityState.id,
    activityState.category,
    locale,
    regionalObject.latitude,
    regionalObject.longitude,
    regionalObject.radius,
    regionalObject.radiusUnit
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [setSelectedIndex]);

  const onProgress = useCallback((emblaApi: EmblaCarouselType) => {
    // Use requestAnimationFrame to batch progress updates and prevent forced reflows
    requestAnimationFrame(() => {
      setProgress(emblaApi.scrollProgress());
    });
  }, [setProgress]);

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

  if (isLoading || error) {
    return <AccomodationCardListSkeleton />;
  }

  return (
    <>
      <EmblaCarouselWrapper>
        <EmblaCarouselWrapperViewport ref={emblaRef}>
          <EmblaCarouselContainer spacing={2}>
            {data.map((item, index) => (
              <EmblaCarouselSlider key={index} sx={{ height: "500px", flex: { xs: "0 0 290px", xl: "0 0 375px" } }}>
                <AccomodationCard key={index} accommodation={item} />
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

export default AccomodationCardList;
