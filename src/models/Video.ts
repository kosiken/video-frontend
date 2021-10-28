import User, { Channel } from "./User";

export interface VideoAnalytics {
    likes: number;
    comments: number;
}


export interface Like {
    liked_by: number;
    user?: User;
    video_id: Video;
    channel_id: number;
}
export interface VideoPurchase {
    user_id: number;
    video: Video;
    price: number;
    
    
}

export default interface Video {
    id: number | string;
    channel: Channel | number;
    channel_name: string;
    thumbnail: string;
    title: string;
    description: string;
    uploaded: Date | number;
    video_type: 'public' | 'restricted';
    duration: number;
    analytics?: VideoAnalytics;
    views: number;
    url: string;

}

