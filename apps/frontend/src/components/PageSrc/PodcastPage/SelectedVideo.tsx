"use client"
import { FC } from "react";
import Box from "@mui/material/Box";
import { category } from "@/types/category.type";
import { useSearchParams } from "next/navigation";
import YoutubeFrame from "@/components/Shared/Podcast/YoutubeFrame";

interface Props {
  categories: Array<category>;
}

const SelectedVideo: FC<Props> = ({categories}) => {
  const searchParams = useSearchParams()
 
  const slug = searchParams.get('video');
  const ytId = categories
    .flatMap((category) => category.podcasts || [])
    .find((podcast) => podcast.slug === slug)?.youtubeLink;
  

  return ytId && (
    <Box  sx={{aspectRatio: 16 / 9, width:'100%', height: '100%'}}>
      <YoutubeFrame
        url={`https://www.youtube.com/embed/${ytId}/autoplay?autoplay=1`}
       />
    </Box>
  )
}

export default SelectedVideo;