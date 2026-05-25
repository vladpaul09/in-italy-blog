export type TripAdvisorSearchResponse = {
    location_id: string;
    name: string;
    address_obj: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      country: string;
      postalcode: string;
      address_string: string;
    };
};

export type TripAdvisorDetailsResponse = {
  location_id: string;
  name: string,
  description: string;
  web_url: string;
  ancestors: {
    abbrv: string;
    name: string;
    location_id: string;
  }
  latitude: number;
  longitude: number;
  timezone: string;
  email: string;
  phone: string;
  website: string;
  write_review: string;
  ranking_data: {
    geo_location_id: number;
    ranking_string: string;
    geo_location_name: string;
    ranking_out_of: number;
    ranking: number;
  }
  rating: number;
  rating_image_url: string;
  num_reviews: string;
  review_rating_count: {
    [k: number]: number
  };
  subratings: {
    [k: number]: {
      name: string;
      localized_name: string;
      rating_image_url: string;
      value: number;
    };
  };
  photo_count: number;
  see_all_photos: string;
  price_level: string;
  hours: {
    periods: {
      open: {
        day: number;
        time: string;
      };
      close: {
        day: number;
        time: string;
      };
    }[];
    weekday_text: string;
  }
  amenities: Array<string>;
  features: Array<string>;
  cuisines: {
    name: string;
    localized_name: string;
  }[]
  parent_brand: string;
  brand: string;
  category: {
    name: string;
    localized_name: string;
  };
  subcategory: {
    name: string;
    localized_name: string;
  }[];
  groups: {
    name: string;
    localized_name: string;
    categories: {
      name: string;
      localized_name: string;
    }[];
  }[];
  styles: Array<string>;
  neighborhood_info: {
    location_id: string;
    name: string;
  }[];
  trip_types: {
    name: string;
    localized_name: string;
    value: string;
  }[];
  awards: {
    award_type: string;
    year: number;
    images: {
      tiny: string;
      small: string;
      large: string;
    };
    categories: Array<string>;
    display_name: string;
  }[];
  error: {
    message: string;
    type: string;
    code: number;
  }
}

export type TripAdvisorPhotoResponse = {
  id: number;
  is_blessed: boolean;
  album: string;
  caption: string;
  published_date: string;
  images: {
    [k in 'thumbnail' | 'original' | 'large' | 'medium' | 'small']: {
      height: number;
      width: number;
      url: string;
    }
  }
  source: {
    name: string;
    localized_name: string;
  };
  user: {
    username: string;
    user_location: {
      name: string;
      id: string;
    };
    review_count: number;
    reviewer_badge: string;
    avatar: any; //documentation does not specify type - https://tripadvisor-content-api.readme.io/reference/getlocationphotos
  }
  paging: {
    next: string;
    previous: string;
    results: number;
    total_results: number;
    skipped: number;
  }
  error: {
    message: string;
    type: string;
    code: number;
  }
}
