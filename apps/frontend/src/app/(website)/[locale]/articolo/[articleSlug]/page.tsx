import { Metadata } from "next";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import HotelCardSection from "@/components/Shared/Regional/AccomodationCardSection";
import getData from "@/data/getArticle.data";
import getStaticStrings from "@/data/getStaticStrings.data";
import Typography from "@mui/material/Typography";
import config from "@/config";
import RelatedNew from "@/components/Shared/Widgets/RelatedNew";
import stripText from "@/utils/stripText";
import CkEditorContent from "@/components/Shared/CkEditorContent";
import dayjs from "dayjs";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
    articleSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, articleSlug } = await params;
  const { article } = await getData({ locale, articleSlug });

  return generatePageMetadata({
    title: article.title,
    description: stripText(article.description, true, 200),
    image: article.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/articolo/${articleSlug}`,
    type: "article",
  });
}

export default async function ArticleIndex({ params }: Props) {
  const { locale, articleSlug } = await params;

  const { municipality, article, latestArticles } = await getData({ locale, articleSlug });
  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header staticStrings={staticStrings} bgImage={article.image} mobileBgImage={article.mobileImage}>
        <HeaderInfo title={article.title} />
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
                {stripText(staticStrings.author || "Autore")}: {article.author} • {dayjs(article.createdAt.replace('Z', '')).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <CkEditorContent
                content={article.description}
              />
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
