import { Metadata } from "next";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import getData from "@/data/getPodcast.data";
import getStaticStrings from "@/data/getStaticStrings.data";
import Typography from "@mui/material/Typography";
import config from "@/config";
import RelatedNew from "@/components/Shared/Widgets/RelatedNew";
import stripText from "@/utils/stripText";
import CkEditorContent from "@/components/Shared/CkEditorContent";
import dayjs from "dayjs";
import YoutubeFrame from "@/components/Shared/Podcast/YoutubeFrame";
import Box from "@mui/material/Box";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
    podcastSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, podcastSlug } = await params;
  const { podcast } = await getData({ locale, podcastSlug });

  return generatePageMetadata({
    title: podcast.title,
    description: stripText(podcast.description, true, 200),
    image: podcast.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/podcast/${podcastSlug}`,
    type: "article",
  });
}

export default async function PodcastDetail({ params }: Props) {
  const { locale, podcastSlug } = await params;

  const { podcast, latestPodcasts } = await getData({ locale, podcastSlug });
  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header
        staticStrings={staticStrings}
        bgImage={podcast.image}
        mobileBgImage={podcast.mobileImage}
      >
        <HeaderInfo title={podcast.title} />
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
              <Typography
                component="p"
                variant="body2"
                sx={{
                  mb: 2,
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              >
                {stripText(staticStrings.author || "Autore")}: {podcast.author} •{" "}
                {dayjs(podcast.createdAt.replace("Z", "")).format("DD/MM/YYYY HH:mm")}
              </Typography>

              {/* YouTube Video Player */}
              <Box sx={{ aspectRatio: 16 / 9, width: "100%", mb: 3 }}>
                <YoutubeFrame url={`https://www.youtube.com/embed/${podcast.youtubeLink}?autoplay=0&mute=0`} />
              </Box>

              {/* Podcast Description */}
              <CkEditorContent content={podcast.description} />
            </Grid>

            <Grid container size={{ xs: 12, lg: 4 }} spacing={{ xs: 5, lg: 1 }}>
              <Grid size={12}>
                <Typography
                  variant="h3"
                  fontWeight={config.fontWeightTitleDefault}
                  fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
                >
                  {stripText(staticStrings.relatedPodcastsSectionTitle || "Podcast Correlati")}
                </Typography>
              </Grid>
              <Grid container size={12} spacing={config.spacingMobile * config.spacingRowColumnRatio}>
                {latestPodcasts
                  .filter((p) => p.id !== podcast.id) // Exclude current podcast
                  .sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                  })
                  .slice(0, 5) // Limit to 5 related podcasts
                  .map((relatedPodcast, index) => (
                    <RelatedNew
                      slug={relatedPodcast.slug}
                      key={index}
                      image={relatedPodcast.image}
                      mobileImage={relatedPodcast.mobileImage}
                      locale={locale}
                      title={relatedPodcast.title}
                      url={`/${locale}/podcast/${relatedPodcast.slug}`}
                      description={relatedPodcast.shortDescription}
                      staticStrings={staticStrings}
                    />
                  ))}
              </Grid>
            </Grid>
          </Grid>

          <RegionalRestaurantSection staticStrings={staticStrings} />
          <RegionalNewsletter staticStrings={staticStrings} locale={locale} />
        </Grid>
      </MainContainer>
      <br />
    </>
  );
}
