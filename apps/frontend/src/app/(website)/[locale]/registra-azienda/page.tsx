import React from "react";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import getStaticStrings from "@/data/getStaticStrings.data";
import Typography from "@mui/material/Typography";
import config from "@/config";
import RelatedNew from "@/components/Shared/Widgets/RelatedNew";
import { getLatestStaticArticles } from "@/data/getStaticArticles";
import RegisterBusinessForm from "@/components/PageSrc/RegisterBusiness/RegisterBusinessForm";
import stripText from "@/utils/stripText";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function RegisterBusinessIndex({ params }: Props) {
  const { locale } = await params;

  const staticStrings = await getStaticStrings(locale);
  const articles = await getLatestStaticArticles(locale);

  return (
    <>
      <Header staticStrings={staticStrings}>
        <HeaderInfo title={stripText(staticStrings.registerBusinessTitle)} />
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
            <RegisterBusinessForm staticStrings={staticStrings} />
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
                {articles
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
          <RegionalNewsletter staticStrings={staticStrings} locale={locale}/>
        </Grid>
      </MainContainer>
      <br />
    </>
  );
}