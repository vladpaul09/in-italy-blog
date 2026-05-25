import { FC, ReactNode } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface Props {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const EmblaCarouselSlider: FC<Props> = ({ children, sx }) => (
  <Box
    className="embla__slider"
    sx={[
      {
        minWidth: "0",
        transform: "translate3d(0, 0, 0)",
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </Box>
);

export default EmblaCarouselSlider;
