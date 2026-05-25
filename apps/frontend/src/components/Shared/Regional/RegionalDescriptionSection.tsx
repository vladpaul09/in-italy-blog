import { FC } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import config from "@/config";

interface Props {
  title?: string;
  description: string;
}

const RegionalDescriptionSection: FC<Props> = ({ title, description }) => (
  <Grid container size={12} spacing={2}>
    {title && (
      <Grid size={12}>
        <Typography
          variant="h3"
          fontWeight={config.fontWeightTitleDefault}
          fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
        >
          {title}
        </Typography>
      </Grid>
    )}
    <Grid size={12}>
      <Typography variant="h6" fontWeight={400} fontSize="16px" dangerouslySetInnerHTML={{ __html: description as string }} />
    </Grid>
  </Grid>
);

export default RegionalDescriptionSection;
