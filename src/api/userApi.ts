import User, { Subscription } from "../models/User";
import axios, { AxiosInstance } from "axios";
// import Video from "../models/Video";
import { sanitizedChannel } from "../utils/functions";
import ViewHistory from "../models/ViewHistory";
import { VideoPurchase } from "../models/Video";

export interface IBillingDetails  {
  billingCardBrand: string;
  billingCardExpMonth: string;
  billingCardExpYear: string;
  billingCardLast4: string;
  hasBillingCard: boolean;
}


interface IUserApi {
  _api: AxiosInstance;

  getFollowing(): Promise<Subscription[]>;
  updateDetails(body: any): Promise<User>;
  unSubscribe(channel: string): Promise<{deleted: boolean;}>;
  subscribe(channel: string): Promise<Subscription>;
  viewHistory(): Promise<ViewHistory[]>;
  purchases(): Promise<VideoPurchase[]>;
  addCard(data: IBillingDetails): Promise<IBillingDetails>;
}

class UserApi implements IUserApi {
  _api: AxiosInstance;

  constructor() {
    this._api = axios.create({
      baseURL: "http://localhost:1337/api/user",
      headers: { "Content-Type": "application/json" },
    });
  }
  async addCard(data: IBillingDetails): Promise<IBillingDetails> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.post<IBillingDetails>("/card",data, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });

    return response.data;
  }
  async purchases(): Promise<VideoPurchase[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<VideoPurchase[]>(`/paid-videos`,  {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async viewHistory(): Promise<ViewHistory[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<ViewHistory[]>(`/history`,  {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async subscribe(channel: string): Promise<Subscription> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<Subscription>(`/subscribe/${channel}`,  {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    response.data.channel = sanitizedChannel(response.data.channel);
    return response.data; // comment
  
  }
 async  unSubscribe(channel: string): Promise<{ deleted: boolean; }> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<{deleted: boolean}>(`/subscribe/${channel}?unsubscribe=true`,  {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async updateDetails(body: any): Promise<User> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.post<User>("/update",body, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });

    return response.data;
  }

  async getFollowing(): Promise<Subscription[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<any[]>("/following",  {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
let data: Subscription[] = response.data.map(v => {
  return {
    ...v, channel: sanitizedChannel(v.channel)
  }
})
    return data;
  }

}


export default function UserApiSignleton(): IUserApi {
  let instance: IUserApi | undefined;
  if (!instance) instance = new UserApi();
  return instance;
}
