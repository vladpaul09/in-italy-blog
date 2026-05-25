import { FC } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import config from "@/config";

const HomepageLocationEventsSkeleton: FC = () => {
  const array = new Array(6).fill(null);

  return (
    <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }} size={12}>
      {array.map((_item, index) => (
        <Grid container spacing={2} size={{ xs: 12, md: 6 }} key={index}>
          <>
            <Grid size={{ xs: 4, sm: 3, md: 4, lg: 3, xl: 2 }}>
              <Skeleton animation="wave" variant="rounded" width="100%" sx={{ height: { xs: "75px", md: "90px" } }} />
            </Grid>
            <Grid size={{ xs: 8, sm: 9, md: 8, lg: 9, xl: 10 }}>
              <Skeleton animation="wave" variant="text" width="100%" sx={{ fontSize: 16 }} />
              <Skeleton animation="wave" variant="text" width="30%" sx={{ fontSize: 16 }} />
            </Grid>
          </>
        </Grid>
      ))}
    </Grid>
  );
};

export default HomepageLocationEventsSkeleton;
