import { FC, ReactNode, forwardRef, Ref } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface Props {
  children: ReactNode;
  sx?: SxProps<Theme>;
  ref: Ref<HTMLDivElement | null>;
}

const EmblaCarouselWrapperViewport: FC<Props> = forwardRef(({ children, sx }, ref) => (
  <Box ref={ref} className="embla__viewport" sx={[{ overflow: "hidden", width: "100%" }, ...(Array.isArray(sx) ? sx : [sx])]}>
    {children}
  </Box>
));

export default EmblaCarouselWrapperViewport;
