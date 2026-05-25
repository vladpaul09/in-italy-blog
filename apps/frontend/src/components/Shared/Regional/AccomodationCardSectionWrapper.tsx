"use client";

import { FC, useEffect, useState } from "react";
import AccomodationCardSection from "./AccomodationCardSection";
import stripText from "@/utils/stripText";
import { staticStrings } from "@/types/staticStrings.type";
import userLocationCoordinatesEventBus from "@/rxjs/userLocationCoordinates.eventbus";

interface Props {
  staticStrings: staticStrings;
  locale: string;
}

const AccomodationCardSectionWrapper: FC<Props> = ({ staticStrings, locale }) => {
  const [{ latitude, longitude }, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });

  useEffect(() => {
    const subscription = userLocationCoordinatesEventBus.subscribe((coords) => {
      setCoords({ latitude: coords.latitude, longitude: coords.longitude });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setCoords]);

  return (
    <AccomodationCardSection
      title={stripText(staticStrings.accommodationSectionTitle)}
      locale={locale}
      regionalObject={
        latitude && longitude ? { latitude: latitude.toString(), longitude: longitude.toString(), radius: 100, radiusUnit: "m" } : undefined
      }
    />
  );
};

export default AccomodationCardSectionWrapper;
