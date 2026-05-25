import useSWR, { Fetcher } from "swr";
import config from "@/config";
import { TripAdvisorSearchResponse } from "@/types/tripAdvisor.type";
import { Hotel } from "@/types/hotel.type";

const urlLocationSearch = `${config.tripadvisorEndpoint}`;

const tripadvisorUrl = (
  searchQuery: string,
  category: string,
  locale: string,
  latitude: string,
  longitude: string,
  radius: number,
  radiusUnit: string
) => {
  return `${urlLocationSearch}/api/v1/location/search?key=${config.tripadvisorAPIKey}&searchQuery=${searchQuery}&latLong=${latitude},${longitude}&category=${category}&language=${locale}&radius=${radius}&radiusUnit=${radiusUnit}`;
};

const fetcher: Fetcher<
  Array<Hotel>,
  { searchQuery: string; category: string; locale: string; latitude: string; longitude: string; radius: number; radiusUnit: string }
> = async ({ searchQuery, category, locale, latitude, longitude, radius, radiusUnit }) =>
  fetch(tripadvisorUrl(searchQuery, category, locale, latitude, longitude, radius, radiusUnit), {
    headers: {
      accept: "application/json",
    },
  }).then(async (response) => {
    if (response.ok) {
      const searchData = await response.json();
      return await Promise.all(
        searchData.data.map(async (item: TripAdvisorSearchResponse) => {
          const detailsData = await fetch(
            `${urlLocationSearch}/api/v1/location/${item.location_id}/details?key=${config.tripadvisorAPIKey}&language=en&currency=EUR`
          ).then(async (response) => {
            if (response.ok) {
              const data = await response.json();
              return data;
            }

            throw Error("TripAdvisor server error!");
          });
          const photosData = await fetch(
            `${urlLocationSearch}/api/v1/location/${item.location_id}/photos?key=${config.tripadvisorAPIKey}&language=en&limit=1`
          ).then(async (response) => {
            if (response.ok) {
              const data = await response.json();
              return data.data;
            }

            throw Error("TripAdvisor server error!");
          });

          return {
            search: { ...item },
            details: detailsData,
            photos: photosData,
          };
        })
      );
    }

    throw Error("TripAdvisor server error!");
  });

function useGetAccomodationListData(
  searchQuery: string,
  category: string,
  locale: string,
  latitude: string,
  longitude: string,
  radius: number,
  radiusUnit: string
) {
  const { data, error, isLoading, mutate } = useSWR(
    tripadvisorUrl(searchQuery, category, locale, latitude, longitude, radius, radiusUnit),
    () => fetcher({ searchQuery, category, locale, latitude, longitude, radius, radiusUnit }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data ? data : [],
    isLoading: config.tripadvisorEndpoint === undefined ? true : isLoading,
    error,
    mutate,
  };
}

export default useGetAccomodationListData;
