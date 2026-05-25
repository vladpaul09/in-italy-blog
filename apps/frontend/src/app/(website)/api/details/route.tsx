import config from "@/config";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const locationId = searchParams.get("locationId");

  const urlDetails = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${config.tripadvisorAPIKey}&language=en&currency=EUR`;

  const details = await fetch(urlDetails).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw Error(response.statusText);
  });

  return Response.json({
    name: details.name,
    description: details.description,
    webUrl: details.web_url,
    website: details.website,
    numReviews: details.num_reviews,
    rating: details.rating,
    ratingImageUrl: details.rating_image_url,
  });
}
