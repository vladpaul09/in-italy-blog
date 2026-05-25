import { FC, ReactNode } from "react";
import Box from "@mui/material/Box";

interface Props {
  children: ReactNode | Array<ReactNode>;
}

const PageBackground: FC<Props> = ({ children }) => <Box component="div" sx={{ backgroundColor: "#e6e7e9" }}>{children}</Box>;

export default PageBackground;
