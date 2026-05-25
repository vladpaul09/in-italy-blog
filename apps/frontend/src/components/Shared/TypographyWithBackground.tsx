import { FC } from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";

const TypographyWithBackground: FC<TypographyProps> = (props) => {
  return <Typography {...props} sx={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.5)", ...props.sx }} />;
};

export default TypographyWithBackground;
