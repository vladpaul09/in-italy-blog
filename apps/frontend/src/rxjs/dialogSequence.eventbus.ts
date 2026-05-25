import { Subject } from "rxjs";

interface DialogSequenceState {
  isRenderGeolocationPermissionDialog: boolean;
}

const dialogSequenceEventBus = new Subject<DialogSequenceState>();

export default dialogSequenceEventBus;
