import { InstagramUserProfile } from "@/types/instagram.type";
import fetchTextDebug from "@/utils/fetchTextDebug";
import config from "@/config";

export default async function getInstagramUserProfile(): Promise<InstagramUserProfile | undefined> {
  const fields = "name,username,profile_picture_url,media{id,caption,media_url,media_type,permalink,comments_count,like_count,view_count}";
  const apiUrl = `https://graph.instagram.com/v23.0/${config.instagram.userId}?fields=${fields}&access_token=${config.instagram.accessToken}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: config.fetchRevalidate },
  });

  if (!res.ok) {
    console.log(fetchTextDebug(apiUrl, res.status, res.statusText));
    return undefined;
  }

  return res.json();
}
