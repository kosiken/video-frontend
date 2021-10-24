interface VideoAnalytics {
    likes: number;
    comments: number;
}

export default interface Video {
    creator: string;
    thumbnail: string;
    title: string;
    description: string;
    uploaded: Date;
    video_type: 'public' | 'restricted';
    duration: number;
    analytics: VideoAnalytics;
}

