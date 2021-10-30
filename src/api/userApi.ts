import User, { Channel, Subscription } from "../models/User";
import axios, { AxiosInstance } from "axios";
import Video from "../models/Video";
import { sanitizedChannel } from "../utils/functions";
import ViewHistory from "../models/ViewHistory";

interface IUserApi {
  _api: AxiosInstance;

  getFollowing(): Promise<Subscription[]>;
  updateDetails(body: any): Promise<User>;
  unSubscribe(channel: string): Promise<{deleted: boolean;}>;
  subscribe(channel: string): Promise<Subscription>;
  viewHistory(): Promise<ViewHistory>;
}

class UserApi implements IUserApi {
  _api: AxiosInstance;

  constructor() {
    this._api = axios.create({
      baseURL: "http://localhost:1337/api/user",
      headers: { "Content-Type": "application/json" },
    });
  }
  viewHistory(): Promise<ViewHistory> {
    throw new Error("Method not implemented.");
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
