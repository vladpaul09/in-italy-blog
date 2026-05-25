import { Metadata } from "next";
import Header from "@/components/UI/Header";
import MainContainer from "@/components/Containers/MainContainer";
import CardSection from "@/components/Shared/Regional/CardSection";
import RegionalActivitySection from "@/components/Shared/Regional/RegionalActivitySection";
import RegionalDescriptionSection from "@/components/Shared/Regional/RegionalDescriptionSection";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import config from "@/config";
import getData from "@/data/getRegion.data";
import getStaticStrings from "@/data/getStaticStrings.data";
import { regionResponse } from "@/types/region.type";
import fetchTextDebug from "@/utils/fetchTextDebug";
import Grid from "@mui/material/Grid";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import { categoryArticleInfoPost, categoryEventInfoPost } from "@/utils/categoryInfoPost.util";
import stripText from "@/utils/stripText";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
    regionSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, regionSlug } = await params;
  const { region } = await getData({ regionSlug, locale });

  return generatePageMetadata({
    title: region.name,
    description: stripText(region.description, true, 200),
    image: region.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/destinazione/${regionSlug}`,
  });
}

export async function generateStaticParams() {
  const apiUrl = `${config.serverNameBackend}/api/website/regions/all`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  const data = await res.json();

  return data.map((region: regionResponse) => ({
    regionSlug: region.regionSlug,
  }));
}

export default async function RegionIndex({ params }: Props) {
  const { locale, regionSlug } = await params;
  const { region, categoriesArticles, categoriesEvents } = await getData({ regionSlug, locale });

  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header staticStrings={staticStrings} bgImage={region.image} mobileBgImage={region.mobileImage}>
        <HeaderInfo title={region.name} />
      </Header>
      <MainContainer
        sx={{ py: { xs: config.spacingMobile * config.spacingRowColumnRatio, md: config.spacingDesktop * config.spacingRowColumnRatio } }}
      >
        <Grid
          container
          columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}
          rowSpacing={{ xs: config.spacingRowColumnRatio * config.spacingMobile, md: config.spacingRowColumnRatio * config.spacingDesktop }}
        >
          <RegionalDescriptionSection description={region.description} />
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
          <RegionalNewsletter staticStrings={staticStrings} locale={locale} />
          {categoriesEvents.length !== 0 && (
            <RegionalActivitySection
              locale={locale}
              categories={categoriesEvents.map((category) => categoryEventInfoPost(category))}
              type="region"
              staticStrings={staticStrings}
              locationName={region.name}
            />
          )}
          <RegionalRestaurantSection staticStrings={staticStrings} />
        </Grid>
      </MainContainer>
    </>
  );
}
