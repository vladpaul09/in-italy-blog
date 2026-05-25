import { Subject } from "rxjs";
import { mapPosts } from "@/types/mapPostData.type";

const homepageMapEventsEventBus = new Subject<Array<mapPosts> | undefined>();

export default homepageMapEventsEventBus;
