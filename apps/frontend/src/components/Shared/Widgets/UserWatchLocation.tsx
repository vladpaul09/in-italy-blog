"use client";

import { FC, useState, useEffect } from "react";
import userLocationCoordinatesEventBus from "@/rxjs/userLocationCoordinates.eventbus";

const UserWatchLocation: FC<{ locale: string }> = ({ locale }) => {
  const [isGranted, setIsGranted] = useState(false);

  useEffect(() => {
    const subscription = userLocationCoordinatesEventBus.subscribe(({ isGranted }) => {
      if (isGranted !== null && isGranted !== undefined) {
        setIsGranted(isGranted);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator) || !isGranted) return;
    if (!("serviceWorker" in navigator && "PushManager" in window)) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!("serviceWorker" in navigator && "PushManager" in window)) return;
        navigator.serviceWorker.ready
          .then((reg) => reg.pushManager.getSubscription())
          .then((sub) => {
            if (sub !== null) {
              fetch(`/api/${locale}/push-notifications/send-coordinates`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  subscription: sub,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  locale,
                }),
              });
            }
          });
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isGranted]);

  return null;
};

export default UserWatchLocation;
