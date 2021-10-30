import  { Channel } from "../models/User";
import axios, { AxiosInstance } from "axios";

export interface IBankAccountDetails {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
}

interface ICreatorApi {
  _api: AxiosInstance;
  getChannel(): Promise<Channel>;
  editChannel(channel: any): Promise<Channel>;
  getBankDetails(): Promise<IBankAccountDetails>;
}

class CreatorApi implements ICreatorApi {
  _api: AxiosInstance;
  constructor() {
    this._api = axios.create({
      baseURL: "http://localhost:1337/api/creator",
      headers: { "Content-Type": "application/json" },
    });
  }
  async editChannel(channel: any): Promise<Channel> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.post<Channel>(`/channel`, channel, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async getChannel(): Promise<Channel> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<Channel>(`/channel`, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }

  async getBankDetails(): Promise<IBankAccountDetails> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<IBankAccountDetails>(`/bank-details`, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
}

export default function CreatorApiSignleton(): ICreatorApi {
  let instance: ICreatorApi | undefined;
  if (!instance) instance = new CreatorApi();
  return instance;
}
