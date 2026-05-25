import { FC } from "react";
import Typography from "@mui/material/Typography";
import config from "@/config";

interface Props {
  text: string;
}

const HeaderTitle: FC<Props> = ({ text }) => (
  <Typography fontWeight={500} color="#888" fontSize={config.fontSizeDefaultText} variant="caption">
    {text}
  </Typography>
);

export default HeaderTitle;
