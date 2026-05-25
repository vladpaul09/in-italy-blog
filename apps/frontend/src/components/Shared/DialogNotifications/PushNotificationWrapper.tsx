import { FC, lazy, Suspense } from "react";
import { staticStrings } from "@/types/staticStrings.type";

const PushNotificationDialog = lazy(() => import("@/components/Shared/DialogNotifications/PushNotificationDialog"));

interface Props {
  locale: string;
  staticStrings: staticStrings;
}

const PushNotificationWrapper: FC<Props> = ({ locale, staticStrings }) => (
  <Suspense fallback={null}>
    <PushNotificationDialog locale={locale} staticStrings={staticStrings} />
  </Suspense>
);

export default PushNotificationWrapper;
