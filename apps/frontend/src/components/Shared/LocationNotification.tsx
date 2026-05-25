"use client";

import { useState, useEffect, FC } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import { staticStrings } from "@/types/staticStrings.type";
import stripText from "@/utils/stripText";
import userLocationCoordinatesEventBus from "@/rxjs/userLocationCoordinates.eventbus";

interface Props {
  staticStrings: staticStrings;
}

const LocationNotification: FC<Props> = ({ staticStrings }) => {
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const subscription = userLocationCoordinatesEventBus.subscribe((coords) => {
      if (coords.isGranted !== null && coords.isGranted !== undefined) {
        setShowNotification(!coords.isGranted);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Snackbar open={showNotification} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert severity="warning" icon={<LocationOffIcon />} onClose={() => setShowNotification(false)} sx={{ maxWidth: { xs: "auto", sm: "360px" } }}>
        {stripText(staticStrings.locationNotificationText, false)}
      </Alert>
    </Snackbar>
  );
};

export default LocationNotification;
