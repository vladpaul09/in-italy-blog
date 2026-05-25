import { FC } from "react";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";

interface Props {
  progress: number;
}

const CardListProgress: FC<Props> = ({ progress }) => (
  <LinearProgress
    variant="determinate"
    value={progress}
    color="primary"
    sx={{
      height: "8px",
      marginTop: 1,
      // borderRadius: "8px",
      display: { lg: "none", xs: "block" },
      [`& .${linearProgressClasses.bar}`]: { transition: "0.1s" },
    }}
  />
);

export default CardListProgress;
