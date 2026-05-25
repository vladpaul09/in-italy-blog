import { FC, lazy, Suspense } from "react";
import { staticStrings } from "@/types/staticStrings.type";

interface GeolocationPermissionDialogWrapperProps {
  locale: string;
  staticStrings: staticStrings;
  isMobileApp: boolean;
}

const GeolocationPermissionDialog = lazy(() => import("./GeolocationPermissionDialog"));

const GeolocationPermissionDialogWrapper: FC<GeolocationPermissionDialogWrapperProps> = ({ locale, staticStrings, isMobileApp }) => (
  <Suspense fallback={null}>
    <GeolocationPermissionDialog locale={locale} staticStrings={staticStrings} isMobileApp={isMobileApp} />
  </Suspense>
);

export default GeolocationPermissionDialogWrapper;
