import { FC } from "react";
import { staticStrings } from "@/types/staticStrings.type";
import MobileBottomNavigation from "./MobileBottomNavigation";

const MobileBottomNavigationWrapper: FC<{ staticStrings: staticStrings; locale: string }> = ({ staticStrings, locale }) => {
  return <MobileBottomNavigation staticStrings={staticStrings} locale={locale} />;
};

export default MobileBottomNavigationWrapper;
