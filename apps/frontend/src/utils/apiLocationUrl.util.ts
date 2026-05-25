const apiLocationUrl = (locale: string, lat: number, long: number) => {
  return `/api/${locale}/location?lat=${lat}&long=${long}`;
};

export default apiLocationUrl;
