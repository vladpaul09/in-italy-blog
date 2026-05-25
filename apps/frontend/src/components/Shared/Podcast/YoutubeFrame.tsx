"use client"
import { FC, ReactNode } from "react";
import { styled } from "@mui/material/styles";

const YTFrame = styled("iframe")(({ theme }) => ({
  width: "100%",
  height: "100%",
  border: "none",
  borderRadius: 4,
  overflow: "hidden",
}));

interface Props {
  url: string;
}

const YoutubeFrame: FC<Props> = ({url}) => {
  return (
    <YTFrame
      src={url}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}

export default YoutubeFrame;