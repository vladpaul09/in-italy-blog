"use client"
import { FC } from "react";
import HorizontalButtons from "./HorizontalButtons";
import Skeleton from "@mui/material/Skeleton";

const HorizontalButtonsSkeleton: FC = () => (
  <HorizontalButtons>
    {Array(4)
      .fill(0)
      .map((_item, index) => (
        <Skeleton
          key={index}
          className="global-border-radius"
          animation="wave"
          variant="rounded"
          width={115}
          height={48.5}
        />
      ))}
  </HorizontalButtons>
);

export default HorizontalButtonsSkeleton;
