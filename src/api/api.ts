import User from "../models/User";

import axios, { AxiosInstance } from "axios";
import Video from "../models/Video";

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
      baseURL: "http://localhost:1337",
      headers: { "Content-Type": "application/json" },
    });
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
