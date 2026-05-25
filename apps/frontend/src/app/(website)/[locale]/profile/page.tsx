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
import { redirect } from "next/navigation";
import fetchTextDebug from "@/utils/fetchTextDebug";
import { generatePageMetadata } from "@/utils/generateMetadata.util";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const staticStrings = await getStaticStrings(locale);

  return generatePageMetadata({
    title: stripText(staticStrings.profileFormTitle),
    description:
      "Gestisci il tuo profilo su inItaly. Personalizza le tue preferenze di viaggio per ricevere contenuti e suggerimenti su misura per la tua esperienza in Italia.",
    image: "/statics/website/regions/header.jpg",
    url: `/${locale}/profile`,
  });
}

export default async function ProfileIndex({ params }: Props) {
  const { locale } = await params;

  // Get NextAuth session to verify authentication and get user ID
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session || !session.user?.id) {
    redirect(`/${locale}/login`);
  }

  const staticStrings = await getStaticStrings(locale);
  const categoriesArticles = await getCategoriesArticles(locale);
  const categoriesEvents = await getCategoriesEvents(locale);
  const tags = await getTags(locale);

  // Fetch user profile data
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/me/profile/${session.user.id}`;
  const profileResponse = await fetch(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "GET",
    next: { revalidate: 0 },
  });
  if (profileResponse.ok) {
    const profileData = await profileResponse.json();
    const initialFormValues = {
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      email: profileData.email || "",
      password: "",
      confirmPassword: "",
      phone: profileData.phone || "",
      country: profileData.country || "",
      municipality: profileData.municipality
        ? { id: profileData.municipality.id, name: profileData.municipality.name, url: profileData.municipality.slug }
        : undefined,
      gender: profileData.gender || undefined,
      ageRange: profileData.ageRange || undefined,
      familySituation: profileData.familySituation || undefined,
      travelCompanion: profileData.travelCompanion || undefined,
      travelFrequency: profileData.travelFrequency || undefined,
      travelInterests: profileData.travelInterests || [],
      articleInterests: profileData.articleInterests || [],
      eventsInterests: profileData.eventsInterests || [],
      averageStay: profileData.averageStay || undefined,
      preferredTravelPeriod: profileData.preferredTravelPeriod || undefined,
      averageBudget: profileData.averageBudget || undefined,
      privacyConsent: profileData.privacyConsent || false,
    };

    return (
      <>
        <MainContainer
          fillHeight
          sx={{
            pt: {
              marginTop: "50px",
              xs: config.spacingMobile * config.spacingRowColumnRatio,
              md: config.spacingDesktop * config.spacingRowColumnRatio,
            },
          }}
        >
          <Grid container size={12} spacing={2}>
            <Grid size={12} spacing={2}>
              <Typography variant="h1" fontSize={config.fontSizeMobileTitleSection} fontWeight={600} sx={{ textAlign: "center" }}>
                {stripText(staticStrings.profileFormTitle)}
              </Typography>
            </Grid>
            <SignUpProfileForm
              locale={locale}
              staticStrings={staticStrings}
              categoriesArticles={categoriesArticles}
              categoriesEvents={categoriesEvents}
              tags={tags}
              initialFormValues={initialFormValues}
              userId={session.user.id}
              isProfilePage={true}
            />
          </Grid>
        </MainContainer>
        <br />
      </>
    );
  }

  console.log(fetchTextDebug(apiUrl, profileResponse.status, profileResponse.statusText));
  redirect(`/${locale}/login`);
}
