"use client";

import { FC } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import AccomodationCardSkeleton from "../../PageSrc/MunicipalityPage/AccomodationCardSkeleton";
import CardListNavButtons from "./CardListNavButtons";
import EmblaCarouselWrapper from "../EmblaCarousel/EmblaCarouselWrapper";
import EmblaCarouselWrapperViewport from "../EmblaCarousel/EmblaCarouselWrapperViewport";
import EmblaCarouselContainer from "../EmblaCarousel/EmblaCarouselContainer";
import EmblaCarouselSlider from "../EmblaCarousel/EmblaCarouselSlider";

const AccomodationCardListSkeleton: FC = () => {
  const [emblaRef] = useEmblaCarousel({ dragFree: true });

  const cardArray = Array(4).fill(0);

  return (
    <>
      <EmblaCarouselWrapper>
        <EmblaCarouselWrapperViewport ref={emblaRef}>
          <EmblaCarouselContainer spacing={2}>
            {cardArray.map((hotel, index) => (
              <EmblaCarouselSlider
                key={index}
                sx={{
                  flex: { xs: "0 0 290px", xl: "0 0 375px" },
                  height: "500px",
                }}
              >
                <AccomodationCardSkeleton />
              </EmblaCarouselSlider>
            ))}
          </EmblaCarouselContainer>
        </EmblaCarouselWrapperViewport>
      </EmblaCarouselWrapper>
      <Skeleton variant="rounded" height={8} sx={{ display: { lg: "none", xs: "block" }, mt: 1 }} />
      <CardListNavButtons animationNext={() => {}} animationPrev={() => {}} canScrollPrev={false} canScrollNext={false} />
    </>
  );
};

export default AccomodationCardListSkeleton;
