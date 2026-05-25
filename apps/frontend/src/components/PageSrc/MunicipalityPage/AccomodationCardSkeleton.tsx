"use client";

import { FC } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

const AccomodationCardSkeleton: FC = () => {
  return (
    <Stack className="global-border-radius" direction="column" sx={{ backgroundColor: "#fff", height: "100%", overflow: "hidden" }}>
      <Box sx={{ width: "100%", height: "45%" }}>
        <Skeleton animation="wave" variant="rectangular" sx={{ height: "100%", bgcolor: '#000000aa' }} />
      </Box>
      <Stack direction="column" justifyContent={"space-between"} sx={{ height: "55%", pl: 2, pr: 2 }} alignItems={"flex-start"}>
        <Box sx ={{ width: "100%" }}>
          <br />
          <Skeleton animation="wave" variant="rounded" sx={{ width: "40%" }} />

          <Skeleton animation="wave" variant="rounded" sx={{ width: "70%", marginTop: '8px', height: '24px' }} />
        </Box>
        <Box sx ={{ width: "100%" }}>
          <Skeleton animation="wave" variant="rounded" sx={{ width: "40%" }} />
          <Box sx ={{ width: "100%" }}>
            <Skeleton animation="wave" variant="rounded" sx={{width: '60%', height: 32, marginTop: '10px'}} />
          </Box>
          <br />
          <Skeleton animation="wave" variant="rounded" sx={{width: '45%'}} />
          <br />
        </Box>
      </Stack>
    </Stack>
  );
};

export default AccomodationCardSkeleton;
