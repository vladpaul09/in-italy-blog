import { Subject } from "rxjs";
import { LatLngExpression } from "leaflet";

const homepageMapStateEventBus = new Subject<{
  selectedProvince?: string;
  selectedRegion?: string;
  center: LatLngExpression;
  zoom: number;
}>();

export default homepageMapStateEventBus;
