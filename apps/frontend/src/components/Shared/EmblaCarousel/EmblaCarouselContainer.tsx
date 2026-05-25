import { FC, ReactNode } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

interface Props {
  children: ReactNode;
  spacing: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  sx?: SxProps<Theme>;
}

const EmblaCarouselContainer: FC<Props> = ({ children, spacing, sx }) => (
  <Stack direction="row" spacing={spacing} className="embla__container" sx={[...(Array.isArray(sx) ? sx : [sx])]}>
    {children}
  </Stack>
);
export default EmblaCarouselContainer;
