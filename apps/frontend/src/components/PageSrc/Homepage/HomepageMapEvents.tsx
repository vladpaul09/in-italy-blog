"use client";

import { FC, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { mapPosts } from "@/types/mapPostData.type";
import homepageMapEventsEventBus from "@/rxjs/homepageMapEvents.eventbus";
import { staticStrings } from "@/types/staticStrings.type";
import RegionalActivityPost from "@/components/Shared/Regional/RegionalActivityPost";

interface Props {
  posts: Array<mapPosts>;
  locale: string;
  staticStrings: staticStrings;
}

const HomepageMapEvents: FC<Props> = ({ posts, locale, staticStrings }) => {
  const [postsState, setPostsState] = useState<Array<mapPosts>>([]);

  useEffect(() => {
    const subscription = homepageMapEventsEventBus.subscribe((dataBusPosts) => {
      setPostsState(dataBusPosts ? dataBusPosts : posts);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setPostsState, posts]);

  return (
    <>
      {(postsState.length > 0 ? postsState : posts).slice(0, 3).map((post, index) => (
        <Grid key={index} size={12}>
          <RegionalActivityPost
            title={post.title}
            image={post.image}
            mobileImage={post.mobileImage}
            url={post.url}
            description={post.description}
            startDate={post.startDate}
            endDate={post.endDate}
            staticStrings={staticStrings}
            locale={locale}
          />
        </Grid>
      ))}
    </>
  );
};

export default HomepageMapEvents;
