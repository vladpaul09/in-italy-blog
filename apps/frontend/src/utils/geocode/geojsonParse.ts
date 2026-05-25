const geoJSONparse = (geojson: any) => {
  const string = JSON.stringify(geojson);
  const regex = /\[([-\d.]+),\s*([-\d.]+)\]/gm;
  const subst = `[$2,$1]`;
  const result = string.replace(regex, subst);
  return JSON.parse(result);
};

export default geoJSONparse;
