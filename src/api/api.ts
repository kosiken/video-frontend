import User, { Channel } from "../models/User";

import axios, { AxiosInstance } from "axios";
import Video from "../models/Video";
import { Ticket } from "../models/Admin";

export type SignInOptions = {
  emailAddress: string;
  password: string;
  fullName: string;
};

export type LogInOptions = {
  email: string;
  password: string;
};

interface IErederApi {
  _api: AxiosInstance;
  signIn(options: SignInOptions): Promise<User>;
  logIn(options: LogInOptions): Promise<User>;
  me(): Promise<User>;
  becomeCreator(): Promise<{ isCreator: boolean }>;
  allVideos():Promise<Video[]>;
  logout():Promise<void>;
  addTicket(title: string, body: string): Promise<Ticket>;
  getVideo(id: string): Promise<Video>;
  getChannels(): Promise<Channel[]>;
  getChannel(id: string): Promise<Channel>;
  getChannelVideos(id: string): Promise<Video[]>;
  
  //</Video>
  //</void>
}

let test = true;

function setToken(user: User) {
  if (test) {
    console.warn("In test mode");
    if (user.token) window.localStorage.setItem("jwt", user.token);
  } else return;
}

class ErederApi implements IErederApi {
  _api: AxiosInstance;
  constructor() {
    this._api = axios.create({
      baseURL: "",
      headers: { "Content-Type": "application/json" },
    });
  }

  async getChannelVideos(id: string): Promise<Video[]>{
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    let response = await this._api.get<Video[]>('/all-channels-videos/' + id  ,   {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async getChannel(id: string): Promise<Channel> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    let response = await this._api.get<Channel>('/all-channels/' + id  ,   {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }

  async getChannels(): Promise<Channel[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    let response = await this._api.get<Channel[]>('/all-channels' ,   {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }
  async getVideo(id: string): Promise<Video> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
      let response = await this._api.get<Video>('/api/video/' +id ,   {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      });
      return response.data;
  }
  async addTicket(title: string, body: string): Promise<Ticket> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

   const response =  await this._api.post<Ticket>(
    "/api/user/ticket",{body, title},
    {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    }
  );
  return response.data;

  }
 async logout(): Promise<void> {
  let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    await this._api.get(
    "/logout",
    {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    }
  );

  }
  async allVideos(): Promise<Video[]> {
    const response = await this._api.get<Video[]>("/videos");

    return response.data;
  }
  // async getChannel(): Promise<Channel> {
  //   let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
  //   const response = await this._api.get<Channel>("/api/creator/channel", {
  //     headers: {
  //       authorization: `Bearer ${config.token}`,
  //     },
  //   });
  //   return response.data;
  // }

  async becomeCreator(): Promise<{ isCreator: boolean }> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<{ isCreator: boolean }>(
      "/api/creator/become",
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async me(): Promise<User> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };

    const response = await this._api.get<User>("/api/me", {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
    return response.data;
  }

  async signIn(options: SignInOptions): Promise<User> {
    const response = await this._api.post<User>("/signup", options);
    setToken(response.data);
    return response.data;
  }
  async logIn(options: LogInOptions): Promise<User> {
    const response = await this._api.post<User>("/login", options);
    setToken(response.data);
    return response.data;
  }

  
}

export default function ApiSignleton(): ErederApi {
  let instance: ErederApi | undefined;
  if (!instance) instance = new ErederApi();
  return instance;
}
