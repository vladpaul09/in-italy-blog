import { FC, ReactNode, forwardRef, Ref } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

interface Props {
  children: ReactNode;
  sx?: SxProps<Theme>;
  ref?: Ref<HTMLDivElement | null>;
}

const EmblaCarouselWrapper: FC<Props> = forwardRef(({ children, sx }, ref) => (
  <Stack
    direction="row"
    className="embla"
    ref={ref}
    sx={[{ position: "relative", width: "100%", justifyContent: "center" }, ...(Array.isArray(sx) ? sx : [sx])]}
  >
    {children}
  </Stack>
));

export default EmblaCarouselWrapper;
