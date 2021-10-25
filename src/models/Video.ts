import User, { Channel } from "./User";

export interface VideoAnalytics {
    likes: number;
    comments: number;
}


export interface Like {
    user_id: number;
    user?: User;
    video: Video;
}


export default interface Video {
    channel: Channel;
    thumbnail: string;
    title: string;
    description: string;
    uploaded: Date;
    video_type: 'public' | 'restricted';
    duration: number;
    analytics: VideoAnalytics;

}

