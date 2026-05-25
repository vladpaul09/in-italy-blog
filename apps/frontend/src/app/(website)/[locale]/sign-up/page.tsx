import { Metadata } from "next";
import MainContainer from "@/components/Containers/MainContainer";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import getStaticStrings from "@/data/getStaticStrings.data";
import config from "@/config";
import stripText from "@/utils/stripText";
import SignUpProfileForm from "@/components/PageSrc/SignUp/SignUpProfileForm";
import getCategoriesArticles from "@/data/getCategoriesArticles.data";
import getCategoriesEvents from "@/data/getCategoriesEvents.data";
import getTags from "@/data/getTags.data";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const staticStrings = await getStaticStrings(locale);

  return generatePageMetadata({
    title: stripText(staticStrings.signupFormTitle),
    description: "Registrati su inItaly per personalizzare la tua esperienza di viaggio in Italia. Scopri destinazioni, eventi e articoli su misura per te.",
    image: "/statics/website/regions/header.jpg",
    url: `/${locale}/sign-up`,
  });
}

export default async function SignUpIndex({ params }: Props) {
  const { locale } = await params;

  const staticStrings = await getStaticStrings(locale);
  const categoriesArticles = await getCategoriesArticles(locale);
  const categoriesEvents = await getCategoriesEvents(locale);
  const tags = await getTags(locale);

  const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    municipality: undefined,
    gender: undefined,
    ageRange: undefined,
    familySituation: undefined,
    travelCompanion: undefined,
    travelFrequency: undefined,
    travelInterests: [],
    articleInterests: [],
    eventsInterests: [],
    averageStay: undefined,
    preferredTravelPeriod: undefined,
    averageBudget: undefined,
    privacyConsent: false,
  };


  return (
    <>
      <MainContainer
        fillHeight
        sx={{
          pt: {
            xs: config.spacingMobile * config.spacingRowColumnRatio,
            md: config.spacingDesktop * config.spacingRowColumnRatio,
          },
          my: "50px"
        }}
      >
        <Grid container size={12} spacing={2}>
          <Grid size={12} spacing={2}>
            <Typography variant="h1" fontSize={config.fontSizeMobileTitleSection} fontWeight={600} sx={{ textAlign: "center" }}>
              {stripText(staticStrings.signupFormTitle)}
            </Typography>
          </Grid>
          <SignUpProfileForm
            locale={locale}
            staticStrings={staticStrings}
            categoriesArticles={categoriesArticles}
            categoriesEvents={categoriesEvents}
            tags={tags}
            initialFormValues={initialFormValues}
          />
        </Grid>
      </MainContainer>
    </>
  );
}
