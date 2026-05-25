"use client";

import { FC, useState, useEffect, lazy, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import MapIcon from "@mui/icons-material/Map";
import Paper from "@mui/material/Paper";
import { staticStrings } from "@/types/staticStrings.type";
import { userGetCurrentPosition } from "@/utils/userGetCurrentPosition";

const MobilePlanYouTripDialog = lazy(() => import("@/components/Shared/Dialogs/MobilePlanYouTripDialog"));
const MobileAroundYouDialog = lazy(() => import("@/components/Shared/Dialogs/MobileAroundYouDialog"));

const MobileBottomNavigation: FC<{ staticStrings: staticStrings; locale: string }> = ({ staticStrings, locale }) => {
  const { status } = useSession();

  const [openPlanYouTripDialog, setOpenPlanYouTripDialog] = useState<boolean>(false);
  const [aroundYouDialogState, setAroundYouDialogState] = useState<{ openAroundYouDialog: boolean; coords: [number, number] | null }>({
    openAroundYouDialog: false,
    coords: null,
  });

  const { openAroundYouDialog, coords } = aroundYouDialogState;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setOpenPlanYouTripDialog(false);
    setAroundYouDialogState((prev) => ({ ...prev, openAroundYouDialog: false, coords: null }));
  }, [pathname]);

  return (
    <Paper
      sx={(theme) => ({ position: "fixed", bottom: 0, left: 0, right: 0, display: { xs: "block", md: "none" }, zIndex: theme.zIndex.appBar })}
      elevation={4}
    >
      <BottomNavigation
        showLabels
        onChange={(_event, newValue) => {
          switch (newValue) {
            case "planing":
              setOpenPlanYouTripDialog(true);
              break;
            case "aroundYou":
              try {
                userGetCurrentPosition().then((position) => {
                  setAroundYouDialogState({ openAroundYouDialog: true, coords: [position.coords.latitude, position.coords.longitude] });
                });
              } catch (error) {
                console.log("Error getting current position:", error);
              }
              break;
            case "map":
              console.log("map");
              break;
            case "profile":
              router.push(status === "authenticated" ? `/${locale}/profile` : `/${locale}/login`);
              break;
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction value="planing" icon={<CalendarMonthIcon />} />
        <BottomNavigationAction value="aroundYou" icon={<LocationOnIcon />} />
        <BottomNavigationAction value="map" icon={<MapIcon />} />
        <BottomNavigationAction value="profile" icon={<PersonIcon />} />
      </BottomNavigation>
      <Suspense fallback={null}>
        <MobilePlanYouTripDialog open={openPlanYouTripDialog} setOpen={setOpenPlanYouTripDialog} locale={locale} staticStrings={staticStrings} />
      </Suspense>
      <Suspense fallback={null}>
        <MobileAroundYouDialog
          open={openAroundYouDialog}
          setOpen={setAroundYouDialogState}
          locale={locale}
          staticStrings={staticStrings}
          coords={coords}
        />
      </Suspense>
    </Paper>
  );
};

export default MobileBottomNavigation;
