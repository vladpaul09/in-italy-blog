import { Metadata } from "next";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import HotelCardSection from "@/components/Shared/Regional/AccomodationCardSection";
import getData from "@/data/getEvent.data";
import getStaticStrings from "@/data/getStaticStrings.data";
import Typography from "@mui/material/Typography";
import config from "@/config";
import RelatedNew from "@/components/Shared/Widgets/RelatedNew";
import EventDateText from "@/components/Shared/Widgets/EventDateText";
import stripText from "@/utils/stripText";
import CkEditorContent from "@/components/Shared/CkEditorContent";
import dayjs from "dayjs";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
    eventSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, eventSlug } = await params;
  const { event } = await getData({ locale, eventSlug });

  return generatePageMetadata({
    title: event.title,
    description: stripText(event.description, true, 200),
    image: event.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/evento/${eventSlug}`,
    type: "article",
  });
}

export default async function EventIndex({ params }: Props) {
  const { locale, eventSlug } = await params;

  const { municipality, event, latestEvents } = await getData({ locale, eventSlug });
  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header
        staticStrings={staticStrings}
        bgImage={event.image}
        mobileBgImage={event.mobileImage}
      >
        <HeaderInfo title={event.title} />
      </Header>
      <MainContainer
        sx={{ pt: { xs: config.spacingMobile * config.spacingRowColumnRatio, md: config.spacingDesktop * config.spacingRowColumnRatio } }}
      >
        <Grid
          container
          columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}
          rowSpacing={{ xs: config.spacingRowColumnRatio * config.spacingMobile, md: config.spacingRowColumnRatio * config.spacingDesktop }}
        >
          <Grid container size={12} sx={{ alignItems: "start" }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <EventDateText startDate={event.startDate} endDate={event.endDate} staticStrings={staticStrings} />
              <Typography
                component="p"
                variant="body2"
                sx={{
                  mb: 2,
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              >
                {stripText(staticStrings.author || "Autore")}: {event.author} • {dayjs(event.createdAt.replace("Z", "")).format("DD/MM/YYYY HH:mm")}
              </Typography>
              {event.description && <CkEditorContent content={event.description} />}
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
          </Grid>
          <RegionalRestaurantSection staticStrings={staticStrings} />
          {municipality && (
            <HotelCardSection
              title={stripText(staticStrings.accommodationSectionTitle)}
              location={municipality.name}
              locale={locale}
              regionalObject={municipality}
            />
          )}
          <RegionalNewsletter staticStrings={staticStrings} locale={locale} />
        </Grid>
      </MainContainer>
      <br />
    </>
  );
}
