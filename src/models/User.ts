
export interface Channel {
    id: string;
    user_id: string;
    name: string;
    about?: string;
    short_description?: string; 
    logo: string;
    banner?: string;
    follower_count: number;
   like_count?: number;
   video_count?: number;
   total_views?:  number;
}

export interface Subscription {
    userSubscribing: string;
    channel: Channel;
}

export interface WithdrawalRequest {
    id: string;
    amount: number;
    status: "pending" | "fulfilled"  | "denied",  createdAt:number;
    userAssociated: User;
}

export interface Wallet {
    income: number;
    owner: User;
}

export default interface User {

    
    id: string;
    email: string;
    emailAddress?: string;
    username: string;
    birthdate: Date | string;
    country: string;
    profilePic: string;
    fullName: string;
    password?: string;
    isCreator: boolean;
    channel?: Channel;
    token?: string;
    has_billing_card: boolean;
    billing_card_brand?: string;
  
    billing_card_last4?: string;

}