import { BehaviorSubject } from "rxjs";

const userLocationCoordinatesEventBus = new BehaviorSubject<{ latitude: number | null; longitude: number | null; isGranted: boolean | null }>({
  latitude: null,
  longitude: null,
  isGranted: null,
});

export default userLocationCoordinatesEventBus;
