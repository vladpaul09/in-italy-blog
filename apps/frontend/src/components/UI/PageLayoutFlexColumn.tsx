import { FC, ReactNode } from "react";
import Stack from "@mui/material/Stack";

const PageLayoutFlexColumn: FC<{ children: ReactNode | Array<ReactNode> }> = ({ children }) => (
  <Stack direction="column" spacing={0} sx={{ minHeight: "100vh", m: 0, p: 0 }}>
    {children}
  </Stack>
);

export default PageLayoutFlexColumn;
