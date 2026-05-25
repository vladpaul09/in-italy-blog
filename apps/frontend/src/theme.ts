"use client";

import { createTheme } from "@mui/material/styles";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  colorSchemes: { light: true, dark: false },
  palette: {
    primary: {
      main: "rgb(255, 181, 35)",
      light: "#eacd8a",
    },
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  typography: {
    fontFamily: montserrat.style.fontFamily,
    body1: {
      lineHeight: 1.3,
    },
    body2: {
      lineHeight: 1.3,
    },
    h1: {
      lineHeight: 1.3,
    },
    h2: {
      lineHeight: 1.3,
    },
    h3: {
      lineHeight: 1.3,
    },
    h4: {
      lineHeight: 1.3,
    },
    h5: {
      lineHeight: 1.3,
    },
    h6: {
      lineHeight: 1.3,
    },
    subtitle1: {
      lineHeight: 1.3,
    },
    subtitle2: {
      lineHeight: 1.3,
    },
    caption: {
      lineHeight: 1.3,
    },
    overline: {
      lineHeight: 1.3,
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: "info" },
              style: {
                backgroundColor: "#60a5fa",
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;
