import { ReactNode } from "react";
import getData from "@/data/languages.data";
import { locale } from "@/types/language.type";
import AppNavbar from "@/components/UI/AppNavbar";
import getStaticStrings from "@/data/getStaticStrings.data";
import UserWatchLocation from "@/components/Shared/Widgets/UserWatchLocation";
import PushNotificationWrapper from "@/components/Shared/DialogNotifications/PushNotificationWrapper";
import MobileBottomNavigationWrapper from "@/components/UI/MobileBottomNavigationWrapper";
import LocationNotification from "@/components/Shared/LocationNotification";
import GeolocationPermissionDialogWrapper from "@/components/Shared/DialogNotifications/GeolocationPermissionDialogWrapper";
import getHeaderMenus from "@/data/getHeaderMenus.data";
import config from "@/config";

interface IParams {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// export const dynamicParams = false;

export async function generateStaticParams() {
  const locales = await getData();

  return locales.map((locale: locale) => ({
    locale: locale.id,
  }));
}

export default async function RootLayout({ children, params }: IParams) {
  const { locale } = await params;
  const staticStrings = await getStaticStrings(locale);
  const locales = await getData();
  const headerMenus = await getHeaderMenus(locale);

  return (
    <>
      <AppNavbar currentLocale={locale} locales={locales} data={headerMenus} staticStrings={staticStrings} />
      {children}
      {config.isMobileApp && (
        <>
          <PushNotificationWrapper staticStrings={staticStrings} locale={locale} />
          <MobileBottomNavigationWrapper staticStrings={staticStrings} locale={locale} />
        </>
      )}
      <UserWatchLocation locale={locale} />
      <LocationNotification staticStrings={staticStrings} />
      <GeolocationPermissionDialogWrapper staticStrings={staticStrings} locale={locale} isMobileApp={config.isMobileApp} />
    </>
  );
}
