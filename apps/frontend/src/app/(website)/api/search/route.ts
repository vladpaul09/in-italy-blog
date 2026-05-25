import config from "@/config";
import { Hotel } from "@/types/hotel.type";
import { TripAdvisorDetailsResponse, TripAdvisorPhotoResponse, TripAdvisorSearchResponse } from "@/types/tripAdvisor.type";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const searchQuery = searchParams.get("searchQuery");
  const category = searchParams.get("category");

  const urlSearch = `https://api.content.tripadvisor.com/api/v1/location/search?key=${config.tripadvisorAPIKey}&searchQuery=${searchQuery}&category=${category}&limit=1`;

  const searchData = await fetch(urlSearch).then((response) => {
    if (response.ok) {
      return response.json();
    }
    // throw Error("TripAdvisor server error!");
  });

  return Response.json(
    searchData.data.map((data: TripAdvisorSearchResponse, index: number) => {
      return {
        locationId: data.location_id,
        name: data.name,
        addressObj: {
          street1: data.address_obj.street1,
          street2: data.address_obj.street2,
          city: data.address_obj.city,
          state: data.address_obj.state,
          country: data.address_obj.country,
          postalcode: data.address_obj.postalcode,
          addressString: data.address_obj.address_string,
        },
      };
    })
  );
}
