/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in kilometers
 */
export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Generate Sequelize literal for Haversine distance calculation
 * @param lat Latitude of reference point
 * @param lon Longitude of reference point
 * @param tableAlias Optional table alias for the coordinates
 * @returns Sequelize literal for distance calculation
 */
export const haversineDistanceLiteral = (lat: number, lon: number, tableAlias?: string): string => {
  const latField = tableAlias ? `\`${tableAlias}\`.\`latitude\`` : "`latitude`";
  const lonField = tableAlias ? `\`${tableAlias}\`.\`longitude\`` : "`longitude`";

  return `(6371 * acos(
    cos(radians(${lat}))
    * cos(radians(${latField}))
    * cos(radians(${lonField}) - radians(${lon}))
    + sin(radians(${lat}))
    * sin(radians(${latField}))
  ))`;
};
