export interface InstagramMedia {
  id: string;
  caption: string | null;
  media_url: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  permalink: string;
  comments_count: number;
  like_count: number;
  view_count?: number;
}

export interface InstagramMediaData {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface InstagramUserProfile {
  id: string;
  name: string;
  username: string;
  profile_picture_url: string;
  media: InstagramMediaData;
}
