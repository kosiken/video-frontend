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
    user_id: string;
    video: Video;
    price: number;
    
    
}

export default interface Video {
    id: string;
    channel: Channel | string;
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

