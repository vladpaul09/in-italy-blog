"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import config from "@/config";
import ImageContainer from "@/components/Containers/ImageContainer";

const AdBackdrop: FC<{ locale: string }> = ({ locale }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1, backgroundColor: "rgba(0, 0, 0, 0.8)" })} open={open}>
      <Typography
        variant="body1"
        fontSize={config.fontSizeDefaultText}
        sx={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1000, width: "200px" }}
      >
        Chiusura in {counter} secondi
      </Typography>
      <IconButton
        color="primary"
        aria-label="close"
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "white",
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box
        component={Link}
        href="/#"
        sx={{
          display: "block",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "561px",
          maxWidth: "991px",
        }}
      >
        <ImageContainer alt="ad-backdrop" src="/test.png" aspect_ratio="61.11%" />
      </Box>
    </Backdrop>
  );
};

export default AdBackdrop;
