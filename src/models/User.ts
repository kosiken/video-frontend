
export interface Channel {
    id: number;
    user_id: number;
    name: string;
    about?: string;
    short_description?: string; 
    logo: string;
    banner?: string;
    follower_count: number;
   like_count?: number;
   video_count?: number;
}

export interface Subsription {
    user_id: number;
    channel: Channel;
}


export default interface User {

    
    id: number;
    email: string;
    username: string;
    birthdate: Date | string;
    country: string;
    profilePic: string;
    fullName: string;
    password?: string;
    isCreator: boolean;
    channel?: Channel;
    token?: string;

}