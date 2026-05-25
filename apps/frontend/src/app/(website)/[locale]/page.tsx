import { Metadata } from "next";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import MainContainer from "@/components/Containers/MainContainer";
import MapWidget from "@/components/Shared/Widgets/MapWidget";
import HomepageMapEvents from "@/components/PageSrc/Homepage/HomepageMapEvents";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import config from "@/config";
import PageBackground from "@/components/UI/PageBackground";
import Stack from "@mui/material/Stack";
import HomepageDiscoverItem from "@/components/PageSrc/Homepage/HomepageDiscoverItem";
import HorizontalButton from "@/components/Shared/Regional/HorizontalButton";
import HomepageLocationEventWrapper from "@/components/PageSrc/Homepage/HomepageLocationEventArticleWrapper";
import Header from "@/components/UI/Header";
import getData from "@/data/homepage.data";
import getStaticStrings from "@/data/getStaticStrings.data";
import getInstagramUserProfile from "@/data/getInstagramUserProfile.data";
import AdsContainer from "@/components/Containers/AdsContainer";
import stripText from "@/utils/stripText";
import HomepageHeaderInfo from "@/components/PageSrc/Homepage/HomepageHeaderInfo";
import ImageContainer from "@/components/Containers/ImageContainer";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import AccomodationCardSectionWrapper from "@/components/Shared/Regional/AccomodationCardSectionWrapper";
import InstagramPostCarousel from "@/components/PageSrc/Homepage/InstagramPostCarousel";
import Footer from "@/components/UI/Footer";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generatePageMetadata({
    title: config.seo.APP_DEFAULT_TITLE,
    description: config.seo.APP_DESCRIPTION,
    image: "/statics/website/logo.png",
    url: `/${(await params).locale}`,
  });
}

export default async function HomepageIndex({ params }: Props) {
  const { locale } = await params;
  const staticStrings = await getStaticStrings(locale);

  const {
    latestPodcasts,
    defaultPodcast,
    mapPosts,
    homepageTopBoxOne,
    homepageTopBoxTwo,
    homepageTopBoxThree,
    homepageTopBoxFour,
    homepageTopBoxFive,
    homepageBottomBoxes,
    newsArticles,
    homepageHeaderImage,
  } = await getData(locale);

  // Fetch Instagram data
  const instagramData = await getInstagramUserProfile();

  return (
    <>
      <Header
        staticStrings={staticStrings}
        bgImage={homepageHeaderImage.src}
        mobileBgImage={homepageHeaderImage.mobileSrc}
        bgImageLink={homepageHeaderImage.link}
        homepage
      >
        <HomepageHeaderInfo staticStrings={staticStrings} locale={locale} />
      </Header>
      <MainContainer sx={{ py: { xs: config.spacingMobile, md: config.spacingDesktop } }}>
        {staticStrings.homepageWelcome && (
          <Box component="div" className="color-#000 m-0 p-0 py-4" dangerouslySetInnerHTML={{ __html: staticStrings.homepageWelcome }} />
        )}
      </MainContainer>
      <PageBackground>
        <MainContainer
          className="pb-8"
          sx={{ pt: { xs: config.spacingMobile * config.spacingRowColumnRatio, md: config.spacingDesktop * config.spacingRowColumnRatio } }}
        >
          <Grid
            container
            columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}
            rowSpacing={{ xs: config.spacingRowColumnRatio * config.spacingMobile, md: config.spacingRowColumnRatio * config.spacingDesktop }}
          >
            {/* MAP */}
            <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
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
                <MapWidget locale={locale} mapPosts={mapPosts} />
              </Grid>
              <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={{ xs: 12, lg: 6 }}>
                <HomepageMapEvents posts={mapPosts} locale={locale} staticStrings={staticStrings} />
              </Grid>
            </Grid>
            {/* AROUND YOU */}
            <HomepageLocationEventWrapper
              locale={locale}
              newsArticles={newsArticles}
              staticStrings={staticStrings}
              latestPodcasts={latestPodcasts}
              defaultPodcast={defaultPodcast}
            />
            {/* DISCOVER */}
            <Grid size={12} sx={{ textAlign: "center" }}>
              <AdsContainer sx={{ display: { xs: "none", lg: "block" } }}>
                <ImageContainer src="/banners/banner_01_-_1488x180px.webp" aspect_ratio="12.09%" alt="in-italy.it" />
              </AdsContainer>
              <AdsContainer sx={{ display: { xs: "block", lg: "none" }, maxWidth: "320px", margin: "0 auto" }}>
                <ImageContainer src="/banners/banner_mobile_01_-_320x320.webp" alt="in-italy.it" aspect_ratio="100%" />
              </AdsContainer>
            </Grid>
            <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
              <Grid size={12}>
                <Typography
                  variant="h3"
                  fontWeight={config.fontWeightTitleDefault}
                  fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
                >
                  {stripText(staticStrings.homepageTopCategoryTitle)}
                </Typography>
              </Grid>
              <Grid container spacing={{ xs: config.spacingMobile, lg: 0 }} size={12}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <HomepageDiscoverItem
                    borderRadiusMobileOnly
                    title={homepageTopBoxOne.name}
                    image={homepageTopBoxOne.image || "/statics/website/regions/header.jpg"}
                    url={homepageTopBoxOne.url}
                    height="600px"
                    mobileHeight="300px"
                  />
                </Grid>
                <Grid container spacing={{ xs: config.spacingMobile, lg: 0 }} size={{ xs: 12, lg: 3 }}>
                  <Grid size={12}>
                    <HomepageDiscoverItem
                      borderRadiusMobileOnly
                      title={homepageTopBoxTwo.name}
                      image={homepageTopBoxTwo.image || "/statics/website/regions/header.jpg"}
                      url={homepageTopBoxTwo.url}
                      height="300px"
                    />
                  </Grid>
                  <Grid size={12}>
                    <HomepageDiscoverItem
                      borderRadiusMobileOnly
                      title={homepageTopBoxThree.name}
                      image={homepageTopBoxThree.image || "/statics/website/regions/header.jpg"}
                      url={homepageTopBoxThree.url}
                      height="300px"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={{ xs: config.spacingMobile, lg: 0 }} size={{ xs: 12, lg: 3 }}>
                  <Grid size={12}>
                    <HomepageDiscoverItem
                      borderRadiusMobileOnly
                      title={homepageTopBoxFour.name}
                      image={homepageTopBoxFour.image || "/statics/website/regions/header.jpg"}
                      url={homepageTopBoxFour.url}
                      height="300px"
                    />
                  </Grid>
                  <Grid size={12}>
                    <HomepageDiscoverItem
                      borderRadiusMobileOnly
                      title={homepageTopBoxFive.name}
                      image={homepageTopBoxFive.image || "/statics/website/regions/header.jpg"}
                      url={homepageTopBoxFive.url}
                      height="300px"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12} sx={{ textAlign: "center" }}>
              <AdsContainer sx={{ display: { xs: "none", lg: "block" } }}>
                <ImageContainer src="/banners/banner_02_-_1488x180px.webp" aspect_ratio="12.09%" alt="in-italy.it" />
              </AdsContainer>
              <AdsContainer sx={{ display: { xs: "block", lg: "none" }, maxWidth: "320px", margin: "0 auto" }}>
                <ImageContainer src="/banners/banner_mobile_02_-_320x320.webp" alt="in-italy.it" aspect_ratio="100%" />
              </AdsContainer>
            </Grid>
            <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
              <AccomodationCardSectionWrapper locale={locale} staticStrings={staticStrings} />
            </Grid>
            {/* Categories */}
            <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
              <Grid size={12}>
                <Typography
                  variant="h3"
                  fontWeight={config.fontWeightTitleDefault}
                  fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
                >
                  {stripText(staticStrings.homepageBottomCategoriesTitle)}
                </Typography>
              </Grid>
              <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
                {homepageBottomBoxes.slice(0, 3).map((item, index) => (
                  <Grid size={{ xs: 12, lg: 4 }} key={index}>
                    <HomepageDiscoverItem
                      title={item.name}
                      image={item.image || "/statics/website/regions/header.jpg"}
                      url={item.url}
                      height="250px"
                    />
                  </Grid>
                ))}
                {homepageBottomBoxes.length > 3 && (
                  <Grid size={12}>
                    <Stack direction="row" spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} flexWrap="wrap" useFlexGap>
                      {homepageBottomBoxes.slice(3).map((item, index) => (
                        <HorizontalButton key={index} component={Link} href={item.url}>
                          {item.name}
                        </HorizontalButton>
                      ))}
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {/* Instagram Posts */}
            {instagramData && <InstagramPostCarousel locale={locale} instagramData={instagramData} staticStrings={staticStrings} />}
            <RegionalNewsletter staticStrings={staticStrings} locale={locale} />
          </Grid>
        </MainContainer>
      </PageBackground>
      <Footer locale={locale} staticStrings={staticStrings} />
    </>
  );
}
