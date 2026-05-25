import { TripAdvisorDetailsResponse, TripAdvisorPhotoResponse, TripAdvisorSearchResponse } from "./tripAdvisor.type";

export type Hotel = {
  search: TripAdvisorSearchResponse;
  details: TripAdvisorDetailsResponse;
  photos: TripAdvisorPhotoResponse[];
};
