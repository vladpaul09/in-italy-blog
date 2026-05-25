import { defaultTheme, defaultDarkTheme } from "react-admin";
import { deepmerge } from "@mui/utils";

const sharedTheme = {
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
        fullWidth: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            border: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "18px",
          "&.MuiTableCell-sizeSmall": {
            padding: "13.5px",
          },
          "&.MuiTableCell-paddingNone": {
            padding: "4.5px",
          },
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          color: "inherit",
          "&:hover": {
            borderRadius: 5,
          },
          "&.RaMenuItemLink-active": {
            borderRadius: 10,
            backgroundColor: "#fff",
            color: "#344767",
            "&:before": {
              content: '""',
              position: "absolute",
              top: "0; right: 0; bottom: 0; left: 0",
              zIndex: "-1",
              margin: "-2px",
              borderRadius: 20,
            },
            "& .MuiSvgIcon-root": {
              fill: "#344767",
            },
          },
        },
      },
    },
  },
};

export const lightTheme = deepmerge(defaultTheme, {
  ...sharedTheme,
  colorSchemes: { light: true, dark: false },
  components: {
    ...sharedTheme.components,
  },
});

export const darkTheme = deepmerge(defaultDarkTheme, {
  ...sharedTheme,
  colorSchemes: { light: false, dark: true },
  components: {
    ...sharedTheme.components,
  },
});
