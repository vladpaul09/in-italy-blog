import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import getStaticStrings from "@/data/getStaticStrings.data";
import config from "@/config";
import Typography from "@mui/material/Typography";
import CustomPagination from "@/components/Shared/CustomPagination";
import CkEditorContent from "@/components/Shared/CkEditorContent";
import CardSectionPodcast from "@/components/Shared/Regional/CardSectionPodcast";
import { categoryPodcastInfoPost } from "@/utils/categoryInfoPost.util";
import CategoryPageView from "@/entries/categoryPageView.entry";
import { region } from "@/types/region.type";
import { podcast } from "@/types/podcast.type";
import { category } from "@/types/category.type";
import fetchTextDebug from "@/utils/fetchTextDebug";
import InfoPodcastCard from "@/components/Shared/InfoPodcastCard";
import stripText from "@/utils/stripText";
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
  podcasts: Array<podcast>;
  podcastsBasedOnRegions: Array<region & { podcasts: Array<podcast> }>;
  total: number;
}

const getData = async (locale: string, categorySlug: string, page: number, perPage: number): Promise<ResponseData> => {
  const rangeFirst = (page - 1) * perPage;
  const rangeLast = page * perPage - 1;
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/category/podcasts/${categorySlug}/${rangeFirst}/${rangeLast}`;
  const res = await fetch(apiUrl, { next: { revalidate: 0 } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const { category } = await getData(locale, categorySlug, 1, config.perPageCategoryPodcasts);

  return generatePageMetadata({
    title: category.name,
    description: stripText(category.description, true, 200),
    image: category.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/categoria/podcasts/${categorySlug}`,
  });
}

export default async function CategoryPodcastsIndex({ params, searchParams }: Props) {
  const { locale, categorySlug } = await params;
  const { page, perPage } = await searchParams;
  const pageNumber = page ? Number(page) : 1;
  const perPageNumber = perPage ? Number(perPage) : config.perPageCategoryPodcasts;

  const { category, podcasts, total, podcastsBasedOnRegions } = await getData(locale, categorySlug, pageNumber, perPageNumber);

  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header
        staticStrings={staticStrings}
        bgImage={category.image}
        mobileBgImage={category.mobileImage}
      >
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
          {category.pageView === CategoryPageView.REGIONAL_VIEW ? (
            <Grid size={12}>
              {podcastsBasedOnRegions.map((region, regionIndex) => {
                // Transform podcasts into categoryWithInfoPosts format for CardSection
                const transformedCategory = categoryPodcastInfoPost({
                  ...category,
                  podcasts: region.podcasts,
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
                      <CardSectionPodcast
                        categories={[transformedCategory]}
                        showCategoriesButtons={true}
                        locale={locale}
                        staticStrings={staticStrings}
                      />
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <>
              <Grid container size={12} spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}>
                {podcasts.map((podcast, index) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                    <InfoPodcastCard
                      locale={locale}
                      podcast={{
                        image: podcast.image,
                        mobileImage: podcast.mobileImage,
                        title: podcast.title,
                        youtubeLink: podcast.youtubeLink,
                        slug: podcast.slug,
                        description: podcast.description,
                        url: `/${locale}/podcast/${podcast.slug}`,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              {total > perPageNumber && (
                <Grid size={12}>
                  <CustomPagination
                    total={total}
                    page={pageNumber}
                    perPage={perPageNumber}
                    locale={locale}
                    url={`/${locale}/categoria/podcast/${categorySlug}`}
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
