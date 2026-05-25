"use client";

import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const HeaderTextField = styled(TextField)(({ theme }) => ({
  borderRadius: 8,
  color: "#000",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none !important",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#000",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#000",
    fontWeight: 500,
    opacity: 1,
  },
}));

export default HeaderTextField;
