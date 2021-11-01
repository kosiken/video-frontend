import User, { WithdrawalRequest } from "../models/User";

import axios, { AxiosInstance } from "axios";
import Video from "../models/Video";
import { Message, Transaction } from "../models/Admin";

export type SignInOptions = {
  emailAddress: string;
  password: string;
  fullName: string;
};

export type LogInOptions = {
  email: string;
  password: string;
};
type modelsValid = "ticket" | "transaction" | "request" | "wallet";
interface IErederAdminApi {
  _api: AxiosInstance;
  signIn(options: SignInOptions): Promise<User>;
  logIn(options: LogInOptions): Promise<User>;
  me(): Promise<User>;
  model(
    model: modelsValid,
    populate?: string,
    since?: Date
  ): Promise<(Transaction | WithdrawalRequest)[]>;
  handleWithdrawal(
    id: string,
    status: "fulfilled" | "denied"
  ): Promise<WithdrawalRequest>;
  logout(): Promise<void>;
  getMessages(ticketId: string): Promise<Message[]>;
  messageUser(ticketId: string, body: string): Promise<{ sent: boolean }>;
  //</void>
}

let test = true;

function setToken(user: User) {
  if (test) {
    console.warn("In test mode");
    if (user.token) window.localStorage.setItem("jwt", user.token);
  } else return;
}

class ErederAdminApi implements IErederAdminApi {
  _api: AxiosInstance;
  constructor() {
    this._api = axios.create({
      baseURL: "http://localhost:1337/admin",
      headers: { "Content-Type": "application/json" },
    });
  }
  async messageUser(
    ticketId: string,
    body: string
  ): Promise<{ sent: boolean }> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.post<{sent: boolean;}>(
      `/api/messages/${ticketId}`,
      { body },
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async getMessages(ticketId: string): Promise<Message[]> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<Message[]>(
      `/api/messages/${ticketId}`,
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async handleWithdrawal(
    id: string,
    status: "fulfilled" | "denied"
  ): Promise<WithdrawalRequest> {
    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.post<WithdrawalRequest>(
      `/api/handle-withdrawal-request/${id}`,
      { status },
      {
        headers: {
          authorization: `Bearer ${config.token}`,
        },
      }
    );

    return response.data;
  }
  async model(
    model: modelsValid,
    populate?: string,
    since?: Date
  ): Promise<(Transaction | WithdrawalRequest)[]> {
    let url = `/api/${model}`;
    let str = [];
    if (populate) {
      str.push("populate=" + populate);
    }
    if (since) {
      str.push("since=" + since.getTime());
    }

    if (str.length > 0) {
      let s = "?" + (str.length > 1 ? str.join("&") : str[0]);
      url += s;
    }

    let config = { token: window.localStorage.getItem("jwt") || "NO_TOKEN" };
    const response = await this._api.get<(Transaction | WithdrawalRequest)[]>(
      url,
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

    await this._api.get("/logout", {
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    });
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

export default function ApiSignleton(): ErederAdminApi {
  let instance: ErederAdminApi | undefined;
  if (!instance) instance = new ErederAdminApi();
  return instance;
}
