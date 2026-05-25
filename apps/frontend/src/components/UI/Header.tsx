import { FC, ReactNode } from "react";
import Link from "next/link";
import { staticStrings } from "@/types/staticStrings.type";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import stripText from "@/utils/stripText";

interface Props {
  homepage?: boolean;
  staticStrings: staticStrings;
  children: ReactNode | Array<ReactNode>;
  bgImage?: string;
  bgImageLink?: string;
  mobileBgImage?: string;
}

const Header: FC<Props> = ({ staticStrings, children, bgImage, bgImageLink, homepage, mobileBgImage }) => {
  const bgImageUrl = bgImage || "/statics/website/regions/header.jpg";
  const mobileBgImageUrl = mobileBgImage || bgImageUrl;

  return (
    <Box
      sx={[
        homepage ? { height: { xs: "800px", md: "600px" } } : { height: "600px" },
        {
          // marginTop: { xs: "-75.5px", lg: "-62px" },
          backgroundImage: {
            xs: `url("${mobileBgImageUrl}")`,
            sm: `url("${bgImageUrl}")`,
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          position: "relative",
          zIndex: 1,
        },
      ]}
    >
      {bgImageLink && (
        <Typography
          component={Link}
          target="_blank"
          href={bgImageLink}
          variant="body1"
          sx={{ position: "absolute", top: 75, right: { xs: 20, sm: 30 }, color: "#fff" }}
        >
          {stripText(staticStrings.headerImageLinkText)}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default Header;
