import { FC } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Box from "@mui/material/Box";
import MainContainer from "../Containers/MainContainer";
import { staticStrings } from "@/types/staticStrings.type";
import stripText from "@/utils/stripText";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const LinkTargetBlank: FC<{ url: string; text: string }> = ({ url, text }) => (
  <MuiLink href={url} target="_blank" color="inherit">
    {text}
  </MuiLink>
);

const Footer: FC<{ locale: string; staticStrings: staticStrings }> = ({ locale, staticStrings }) => {
  const footerText1 = "Rivista online registrata al Tribunale di Napoli n. 43 del 23/03/2022";
  const footerText2 = "Direttore: Lorenzo Crea";
  const footerText3 = "Editore: Visio Adv di Alessandro Scarfiglieri";
  const footerText4 = "Insight italia srl (concessionario esclusivo)";
  const footerText5 = "Powered by";
  const footerText6 = "Engineered by Bee Web Srl";

  return (
    <Box sx={{ backgroundColor: "#231f20", color: "#fff", py: 8 }}>
      <MainContainer>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 4 }} sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography variant="body1" fontWeight={500}>
              {footerText1}
            </Typography>
            <br />
            <Typography variant="body1" fontWeight={500}>
              {footerText2}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {footerText3}
            </Typography>
            <br />
            <Typography variant="body1" fontWeight={500}>
              {footerText4}
            </Typography>
            <br />
            <Typography component="span" fontWeight={500}>
              {footerText5} <LinkTargetBlank url="https://www.ndbwebservice.com" text="NDB Web Service Srl" />
            </Typography>
            <br />
            <Typography component="span" fontWeight={500}>
              {footerText6}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 2.5 }}>
            <Stack direction="column" spacing={1} sx={{ justifyContent: "start" }}>
              <Link href={`/${locale}/chi-siamo`} underline="none" sx={{ color: "inherit", textDecoration: "none" }}>
                {stripText(staticStrings.footerAboutUs)}
              </Link>
              <Link href={`/${locale}/cosa-facciamo`} underline="none" sx={{ color: "inherit", textDecoration: "none" }}>
                {stripText(staticStrings.footerWhatWeDo)}
              </Link>
              <Link href={`/${locale}/diventa-explorer`} underline="none" sx={{ color: "inherit", textDecoration: "none" }}>
                {stripText(staticStrings.footerBecomeExplorer)}
              </Link>
              <Link href={`/${locale}/diventa-excellent-crafter`} underline="none" sx={{ color: "inherit", textDecoration: "none" }}>
                {stripText(staticStrings.footerBecomeAmbassador)}
              </Link>
              <Link href={`/${locale}/area-stampa`} sx={{ color: "inherit", display: "block", textDecoration: "none" }}>
                {stripText(staticStrings.footerPressArea)}
              </Link>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 2.5 }}>
            <Stack direction="column" spacing={1} sx={{ justifyContent: "start" }}>
              <Link href={`/${locale}/lavora-con-noi`} sx={{ color: "inherit", display: "block", textDecoration: "none" }}>
                {stripText(staticStrings.footerWorkWithUs)}
              </Link>
              <Link href={`/${locale}/newsletter`} sx={{ color: "inherit", display: "block", textDecoration: "none" }}>
                {stripText(staticStrings.footerNewsletter)}
              </Link>
              <Link href={`/${locale}/termini-di-utilizzo`} sx={{ color: "inherit", display: "block", textDecoration: "none" }}>
                {stripText(staticStrings.footerTermsOfUse)}
              </Link>
              <Link href={`/${locale}/privacy-policy`} sx={{ color: "inherit", display: "block", textDecoration: "none" }}>
                {stripText(staticStrings.footerPrivacyPolicy)}
              </Link>
              <Link href={`/${locale}/cookies`} sx={{ color: "inherit", display: "block", textDecoration: "none" }}>
                {stripText(staticStrings.footerCookiesConfiguration)}
              </Link>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Stack direction="column" spacing={4} sx={{ justifyContent: "space-between", height: "100%" }}>
              <Stack direction="row" spacing={1.5}>
                <Stack
                  component="a"
                  href="https://www.instagram.com/initaly.eu/"
                  target="_blank"
                  sx={{ textDecoration: "none", backgroundColor: "#fff", borderRadius: "50%", justifyContent: "center", alignItems: "center", p: 1 }}
                >
                  <InstagramIcon sx={{ fontSize: 30, color: "#000" }} />
                </Stack>
                <Stack
                  direction="row"
                  component="a"
                  href="https://www.facebook.com/initalyofficial"
                  target="_blank"
                  sx={{ textDecoration: "none", backgroundColor: "#fff", borderRadius: "50%", justifyContent: "center", alignItems: "center", p: 1 }}
                >
                  <FacebookIcon sx={{ fontSize: 30, color: "#000" }} />
                </Stack>
                <Stack
                  component="a"
                  href="https://www.youtube.com/@InItaly_IT"
                  target="_blank"
                  sx={{ textDecoration: "none", backgroundColor: "#fff", borderRadius: "50%", justifyContent: "center", alignItems: "center", p: 1 }}
                >
                  <YouTubeIcon sx={{ fontSize: 30, color: "#000" }} />
                </Stack>
                <Stack
                  component="a"
                  href="https://www.linkedin.com/company/in-italy/"
                  target="_blank"
                  sx={{ textDecoration: "none", backgroundColor: "#fff", borderRadius: "50%", justifyContent: "center", alignItems: "center", p: 1 }}
                >
                  <LinkedInIcon sx={{ fontSize: 30, color: "#000" }} />
                </Stack>
              </Stack>
              <Link href={`/${locale}`} underline="none" color="inherit">
                <img loading="lazy" src="/statics/website/logo-footer.svg" width="300" height="33" alt="in-italy.it" />
              </Link>
            </Stack>
          </Grid>
          <Grid size={12} sx={{ display: { xs: "block", lg: "none" } }}>
            <Typography variant="body1" fontWeight={500}>
              {footerText1}
            </Typography>
            <br />
            <Typography variant="body1" fontWeight={500}>
              {footerText2}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {footerText3}
            </Typography>
            <br />
            <Typography variant="body1" fontWeight={500}>
              {footerText4}
            </Typography>
            <br />
            <Typography component="span" fontWeight={500}>
              {footerText5} <LinkTargetBlank url="https://www.ndbwebservice.com" text="NDB Web Service Srl" />
            </Typography>
            <br />
            <Typography component="span" fontWeight={500}>
              {footerText6}
            </Typography>
          </Grid>
        </Grid>
      </MainContainer>
    </Box>
  );
};

export default Footer;
