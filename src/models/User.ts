
export interface Channel {
    user_id: number;
    name: string;
    about: string;
    logo: string;
    banner: string;
    subscriber_count: number;
}

export interface Subsription {
    user_id: number;
    channel: Channel;
}


export default interface User {
    id: number;
    email: string;
    username: string;
    birthdate: Date;
    country: string;
    profilePic: string;
    fullName: string;
    password?: string;
    isCreator: boolean;
    channel?: Channel;

}