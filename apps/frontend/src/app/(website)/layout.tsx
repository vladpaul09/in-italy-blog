import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import Analytics from "@/components/ThirdParty/Analytics";
import AnalyticsNoScript from "@/components/ThirdParty/AnalyticsNoScript";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import SessionProviderWrapper from "@/components/Providers/SessionProviderWrapper";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import GlobalStyles from "@mui/material/GlobalStyles";
import theme from "@/theme";
import config from "@/config";
import "@/app/globals.css";
import "ckeditor5/ckeditor5-content.css";
import "leaflet/dist/leaflet.css";
import "dayjs/locale/it";

export const metadata: Metadata = {
  applicationName: config.seo.APP_NAME,
  title: {
    default: config.seo.APP_DEFAULT_TITLE,
    template: config.seo.APP_TITLE_TEMPLATE,
  },
  description: config.seo.APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: config.seo.APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: config.seo.APP_NAME,
    title: {
      default: config.seo.APP_DEFAULT_TITLE,
      template: config.seo.APP_TITLE_TEMPLATE,
    },
    description: config.seo.APP_DESCRIPTION,
    url: config.domain,
    images: [
      {
        url: `${config.domain}/statics/website/logo.png`,
        width: 1200,
        height: 630,
        alt: config.seo.APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: config.seo.APP_DEFAULT_TITLE,
      template: config.seo.APP_TITLE_TEMPLATE,
    },
    description: config.seo.APP_DESCRIPTION,
    images: [`${config.domain}/statics/website/logo.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <AnalyticsNoScript />
        <Analytics />
        {/* {!(process.env.NODE_ENV !== "production") && (
          <Script
            strategy="beforeInteractive"
            id="Cookiebot"
            src={`https://consent.cookiebot.com/uc.js?cbid=${config.COOKIEBOT_ID}&blockingmode=auto`}
          />
        )} */}
        <InitColorSchemeScript attribute="class" />
        <SessionProviderWrapper>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <GlobalStyles
                styles={{
                  ".global-border-radius": {
                    borderRadius: config.borderRadius,
                  },
                }}
              />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
