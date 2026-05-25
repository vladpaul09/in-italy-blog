import { Metadata } from "next";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import MainContainer from "@/components/Containers/MainContainer";
import CardSection from "@/components/Shared/Regional/CardSection";
import Grid from "@mui/material/Grid";
import HotelCardSection from "@/components/Shared/Regional/AccomodationCardSection";
import RegionalActivitySection from "@/components/Shared/Regional/RegionalActivitySection";
import RegionalDescriptionSection from "@/components/Shared/Regional/RegionalDescriptionSection";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import getData from "@/data/getAroundYou.data";
import config from "@/config";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import getStaticStrings from "@/data/getStaticStrings.data";
import getHomepageData from "@/data/homepage.data";

import { categoryArticleInfoPost, categoryEventInfoPost } from "@/utils/categoryInfoPost.util";
import stripText from "@/utils/stripText";
import Typography from "@mui/material/Typography";
import MapWidget from "@/components/Shared/Widgets/MapWidget";
import HomepageMapEvents from "@/components/PageSrc/Homepage/HomepageMapEvents";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    locale: string;
    regionSlug: string;
    provinceSlug: string;
    municipalitySlug: string;
  }>;
  searchParams: Promise<{
    datetime: string;
    lat: string;
    long: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, regionSlug, provinceSlug, municipalitySlug } = await params;
  const { datetime, lat, long } = await searchParams;
  
  const { municipalityData: municipality } = await getData(locale, municipalitySlug, lat, long, datetime);

  return generatePageMetadata({
    title: `Intorno a te - ${municipality.name}`,
    description: stripText(municipality.description, true, 200),
    image: municipality.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/destinazione/${regionSlug}/${provinceSlug}/${municipalitySlug}/intorno-a-te`,
  });
}

export default async function MunicipalityAroundYouPageIndex({ params, searchParams }: Props) {
  const { locale, municipalitySlug } = await params;
  const { datetime, lat, long } = await searchParams;

  const { municipalityData: municipality, categoriesArticles, categoriesEvents } = await getData(locale, municipalitySlug, lat, long, datetime);

  const { mapPosts } = await getHomepageData(locale);
  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header staticStrings={staticStrings} bgImage={municipality.image} mobileBgImage={municipality.mobileImage}>
        <HeaderInfo title={municipality.name} subtitle={municipality.province.region.name} />
      </Header>
      <MainContainer
        sx={{ pt: { xs: config.spacingMobile * config.spacingRowColumnRatio, md: config.spacingDesktop * config.spacingRowColumnRatio } }}
      >
        <Grid
          container
          columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}
          rowSpacing={{ xs: config.spacingRowColumnRatio * config.spacingMobile, md: config.spacingRowColumnRatio * config.spacingDesktop }}
        >
          <RegionalDescriptionSection description={municipality.description} />
          <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={{ xs: 12, lg: 6 }}>
            <Grid size={12}>
              <Typography
                variant="h3"
                fontWeight={config.fontWeightTitleDefault}
                fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
              >
                {stripText(staticStrings.homepageMapTitle)}
              </Typography>
            </Grid>
            <Grid size={12}>
              <MapWidget locale={locale} mapPosts={mapPosts} />
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={{ xs: 12, lg: 6 }}>
            <Grid size={12}>
              <Typography
                variant="h3"
                fontWeight={config.fontWeightTitleDefault}
                fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
              >
                {stripText(staticStrings.homepageMapEventsTitle)}
              </Typography>
            </Grid>
            <HomepageMapEvents posts={mapPosts} locale={locale} staticStrings={staticStrings} />
          </Grid>
          {categoriesArticles.length !== 0 &&
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
              ))}
          <HotelCardSection
            title={stripText(staticStrings.accommodationSectionTitle)}
            location={municipality.name}
            locale={locale}
            regionalObject={{
              latitude: municipality.latitude,
              longitude: municipality.longitude,
              radius: municipality.radius,
              radiusUnit: municipality.radiusUnit,
            }}
          />
          <RegionalNewsletter staticStrings={staticStrings} locale={locale} />
          {categoriesEvents.length !== 0 && (
            <RegionalActivitySection
              locale={locale}
              categories={categoriesEvents.map((category) => categoryEventInfoPost(category))}
              type="municipality"
              staticStrings={staticStrings}
            />
          )}
          <RegionalRestaurantSection staticStrings={staticStrings} />
        </Grid>
      </MainContainer>
    </>
  );
}
