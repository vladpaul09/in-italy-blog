"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const SearchButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  height: "40px",
  backgroundColor: "primary.main",
  textTransform: "uppercase",
  color: "#000",
}));

export default SearchButton;