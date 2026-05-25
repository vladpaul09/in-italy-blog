import { FC, ReactNode } from "react";
import Stack from "@mui/material/Stack";

const HorizontalButtons: FC<{ children: ReactNode | Array<ReactNode> }> = ({ children }) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        overflow: "auto",
        scrollbarWidth: "none",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {children}
    </Stack>
  );
};

export default HorizontalButtons;
