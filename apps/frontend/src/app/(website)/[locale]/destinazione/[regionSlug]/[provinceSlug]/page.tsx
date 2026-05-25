import { Metadata } from "next";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import MainContainer from "@/components/Containers/MainContainer";
import CardSection from "@/components/Shared/Regional/CardSection";
import Grid from "@mui/material/Grid";
import RegionalActivitySection from "@/components/Shared/Regional/RegionalActivitySection";
import RegionalDescriptionSection from "@/components/Shared/Regional/RegionalDescriptionSection";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import config from "@/config";
import getData from "@/data/getProvince.data";
import { regionResponse } from "@/types/region.type";
import { provinceResponse } from "@/types/province.type";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import getStaticStrings from "@/data/getStaticStrings.data";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { categoryArticleInfoPost, categoryEventInfoPost } from "@/utils/categoryInfoPost.util";
import stripText from "@/utils/stripText";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
    regionSlug: string;
    provinceSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, regionSlug, provinceSlug } = await params;
  const { province } = await getData({ regionSlug, provinceSlug, locale });

  return generatePageMetadata({
    title: province.name,
    description: stripText(province.description, true, 200),
    image: province.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/destinazione/${regionSlug}/${provinceSlug}`,
  });
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const apiUrl = `${config.serverNameBackend}/api/website/regions/all`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  const data = await res.json();

  const paths: Array<{
    provinceSlug: string;
  }> = [];

  data.forEach((region: regionResponse) => {
    region.provincesSlugs.forEach((province: provinceResponse) => {
      paths.push({
        provinceSlug: province.provinceSlug,
      });
    });
  });

  return [...paths];
}

export default async function ProvincePageIndex({ params }: Props) {
  const { locale, regionSlug, provinceSlug } = await params;
  const { province, categoriesArticles, categoriesEvents } = await getData({ regionSlug, provinceSlug, locale });

  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header staticStrings={staticStrings} bgImage={province.image} mobileBgImage={province.mobileImage}>
        <HeaderInfo title={`${stripText(staticStrings.provinceTitle)} ${province.name}`} subtitle={province.region.name} />
      </Header>
      <MainContainer
        sx={{ py: { xs: config.spacingMobile * config.spacingRowColumnRatio, md: config.spacingDesktop * config.spacingRowColumnRatio } }}
      >
        <Grid
          container
          columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}
          rowSpacing={{ xs: config.spacingRowColumnRatio * config.spacingMobile, md: config.spacingRowColumnRatio * config.spacingDesktop }}
        >
          <RegionalDescriptionSection description={province.description} />
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
              type={"province"}
              staticStrings={staticStrings}
              locationName={province.name}
            />
          )}
          <RegionalRestaurantSection staticStrings={staticStrings} />
        </Grid>
      </MainContainer>
    </>
  );
}
