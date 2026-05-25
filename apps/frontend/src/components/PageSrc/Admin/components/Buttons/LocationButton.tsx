import { useState } from "react";
import { Button, useInput, useNotify } from "react-admin";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import CircularProgress from "@mui/material/CircularProgress";
import { userGetCurrentPosition } from "@/utils/userGetCurrentPosition";

const LocationButton = () => {
  const [loading, setLoading] = useState(false);

  const latitude = useInput({ source: "latitude" });
  const longitude = useInput({ source: "longitude" });

  const notify = useNotify();
  const handleLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      userGetCurrentPosition()
        .then((position) => {
          notify("Fetching current location...", { type: "info" });

          latitude.field.onChange(position.coords.latitude.toString());
          longitude.field.onChange(position.coords.longitude.toString());
          setLoading(false);
        })
        .catch((error) => {
          notify("Unable to retrieve your location. Try again in a few moments.", { type: "error" });
          console.error(error);
          setLoading(false);
        });
    } else {
      notify("Geolocation is disabled or not supported by this browser.", { type: "error" });
    }
  };

  return (
    <Button
      label="Current Location"
      variant="outlined"
      startIcon={!loading ? <GpsFixedIcon /> : <CircularProgress size={18} />}
      disabled={loading}
      onClick={handleLocation}
      sx={{ mb: 2, height: 40 }}
    />
  );
};

export default LocationButton;
