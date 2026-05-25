"use client";

import { useState, useEffect, FC, SyntheticEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import config from "@/config";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { staticStrings } from "@/types/staticStrings.type";
import dialogSequenceEventBus from "@/rxjs/dialogSequence.eventbus";
import stripText from "@/utils/stripText";

const PushNotificationDialog: FC<{ locale: string; staticStrings: staticStrings }> = ({ locale, staticStrings }) => {
  const [{ isOpen, isSupported, isLoading, subscriptionSuccess, error }, setState] = useState<{
    isOpen: boolean;
    isSupported: boolean;
    isLoading: boolean;
    subscriptionSuccess: boolean;
    error: string | null;
  }>({
    isOpen: false,
    isSupported: true,
    isLoading: false,
    subscriptionSuccess: false,
    error: null,
  });

  useEffect(() => {
    if (!("serviceWorker" in navigator && "PushManager" in window)) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (!sub) {
          setState((prev) => ({ ...prev, isOpen: true }));
        } else {
          dialogSequenceEventBus.next({ isRenderGeolocationPermissionDialog: true });
        }
      });
    });
  }, [setState]);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    let regSw: ServiceWorkerRegistration;
    navigator.serviceWorker.ready
      .then((reg) => {
        regSw = reg;
        return regSw.pushManager.getSubscription();
      })
      .then((sub) => {
        if (sub === null) {
          return regSw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey),
          });
        }
        return sub;
      })
      .then((newSub) => {
        return fetch(`/api/${locale}/push-notifications/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            subscription: newSub,
            locale,
          }),
        });
      })
      .then((res) => {
        if (res.ok) {
          setState((prev) => ({ ...prev, isOpen: false, isLoading: false, subscriptionSuccess: true }));
          dialogSequenceEventBus.next({ isRenderGeolocationPermissionDialog: true });
        } else {
          throw new Error(`Subscription failed with status: ${res.status}`);
        }
        return;
      })
      .catch((err) => {
        console.log(err);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: stripText(staticStrings.pushNotificationErrorMessage, false) || "Failed to subscribe to push notifications. Please try again.",
        }));
      });
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, isOpen: false, error: null }));
    dialogSequenceEventBus.next({ isRenderGeolocationPermissionDialog: true });
  };

  const handleSnackbarClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setState((prev) => ({ ...prev, subscriptionSuccess: false }));
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="push-notification-dialog-title"
        aria-describedby="push-notification-dialog-description"
        disableScrollLock
      >
        <DialogTitle id="push-notification-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
          <NotificationsIcon color="primary" />
          <Typography component="span">{stripText(staticStrings.pushNotificationDialogTitle, false) || "Push Notifications"}</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 4,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContentText id="push-notification-dialog-description">
            {stripText(staticStrings.pushNotificationDialogDescription, false) ||
              "Stay updated with the latest news and events by enabling push notifications. You can unsubscribe at any time from your browser settings."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: { xs: "none", sm: "flex" } }}>
          <Button onClick={handleClose} variant="text" color="inherit" disabled={isLoading}>
            {stripText(staticStrings.notificationNotNowButton, false) || "Not Now"}
          </Button>
          <Button
            onClick={subscribeToPush}
            variant="contained"
            color="primary"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <NotificationsIcon />}
            disabled={isLoading}
          >
            {isLoading
              ? stripText(staticStrings.pushNotificationSubscribingButton, false) || "Subscribing..."
              : stripText(staticStrings.pushNotificationSubscribeButton, false) || "Subscribe"}
          </Button>
        </DialogActions>
        <DialogActions disableSpacing sx={{ px: 3, pb: 2, display: { xs: "flex", sm: "none", flexDirection: "column" } }}>
          <Button
            onClick={subscribeToPush}
            variant="contained"
            color="primary"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <NotificationsIcon />}
            disabled={isLoading}
            fullWidth
            sx={{ mb: 1 }}
          >
            {isLoading
              ? stripText(staticStrings.pushNotificationSubscribingButton, false) || "Subscribing..."
              : stripText(staticStrings.pushNotificationSubscribeButton, false) || "Subscribe"}
          </Button>
          <Button onClick={handleClose} variant="text" color="inherit" fullWidth disabled={isLoading}>
            {stripText(staticStrings.notificationNotNowButton, false) || "Not Now"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={subscriptionSuccess}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          {stripText(staticStrings.pushNotificationSuccessMessage, false) || "Successfully subscribed to notifications!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PushNotificationDialog;
