// Location data expiration duration in milliseconds (1 hour)
const LOCATION_DATA_EXPIRATION_MS = 60 * 60 * 1000;

/**
 * Stores location data in localStorage with expiration
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 */
export const storeLocationData = (latitude: number, longitude: number): void => {
  const expirationDate = new Date(Date.now() + LOCATION_DATA_EXPIRATION_MS);
  localStorage.setItem("locationLatitude", latitude.toString());
  localStorage.setItem("locationLongitude", longitude.toString());
  localStorage.setItem("locationExpirationDate", expirationDate.toISOString());
};

/**
 * Retrieves stored location data from localStorage
 * @returns Location data object or null if not found/expired
 */
export const getStoredLocationData = (): { latitude: number; longitude: number } | null => {
  try {
    const latitude = localStorage.getItem("locationLatitude");
    const longitude = localStorage.getItem("locationLongitude");
    const expirationDate = localStorage.getItem("locationExpirationDate");

    // Check if all required data exists
    if (!latitude || !longitude || !expirationDate) {
      return null;
    }

    // Check if the data has expired
    const expirationDateObj = new Date(expirationDate);
    if (new Date() > expirationDateObj) {
      // Data has expired, clear it and return null
      clearStoredLocationData();
      return null;
    }

    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  } catch (error) {
    // If parsing fails, clear the corrupted data
    console.error("Error parsing stored location data:", error);
    clearStoredLocationData();
    return null;
  }
};

/**
 * Clears all stored location data from localStorage
 */
export const clearStoredLocationData = (): void => {
  localStorage.removeItem("locationLatitude");
  localStorage.removeItem("locationLongitude");
  localStorage.removeItem("locationExpirationDate");
};
