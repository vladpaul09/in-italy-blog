import config from "@/config";
import { TripAdvisorPhotoResponse } from "@/types/tripAdvisor.type";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const locationId = searchParams.get("locationId");

  const photosUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${config.tripadvisorAPIKey}&language=en&limit=1`;

  const photos = await fetch(photosUrl).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw Error("TripAdvisor server error!");
  });

  return Response.json(
    photos.map((photo: TripAdvisorPhotoResponse) => ({
      id: photo.id,
      isBlessed: photo.is_blessed,
      album: photo.album,
      caption: photo.caption,
      images: { ...photo.images },
      source: {
        name: photo.source.name,
        localizedName: photo.source.localized_name,
      },
    }))
  );
}
