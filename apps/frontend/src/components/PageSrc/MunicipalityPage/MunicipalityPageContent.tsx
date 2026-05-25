import { FC } from "react";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import CardSection from "@/components/Shared/Regional/CardSection";
import HotelCardSection from "@/components/Shared/Regional/AccomodationCardSection";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import RegionalActivitySection from "@/components/Shared/Regional/RegionalActivitySection";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import RegionalDescriptionSection from "@/components/Shared/Regional/RegionalDescriptionSection";
import { staticStrings } from "@/types/staticStrings.type";
import WeatherWidget from "@/components/Shared/Widgets/WeatherWidget";
import MapWidget from "@/components/Shared/Widgets/MapWidget";
import HomepageMapEvents from "@/components/PageSrc/Homepage/HomepageMapEvents";
import config from "@/config";
import { category, categoryRegional } from "@/types/category.type";
import { categoryArticleInfoPost } from "@/utils/categoryInfoPost.util";
import { categoryEventInfoPost } from "@/utils/categoryInfoPost.util";
import { municipality } from "@/types/municipality.type";
import { mapPosts } from "@/types/mapPostData.type";
import stripText from "@/utils/stripText";
import Typography from "@mui/material/Typography";

interface Props {
  staticStrings: staticStrings;
  locale: string;
  municipality: municipality;
  categoriesArticles: Array<categoryRegional>;
  categoriesEvents: Array<category>;
  mapPosts: Array<mapPosts>;
}

const MunicipalityPageContent: FC<Props> = ({ staticStrings, locale, municipality, categoriesArticles, categoriesEvents, mapPosts }) => (
  <MainContainer sx={{ py: { xs: config.spacingMobile * config.spacingRowColumnRatio, md: config.spacingDesktop * config.spacingRowColumnRatio } }}>
    <Grid
      container
      columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}
      rowSpacing={{ xs: config.spacingRowColumnRatio * config.spacingMobile, md: config.spacingRowColumnRatio * config.spacingDesktop }}
    >
      <RegionalDescriptionSection description={municipality.description} />
      <Grid size={12}>
        <Typography
          variant="h3"
          fontWeight={config.fontWeightTitleDefault}
          fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
        >
          {stripText(staticStrings.homepageMapTitle)}
        </Typography>
      </Grid>
      <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={{ xs: 12, lg: 6 }}>
        <MapWidget
          locale={locale}
          mapPosts={mapPosts}
          defaultLatitude={municipality.latitude}
          defaultLongitude={municipality.longitude}
          defaultZoom={13}
        />
      </Grid>
      <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={{ xs: 12, lg: 6 }}>
        <HomepageMapEvents posts={mapPosts} locale={locale} staticStrings={staticStrings} />
      </Grid>
      {categoriesEvents.length !== 0 && (
        <RegionalActivitySection
          locale={locale}
          categories={categoriesEvents.map((category) => categoryEventInfoPost(category))}
          type="municipality"
          staticStrings={staticStrings}
        />
      )}
      {categoriesArticles.length !== 0 &&
        categoriesArticles
          .filter((category) => category.subcategories.length > 0 || (category.articles && category.articles.length > 0))
          .map((category, index) => (
            <Grid key={index} size={12}>
              <CardSection
                title={category.name}
                showCategoriesButtons
                locale={locale}
                categories={
                  category.subcategories.length > 0
                    ? category.subcategories.map((subcategory) => categoryArticleInfoPost(subcategory))
                    : [categoryArticleInfoPost(category)]
                }
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
      <Grid size={{ xs: 12, lg: 8 }}>
        <RegionalNewsletter staticStrings={staticStrings} locale={locale} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <WeatherWidget latitude={municipality.latitude} longitude={municipality.longitude} staticStrings={staticStrings} locale={locale} days={3} />
      </Grid>
      <RegionalRestaurantSection staticStrings={staticStrings} />
    </Grid>
  </MainContainer>
);

export default MunicipalityPageContent;
