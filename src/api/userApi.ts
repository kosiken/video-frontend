import User, { Channel, Subscription } from "../models/User";
import axios, { AxiosInstance } from "axios";
// import Video from "../models/Video";
import { sanitizedChannel } from "../utils/functions";
import ViewHistory from "../models/ViewHistory";
import Video, { VideoComment, VideoPurchase } from "../models/Video";

export interface IBillingDetails {
  billingCardBrand: string;
  billingCardExpMonth: string;
  billingCardExpYear: string;
  billingCardLast4: string;
  hasBillingCard: boolean;
  cvv: string;
}

interface IUserApi {
  _api: AxiosInstance;

  getFollowing(): Promise<Subscription[]>;
  updateDetails(body: any): Promise<User>;
  unSubscribe(channel: string): Promise<{ deleted: boolean }>;
  subscribe(channel: string): Promise<Subscription>;
  viewHistory(): Promise<ViewHistory[]>;
  purchases(): Promise<VideoPurchase[]>;
  addCard(data: IBillingDetails): Promise<IBillingDetails>;
  viewVideoRestricted(
    videoId: string,
    accessToken: string,
    duration: number
  ): Promise<any>;

  viewVideo(videoId: string, duration: number): Promise<any>;
  getRestrictedVideo(accessCode: string, id?: string): Promise<Video>; //</Video>
  reactToVideo(like: boolean, video: Video): Promise<{ like: boolean }>;
  purchase(videoId: string): Promise<VideoPurchase>;
  checkForAccess(videoId: string): Promise<VideoPurchase>;
  addComment(videoId: string, body: string): Promise<VideoComment>;
  getComments(videoId: string): Promise<VideoComment[]>;
}

class UserApi implements IUserApi {
  _api: AxiosInstance;

  constructor() {
    this._api = axios.create({
      baseURL: "http://localhost:1337/api/user",
      headers: { "Content-Type": "application/json" },
    });
  }
  async getComments(videoId: string): Promise<VideoComment[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<VideoComment[]>(
      `/comment/${videoId}`,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );
    return response.data;
  }
  async addComment(videoId: string, body: string): Promise<VideoComment> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.post<VideoComment>(
      `/comment/${videoId}`,
      { body },
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );
    return response.data;
  }
  async viewVideoRestricted(
    videoId: string,
    accessToken: string,
    duration: number
  ): Promise<any> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get(
      `/view/${videoId}?accessToken=${accessToken}&duration=${
        duration > 1000 ? duration : 1000
      }`,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async checkForAccess(videoId: string): Promise<VideoPurchase> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<VideoPurchase>(
      `/check-access/${videoId}`,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );
    return response.data;
  }
  async purchase(videoId: string): Promise<VideoPurchase> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<VideoPurchase>(
      `/purchase/${videoId}`,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async getRestrictedVideo(accessCode: string, id?: string): Promise<Video> {
    let url = id ? "?videoId=" + id : "";
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<Video>(
      `/restricted/${accessCode}` + url,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async reactToVideo(like: boolean, video: Video): Promise<{ like: boolean }> {
    let url = like ? "/like" : "/un-like";
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    let channelId =
      typeof video.channel === "string"
        ? video.channel
        : (video.channel as Channel).id;

    const response = await this._api.post<{
      like: boolean;
    }>(
      url,
      {
        videoLiked: video.id,
        channel: channelId,
      },
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async viewVideo(videoId: string, duration: number): Promise<any> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get(
      `/view/${videoId}?duration=${duration > 1000 ? duration : 1000}`,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async addCard(data: IBillingDetails): Promise<IBillingDetails> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.post<IBillingDetails>("/card", data, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });

    return response.data;
  }
  async purchases(): Promise<VideoPurchase[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<VideoPurchase[]>(`/paid-videos`, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async viewHistory(): Promise<ViewHistory[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<ViewHistory[]>(`/history`, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async subscribe(channel: string): Promise<Subscription> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<Subscription>(
      `/subscribe/${channel}`,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );
    response.data.channel = sanitizedChannel(response.data.channel);
    return response.data; // comment
  }
  async unSubscribe(channel: string): Promise<{ deleted: boolean }> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<{ deleted: boolean }>(
      `/subscribe/${channel}?unsubscribe=true`,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );
    return response.data;
  }
  async updateDetails(body: any): Promise<User> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.post<User>("/update", body, {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });

    return response.data;
  }

  async getFollowing(): Promise<Subscription[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<any[]>("/following", {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    let data: Subscription[] = response.data.map((v) => {
      return {
        ...v,
        channel: sanitizedChannel(v.channel),
      };
    });
    return data;
  }
}

export default function UserApiSignleton(): IUserApi {
  let instance: IUserApi | undefined;
  if (!instance) instance = new UserApi();
  return instance;
}
