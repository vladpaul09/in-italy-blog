"use client";

import { FC, ReactNode } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Container from "@mui/material/Container";

interface IProps {
  children?: ReactNode[] | ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  disableGutters?: boolean;
  fillHeight?: boolean;
}

const MainContainer: FC<IProps> = ({ children, className, sx, disableGutters, fillHeight }) => (
  <Container
    className={className}
    maxWidth="xl"
    fixed
    disableGutters={disableGutters}
    sx={[
      fillHeight && { flex: "1 1 auto" },
      (theme) => ({
        [theme.breakpoints.down("md")]: {
          maxWidth: "unset!important",
        },
      }),
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </Container>
);

export default MainContainer;
