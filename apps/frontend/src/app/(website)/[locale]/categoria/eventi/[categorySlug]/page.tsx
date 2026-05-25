import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import getStaticStrings from "@/data/getStaticStrings.data";
import config from "@/config";
import RelatedNew from "@/components/Shared/Widgets/RelatedNew";
import Typography from "@mui/material/Typography";
import CustomPagination from "@/components/Shared/CustomPagination";
import stripText from "@/utils/stripText";
import CkEditorContent from "@/components/Shared/CkEditorContent";
import CardSection from "@/components/Shared/Regional/CardSection";
import { categoryEventInfoPost } from "@/utils/categoryInfoPost.util";
import InfoPostCard from "@/components/Shared/InfoPostCard";
import CategoryPageView from "@/entries/categoryPageView.entry";
import { region } from "@/types/region.type";
import { event } from "@/types/event.type";
import { category } from "@/types/category.type";
import fetchTextDebug from "@/utils/fetchTextDebug";
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
  events: Array<event>;
  latestEvents: Array<event>;
  eventsBasedOnRegions: Array<region & { events: Array<event> }>;
  total: number;
}

const getData = async (locale: string, categorySlug: string, page: number, perPage: number): Promise<ResponseData> => {
  const rangeFirst = (page - 1) * perPage;
  const rangeLast = page * perPage - 1;
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/category/events/${categorySlug}/${rangeFirst}/${rangeLast}`;
  const res = await fetch(apiUrl, { next: { revalidate: 0 } });
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const { category } = await getData(locale, categorySlug, 1, config.perPageCategoryEvents);

  return generatePageMetadata({
    title: category.name,
    description: stripText(category.description, true, 200),
    image: category.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/categoria/eventi/${categorySlug}`,
  });
}

export default async function CategoryEventsIndex({ params, searchParams }: Props) {
  const { locale, categorySlug } = await params;
  const { page, perPage } = await searchParams;
  const pageNumber = page ? Number(page) : 1;
  const perPageNumber = perPage ? Number(perPage) : config.perPageCategoryEvents;

  const { category, events, latestEvents, total, eventsBasedOnRegions } = await getData(locale, categorySlug, pageNumber, perPageNumber);
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
          {category.pageView === CategoryPageView.REGIONAL_VIEW ? (
            <Grid size={12}>
              {eventsBasedOnRegions
                .map((region, regionIndex) => {
                  // Transform events into categoryWithInfoPosts format for CardSection
                  const transformedCategory = categoryEventInfoPost({
                    ...category,
                    events: region.events,
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
                        <CardSection categories={[transformedCategory]} showCategoriesButtons={false} locale={locale} staticStrings={staticStrings} />
                      </Grid>
                    </Grid>
                  );
                })}
            </Grid>
          ) : (
            <>
              <Grid container size={{ xs: 12, lg: 8 }} spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}>
                {events.map((event, index) => (
                  <Grid size={{ xs: 12, lg: 6 }} key={index}>
                    <InfoPostCard
                      title={event.title}
                      image={event.image}
                      mobileImage={event.mobileImage}
                      description={event.description}
                      url={`/${locale}/evento/${event.slug}`}
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
                    {stripText(staticStrings.relatedEventsSectionTitle)}
                  </Typography>
                </Grid>
                <Grid container size={12} spacing={config.spacingMobile * config.spacingRowColumnRatio}>
                  {latestEvents
                    .sort((a, b) => {
                      const dateA = new Date(a.startDate).getTime();
                      const dateB = new Date(b.startDate).getTime();
                      return dateB - dateA;
                    })
                    .map((event, index) => (
                      <RelatedNew
                        slug={event.slug}
                        key={index}
                        image={event.image}
                        mobileImage={event.mobileImage}
                        locale={locale}
                        title={event.title}
                        url={`/${locale}/evento/${event.slug}`}
                        description={event.description}
                        staticStrings={staticStrings}
                        startDate={event.startDate}
                        endDate={event.endDate}
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
                    url={`/${locale}/categoria/eventi/${categorySlug}`}
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
