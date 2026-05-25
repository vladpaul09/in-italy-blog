export type Restaurant = {
  locationId: string;
  name: string;
  addressObj: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    country: string;
    postalcode: string;
    addressString: string;
  };
  details: RestaurantDetails;
  photos: RestaurantPhotos;
};

export type RestaurantDetails = {
  locationId: string;
  name: string;
  description: string;
  webUrl: string;
  ancestors: {
    abbrv: string;
    name: string;
    locationId: string;
  };
  latitude: number;
  longitude: number;
  timezone: string;
  email: string;
  phone: string;
  website: string;
  writeReview: string;
  rankingData: {
    geoLocationId: number;
    rankingString: string;
    geoLocationName: string;
    rankingOutOf: number;
    ranking: number;
  };
  rating: number;
  ratingImageUrl: string;
  numReviews: string;
  reviewRatingCount: {
    [k: number]: number;
  };
  subratings: {
    [k: number]: {
      name: string;
      localizedName: string;
      ratingImageUrl: string;
      value: number;
    };
  };
  photoCount: number;
  seeAllPhotos: string;
  priceLevel: string;
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
    weekdayText: string;
  };
  amenities: Array<string>;
  features: Array<string>;
  cuisinse: {
    name: string;
    localizedName: string;
  }[];
  parentBrand: string;
  brand: string;
  category: {
    name: string;
    localizedName: string;
  };
  subcategory: {
    name: string;
    localizedName: string;
  }[];
  groups: {
    name: string;
    localizedName: string;
    categories: {
      name: string;
      localizedName: string;
    }[];
  }[];
  styles: Array<string>;
  neighborhoodInfo: {
    locationId: string;
    name: string;
  }[];
  tripTypes: {
    name: string;
    localizedName: string;
    value: string;
  }[];
  awards: {
    awardType: string;
    year: number;
    images: {
      tiny: string;
      small: string;
      large: string;
    };
    categories: Array<string>;
    displayName: string;
  }[];
  error: {
    message: string;
    type: string;
    code: number;
  };
};

export type RestaurantPhotos = {
  id: number;
  isBlessed: boolean;
  album: string;
  caption: string;
  publisheDate: string;
  images: {
    [k in "thumbnail" | "original" | "large" | "medium" | "small"]: {
      height: number;
      width: number;
      url: string;
    };
  };
  source: {
    name: string;
    localizedName: string;
  };
  user: {
    username: string;
    userLocation: {
      name: string;
      id: string;
    };
    reviewCount: number;
    reviewerBadge: string;
    avatar: any; //documentation does not specify type - https://tripadvisor-content-api.readme.io/reference/getlocationphotos
  };
  paging: {
    next: string;
    previous: string;
    results: number;
    totalResults: number;
    skipped: number;
  };
  error: {
    message: string;
    type: string;
    code: number;
  };
}[];