import { FC } from "react";
import Box, { BoxProps } from "@mui/material/Box";

const AdsContainer: FC<BoxProps> = ({ children, ...props }) => <Box {...props}>{children}</Box>;

export default AdsContainer;
