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
    uploaded: Date;
    video_type: 'public' | 'restricted';
    duration: number;
    analytics?: VideoAnalytics;
    views: number;

}

