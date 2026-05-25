import { FC } from "react";
import Stack from "@mui/material/Stack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
import { SxProps, Theme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

const ListNavButton = styled(IconButton)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.87)",
  fontWeight: 400,
  textTransform: "none",
  width: "40px",
  height: "40px",
  transition: "opacity 0.1s ease-in-out",
}));

interface Props {
  animationPrev: () => void;
  animationNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  sx?: SxProps<Theme>;
}

const CardListNavButtons: FC<Props> = ({ animationNext, animationPrev, canScrollPrev, canScrollNext, sx }) => (
  <Stack direction="row" sx={[{ mt: 1, mb: 1, justifyContent: "center", display: { xs: "none", lg: "flex" } }, ...(Array.isArray(sx) ? sx : [sx])]}>
    <ListNavButton onClick={animationPrev} disableRipple disabled={!canScrollPrev}>
      <ArrowBackIosIcon />
    </ListNavButton>
    <ListNavButton onClick={animationNext} disableRipple disabled={!canScrollNext}>
      <ArrowForwardIosIcon />
    </ListNavButton>
  </Stack>
);

export default CardListNavButtons;
