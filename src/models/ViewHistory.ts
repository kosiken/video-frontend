import { Channel } from "./User";
import Video from "./Video";


export default interface ViewHistory {
    userWhoViewed: string;
    video: Video;
    channel: Channel;
    createdAt:number;
    duration: number;
    isPayedView: boolean;
    
}