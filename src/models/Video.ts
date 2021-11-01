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
  id: string;
  userWhoPurchased: string;
  videoPurchased: Video;
  amountPaid: number;
  accessCode: string;
  channel: Channel;
  createdAt: number;
}

export interface VideoComment {
  video: Video;
  body: string;
  user: User;
}

export default interface Video {
  id: string;
  channel: Channel | string;
  channel_name: string;
  thumbnail: string;
  title: string;
  description: string;
  uploaded: Date | number;
  video_type: "public" | "restricted";
  videoType: "public" | "restricted";
  duration: number;
  analytics?: VideoAnalytics;
  viewCount: number;
  views: number;
  url: string;
  createdAt: number;
  likeCount: number;
  price: number;
}
