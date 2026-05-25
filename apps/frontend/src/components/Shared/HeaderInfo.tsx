import { FC, ReactNode } from "react";
import MainContainer from "@/components/Containers/MainContainer";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import config from "@/config";

interface Props {
  title: string;
  subtitle?: string;
  children?: ReactNode | Array<ReactNode>;
}

const HeaderInfo: FC<Props> = ({ title, subtitle, children }) => (
  <MainContainer sx={{ height: "inherit" }}>
    <Grid container spacing={2} direction="column-reverse" sx={{ height: "inherit", paddingBottom: 5 }}>
      <Grid size={12}>
        <Typography
          variant="h1"
          color="#fff"
          fontWeight={config.fontWeightTitleDefault}
          fontSize={{ xs: config.fontSizeMobileTitleSection, md: config.fontSizeDesktopTitleSection }}
          sx={{ py: 1, width: "fit-content" }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="h6" color="#fff">
          {subtitle}
        </Typography>
      </Grid>
      {children}
    </Grid>
  </MainContainer>
);

export default HeaderInfo;
