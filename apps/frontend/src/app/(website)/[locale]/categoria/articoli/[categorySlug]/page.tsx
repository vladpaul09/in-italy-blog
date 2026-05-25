import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import getStaticStrings from "@/data/getStaticStrings.data";
import config from "@/config";
import InfoPostCard from "@/components/Shared/InfoPostCard";
import RelatedNew from "@/components/Shared/Widgets/RelatedNew";
import Typography from "@mui/material/Typography";
import CustomPagination from "@/components/Shared/CustomPagination";
import stripText from "@/utils/stripText";
import CkEditorContent from "@/components/Shared/CkEditorContent";
import CardSection from "@/components/Shared/Regional/CardSection";
import { categoryArticleInfoPost } from "@/utils/categoryInfoPost.util";
import CategoryPageView from "@/entries/categoryPageView.entry";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { article } from "@/types/article.type";
import { region } from "@/types/region.type";
import { category, categoryRegional } from "@/types/category.type";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    locale: string;
    categorySlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    perPage?: string;
  }>;
}

interface ResponseData {
  category: category;
  articles: Array<article>;
  latestArticles: Array<article>;
  articlesBasedOnRegions: Array<region & { articles: Array<article> }>;
  categoriesArticles: Array<categoryRegional>;
  total: number;
}

const getData = async (locale: string, categorySlug: string, page: number, perPage: number): Promise<ResponseData> => {
  const rangeFirst = (page - 1) * perPage;
  const rangeLast = page * perPage - 1;
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/category/articles/${categorySlug}/${rangeFirst}/${rangeLast}`;
  const res = await fetch(apiUrl, { next: { revalidate: 0 } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const { category } = await getData(locale, categorySlug, 1, config.perPageCategoryArticles);

  return generatePageMetadata({
    title: category.name,
    description: stripText(category.description, true, 200),
    image: category.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/categoria/articoli/${categorySlug}`,
  });
}

export default async function CategoryArticlesIndex({ params, searchParams }: Props) {
  const { locale, categorySlug } = await params;
  const { page, perPage } = await searchParams;
  const pageNumber = page ? Number(page) : 1;
  const perPageNumber = perPage ? Number(perPage) : config.perPageCategoryArticles;

  const { category, articles, latestArticles, total, articlesBasedOnRegions, categoriesArticles } = await getData(
    locale,
    categorySlug,
    pageNumber,
    perPageNumber
  );
  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header staticStrings={staticStrings} bgImage={category.image} mobileBgImage={category.mobileImage}>
        <HeaderInfo title={category.name} />
      </Header>
      <MainContainer
        sx={{ pt: { xs: config.spacingMobile * config.spacingRowColumnRatio, md: config.spacingDesktop * config.spacingRowColumnRatio } }}
      >
        <Grid
          container
          columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}
          rowSpacing={{ xs: config.spacingRowColumnRatio * config.spacingMobile, md: config.spacingRowColumnRatio * config.spacingDesktop }}
          sx={{ alignItems: "start" }}
        >
          {category.description && (
            <Grid size={12}>
              <CkEditorContent content={category.description} />
            </Grid>
          )}
          {category.pageView === CategoryPageView.REGIONAL_VIEW && (
            <>
              {articlesBasedOnRegions
                .map((region, regionIndex) => {
                  // Transform articles into categoryWithInfoPosts format for CardSection
                  const transformedCategory = categoryArticleInfoPost({
                    ...category,
                    articles: region.articles,
                  });

                  return (
                    <Grid container size={12} spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} key={regionIndex}>
                      <Grid size={12}>
                        <Typography
                          variant="h2"
                          fontWeight={config.fontWeightTitleDefault}
                          fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
                        >
                          {region.name}
                        </Typography>
                      </Grid>
                      <Grid size={12}>
                        <CardSection showCategoriesButtons={false} categories={[transformedCategory]} locale={locale} staticStrings={staticStrings} />
                      </Grid>
                    </Grid>
                  );
                })}
            </>
          )}
          {category.pageView === CategoryPageView.PARENT_CATEGORY_VIEW && (
            <>
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
            </>
          )}
          {category.pageView === CategoryPageView.POSTS_VIEW && (
            <>
              <Grid container size={{ xs: 12, lg: 8 }} spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}>
                {articles.map((article, index) => (
                  <Grid size={{ xs: 12, lg: 6 }} key={index}>
                    <InfoPostCard
                      title={article.title}
                      image={article.image}
                      mobileImage={article.mobileImage}
                      description={article.description}
                      url={`/${locale}/articolo/${article.slug}`}
                      locale={locale}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid container size={{ xs: 12, lg: 4 }} spacing={{ xs: 5, lg: 1 }}>
                <Grid size={12}>
                  <Typography
                    variant="h3"
                    fontWeight={config.fontWeightTitleDefault}
                    fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
                  >
                    {stripText(staticStrings.relatedArticlesSectionTitle)}
                  </Typography>
                </Grid>
                <Grid container size={12} spacing={config.spacingMobile * config.spacingRowColumnRatio}>
                  {latestArticles
                    .sort((a, b) => {
                      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                      return dateB - dateA;
                    })
                    .map((article, index) => (
                      <RelatedNew
                        slug={article.slug}
                        key={index}
                        image={article.image}
                        mobileImage={article.mobileImage}
                        locale={locale}
                        title={article.title}
                        url={`/${locale}/articolo/${article.slug}`}
                        description={article.description}
                        staticStrings={staticStrings}
                      />
                    ))}
                </Grid>
              </Grid>
              {total > perPageNumber && (
                <Grid size={12}>
                  <CustomPagination
                    total={total}
                    page={pageNumber}
                    perPage={perPageNumber}
                    locale={locale}
                    url={`/${locale}/categoria/articoli/${categorySlug}`}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </MainContainer>
      <br />
    </>
  );
}
