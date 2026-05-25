import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import config from "@/config";

interface Props {
  title: string;
  image: string;
  height: string | number;
  mobileHeight?: string | number;
  borderRadiusMobileOnly?: boolean;
  url: string;
}

const HomepageDiscoverItem: FC<Props> = ({ title, image, height, mobileHeight, borderRadiusMobileOnly, url }) => (
  <Stack
    component={Link}
    href={url}
    direction="column"
    sx={[
      {
        alignItems: "start",
        justifyContent: "end",
        width: "100%",
        textDecoration: "none",
        overflow: "hidden",
        py: 4,
        px: 2,
        position: "relative",
      },
      mobileHeight ? { height: { xs: mobileHeight, md: height } } : { height },
      borderRadiusMobileOnly ? { borderRadius: { xs: config.borderRadius, lg: 0 } } : { borderRadius: config.borderRadius },
    ]}
  >
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}
    >
      <Box
        component={Image}
        src={image}
        alt={title}
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
        sx={{ objectFit: "cover" }}
      />
    </Box>
    <Typography
      component="span"
      color="rgb(0, 0, 0)"
      bgcolor="rgba(255, 255, 255, 0.8)"
      fontWeight={config.fontWeightTitleDefault}
      fontSize={25}
      sx={{ p: 1, position: "relative", zIndex: 1 }}
    >
      {title}
    </Typography>
  </Stack>
);

export default HomepageDiscoverItem;
