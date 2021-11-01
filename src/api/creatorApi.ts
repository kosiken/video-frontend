import { Channel, Wallet, WithdrawalRequest } from "../models/User";
import axios, { AxiosInstance } from "axios";
import ViewHistory from "../models/ViewHistory";
import Video, { Like, VideoPurchase } from "../models/Video";
import { Subscription } from "react-hook-form/dist/utils/subject";

export interface IBankAccountDetails {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
}
type analyticsValid = "subscription" | "view" | "like" | "purchase" | "video";

type Analytic =  Array<ViewHistory | Like | Video | Subscription | VideoPurchase>;
interface ICreatorApi {
  _api: AxiosInstance;
  getChannel(): Promise<Channel>;
  editChannel(channel: any): Promise<Channel>;
  getBankDetails(): Promise<IBankAccountDetails>;
  updateBankDetails(data: IBankAccountDetails): Promise<IBankAccountDetails>;
  analytics(model: analyticsValid, populate?: string, since?: Date): Promise<Analytic>;
  uploadVideo(uploadId: string, data: any): Promise<Video>;
  deleteItems(model: 'video' | 'comment', data: string[]): Promise<Array<Video | Comment>>;
  getWallet(): Promise<Wallet>;
  getRequests(): Promise<WithdrawalRequest[]>;
  createRequest(amount: number): Promise<WithdrawalRequest>;
  
}

class CreatorApi implements ICreatorApi {
  _api: AxiosInstance;
  constructor() {
    this._api = axios.create({
      baseURL: "/api/creator",
      headers: { "Content-Type": "application/json" },
    });
  }
 async createRequest(amount: number): Promise<WithdrawalRequest> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.post<WithdrawalRequest>(`/requests`, {amount}, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }

  async getRequests(): Promise<WithdrawalRequest[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<WithdrawalRequest[]>(`/requests`, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async getWallet(): Promise<Wallet> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<Wallet>(`/wallet`, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }



 async deleteItems(model: "video" | "comment", data: string[]): Promise<(Video | Comment)[]> {
  let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
  const response = await this._api.post<Array<Video | Comment>>(`/delete/${model}`, {records: data.join(',')}, {
    headers: {
      authorization: `Bearer ${config.token}`,
    },
  });
  return response.data;
  }



  async uploadVideo(uploadId: string, data: any): Promise<Video> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.post<Video>(`/video/${uploadId}`, data, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async analytics(model: analyticsValid,populate?: string, since?: Date): Promise<Analytic> {

    let url = `/analytics/${model}`;
    let str = []
    if(populate) {
      str.push('populate=' + populate)
    }
    if(since ) {
       str.push('since=' +  since.getTime())
    }

    if(str.length > 0) {
      let s = '?' +  (str.length > 1  ? str.join('&'): str[0]);
      url+= s;

    }

    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<Analytic>(url, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  
  async updateBankDetails(
    data: IBankAccountDetails
  ): Promise<IBankAccountDetails> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.post<IBankAccountDetails>(
      `/bank-details`,
      data,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );
    return response.data;
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
