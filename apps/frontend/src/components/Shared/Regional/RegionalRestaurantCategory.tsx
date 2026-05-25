"use client";

import { FC } from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import config from "@/config";

const MuiImage = styled("img")(({ theme }) => ({
  width: "166px",
  height: "158px",
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  top: 30,
  [theme.breakpoints.down("xl")]: {
    width: "130px",
    height: "123px",
  },
  [theme.breakpoints.down("lg")]: {
    width: "166px",
    height: "158px",
  },
}));

const RegionalRestaurantCategory: FC<{ category: string; image: string }> = ({ category, image }) => {
  return (
    <Stack direction="column" alignItems="center" spacing={2} sx={{ width: { xl: "200px", lg: "165px", xs: "200px" } }}>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "primary.main",
          borderRadius: 999,
          width: { xl: "200px", lg: "165px", xs: "200px" },
          height: { xl: "200px", lg: "165px", xs: "200px" },
          margin: "auto",
        }}
      >
        <MuiImage src={image} alt={category} />
      </Box>
      <Typography fontWeight={config.fontWeightTitleDefault} variant="h6" textAlign="center" sx={{ fontSize: { xl: "20px", lg: "18px", xs: "20px" } }}>
        {category}
      </Typography>
    </Stack>
  );
};

export default RegionalRestaurantCategory;
