"use client";

import { FC, useEffect, useState } from "react";
import useSWR from "swr";
import Grid from "@mui/material/Grid";
import config from "@/config";
import { staticStrings } from "@/types/staticStrings.type";
import CardSection from "@/components/Shared/Regional/CardSection";
import AccomodationCardListSkeleton from "../../Shared/Regional/AccomodationCardListSkeleton";
import HorizontalButtonsSkeleton from "@/components/Shared/Regional/HorizontalButtonsSkeleton";
import { categoryArticleInfoPost, categoryEventInfoPost } from "@/utils/categoryInfoPost.util";
import HomepageNews from "./HomepageNews";
import { podcast } from "@/types/podcast.type";
import { article } from "@/types/article.type";
import userLocationCoordinatesEventBus from "@/rxjs/userLocationCoordinates.eventbus";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { categoryRegional } from "@/types/category.type";
import apiLocationUrl from "@/utils/apiLocationUrl.util";

interface Props {
  locale: string;
  staticStrings: staticStrings;
  latestPodcasts: Array<podcast>;
  defaultPodcast?: podcast;
  newsArticles: Array<article>;
}

const HomepageLocationEventArticleWrapper: FC<Props> = ({ locale, staticStrings, latestPodcasts, defaultPodcast, newsArticles }) => {
  const [{ latitude, longitude }, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });

  const { data, isLoading } = useSWR<
    {
      news: Array<article>;
      categoriesArticles: categoryRegional[];
      categoriesEvents: categoryRegional[];
    },
    Error
  >(latitude && longitude ? apiLocationUrl(locale, latitude, longitude) : null, (url: string) =>
    fetch(url, { headers: { accept: "application/json", "Content-Type": "application/json" } }).then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw new Error(fetchTextDebug(url, r.status, r.statusText));
    })
  );

  const { news, categoriesArticles, categoriesEvents } = data ?? { news: [], categoriesArticles: [], categoriesEvents: [] };

  useEffect(() => {
    const subscription = userLocationCoordinatesEventBus.subscribe((coords) => {
      if (coords.latitude && coords.longitude) {
        setCoords({ latitude: coords.latitude, longitude: coords.longitude });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setCoords]);

  return (
    <>
      <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
        <HomepageNews
          locale={locale}
          latestPodcasts={latestPodcasts}
          defaultPodcast={defaultPodcast}
          newsArticles={isLoading ? undefined : (news || []).length > 0 ? news : newsArticles}
          staticStrings={staticStrings}
        />
      </Grid>
      {data && (
        <>
          <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
            {categoriesEvents ? (
              categoriesEvents.length !== 0 &&
              categoriesEvents
                .filter((category) => category.subcategories.length > 0)
                .map((category, index) => (
                  <Grid key={index} size={12}>
                    <CardSection
                      title={category.name}
                      showCategoriesButtons
                      locale={locale}
                      categories={category.subcategories.map((subcategory) => categoryEventInfoPost(subcategory))}
                      staticStrings={staticStrings}
                    />
                  </Grid>
                ))
            ) : (
              <>
                <Grid size={12}>
                  <HorizontalButtonsSkeleton />
                </Grid>
                <Grid size={12}>
                  <AccomodationCardListSkeleton />
                </Grid>
              </>
            )}
          </Grid>
          <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
            {categoriesArticles ? (
              categoriesArticles.length !== 0 &&
              categoriesArticles
                .filter((category) => category.subcategories.length > 0)
                .map((category, index) => (
                  <Grid key={index} size={12}>
                    <CardSection
                      title={category.name}
                      showCategoriesButtons
                      locale={locale}
                      categories={category.subcategories.map((subcategory) => categoryArticleInfoPost(subcategory))}
                      staticStrings={staticStrings}
                    />
                  </Grid>
                ))
            ) : (
              <>
                <Grid size={12}>
                  <HorizontalButtonsSkeleton />
                </Grid>
                <Grid size={12}>
                  <AccomodationCardListSkeleton />
                </Grid>
              </>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default HomepageLocationEventArticleWrapper;
