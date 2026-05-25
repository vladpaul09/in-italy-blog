"use client";

import { useState, useEffect, useCallback, FC, SyntheticEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { userGetCurrentPosition } from "@/utils/userGetCurrentPosition";
import userLocationCoordinatesEventBus from "@/rxjs/userLocationCoordinates.eventbus";
import { staticStrings } from "@/types/staticStrings.type";
import dialogSequenceEventBus from "@/rxjs/dialogSequence.eventbus";
import stripText from "@/utils/stripText";
import { storeLocationData, getStoredLocationData, clearStoredLocationData } from "@/utils/locationStorage.util";

interface GeolocationPermissionDialogProps {
  locale: string;
  staticStrings: staticStrings;
  isMobileApp: boolean;
}


const GeolocationPermissionDialog: FC<GeolocationPermissionDialogProps> = ({ locale, staticStrings, isMobileApp }) => {
  const [{ allowRender, isOpen, isSupported, error, isLoading, snackbarOpen }, setState] = useState<{
    allowRender: boolean;
    isOpen: boolean;
    isSupported: boolean;
    error: string | null;
    isLoading: boolean;
    snackbarOpen: boolean;
    isPermissionGranted: boolean;
  }>({
    allowRender: !isMobileApp,
    isOpen: false,
    isSupported: true,
    error: null as string | null,
    isLoading: false,
    snackbarOpen: false,
    isPermissionGranted: false,
  });


  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }
    if (allowRender) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          const checkPermissionState = () => {
            const storedLocationData = getStoredLocationData();
            if (permissionStatus.state === "granted") {
              // Permission is granted, get fresh location directly
              userGetCurrentPosition()
                .then((position) => {
                  storeLocationData(position.coords.latitude, position.coords.longitude);
                  userLocationCoordinatesEventBus.next({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    isGranted: true,
                  });
                })
                .catch(() => {
                  clearStoredLocationData();
                  userLocationCoordinatesEventBus.next({ latitude: null, longitude: null, isGranted: false });
                  setState((prev) => ({ ...prev, isLoading: false, error: "Error getting location" }));
                });
            }
            if (permissionStatus.state === "prompt") {
              if (storedLocationData) {
                // Permission is prompt but we have stored data, use it
                userLocationCoordinatesEventBus.next({
                  latitude: storedLocationData.latitude,
                  longitude: storedLocationData.longitude,
                  isGranted: null,
                });
              } else {
                // No stored data, show permission dialog
                setState((prev) => ({ ...prev, isOpen: !prev.isPermissionGranted }));
              }
            }
            if (permissionStatus.state === "denied") {
              clearStoredLocationData();
            }
          };
          permissionStatus.onchange = () => {
            checkPermissionState();
          };
          checkPermissionState();
        })
        .catch((error) => {
          console.error("Error checking geolocation permission:", error);
          clearStoredLocationData();
        });
    }
   }, [allowRender]);

  useEffect(() => {
    const subscription = dialogSequenceEventBus.subscribe(({ isRenderGeolocationPermissionDialog }) => {
      setState((prev) => ({ ...prev, allowRender: isRenderGeolocationPermissionDialog }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAllow = () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    userGetCurrentPosition()
      .then((position) => {
        storeLocationData(position.coords.latitude, position.coords.longitude);
        userLocationCoordinatesEventBus.next({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isGranted: true,
        });
        setState((prev) => ({
          ...prev,
          isOpen: false,
          isLoading: false,
          snackbarOpen: true,
          isPermissionGranted: true,
        }));
      })
      .catch(() => {
        clearStoredLocationData();
        userLocationCoordinatesEventBus.next({ latitude: null, longitude: null, isGranted: false });
        setState((prev) => ({ ...prev, isLoading: false, error: "Error getting location", isPermissionGranted: false }));
      });
  };

  const handleDeny = () => {
    clearStoredLocationData();
    setState((prev) => ({ ...prev, isOpen: false, isPermissionGranted: false }));
    userLocationCoordinatesEventBus.next({ latitude: null, longitude: null, isGranted: false });
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSnackbarClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setState((prev) => ({ ...prev, snackbarOpen: false }));
  };

  if (!isSupported || !allowRender) {
    return null;
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="geolocation-dialog-title"
        aria-describedby="geolocation-dialog-description"
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        <DialogTitle id="geolocation-dialog-title" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnIcon color="primary" />
            <Typography variant="subtitle1">{stripText(staticStrings.geolocationNotificationDialogTitle, false) || "Location Access"}</Typography>
          </Stack>
          <IconButton aria-label="close" onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent id="geolocation-dialog-description">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" sx={{ mb: 2 }}>
            {stripText(staticStrings.geolocationNotificationDialogMessage, false) ||
              "We'd like to show you content relevant to your location. This helps us provide personalized recommendations and local information."}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {stripText(staticStrings.geolocationNotificationDialogPrivacyText, false) ||
              "Your location data is only used to enhance your browsing experience and is not stored or shared with third parties."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, display: { xs: "none", sm: "flex" } }}>
          <Button onClick={handleDeny} variant="text" color="inherit" disabled={isLoading}>
            {stripText(staticStrings.notificationNotNowButton, false) || "Not Now"}
          </Button>
          <Button
            onClick={handleAllow}
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LocationOnIcon />}
          >
            {isLoading
              ? stripText(staticStrings.geolocationNotificationDialogLoadingButton, false) || "Getting Location..."
              : stripText(staticStrings.geolocationNotificationDialogAllowButton, false) || "Allow Location"}
          </Button>
        </DialogActions>
        <DialogActions disableSpacing sx={{ p: 2, display: { xs: "flex", sm: "none", flexDirection: "column" } }}>
          <Button
            onClick={handleAllow}
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LocationOnIcon />}
            fullWidth
            sx={{ mb: 1 }}
          >
            {isLoading
              ? stripText(staticStrings.geolocationNotificationDialogLoadingButton, false) || "Getting Location..."
              : stripText(staticStrings.geolocationNotificationDialogAllowButton, false) || "Allow Location"}
          </Button>
          <Button onClick={handleDeny} variant="text" color="inherit" fullWidth disabled={isLoading}>
            {stripText(staticStrings.notificationNotNowButton, false) || "Not Now"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "left" }}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }} variant="filled">
          {stripText(staticStrings.geolocationNotificationSuccessMessage, false) || "Location access granted successfully!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GeolocationPermissionDialog;
