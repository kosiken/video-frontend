import User from "../models/User";
import axios, { AxiosInstance } from 'axios';
 

export type SignInOptions = {
    emailAddress: string;
    password: string;
    fullName: string;

}



export type LogInOptions = {
    email: string;
    password: string;


}

interface IErederApi {
    _api: AxiosInstance;
    signIn(options: SignInOptions): Promise<User> ;
    logIn(options: LogInOptions):Promise<User>;
    me(): Promise<User>;
    becomeCreator(): Promise<{isCreator: boolean}>;
}

class ErederApi implements IErederApi {
    _api: AxiosInstance;
    constructor() {
        this._api =  axios.create({
            baseURL: 'http://localhost:1337',
            headers: { 'Content-Type': 'application/json' },
          });
    }

    
   async  becomeCreator(): Promise<{ isCreator: boolean; }> {
        const response = await this._api.get<{isCreator: boolean}>("/creator/become");
        return response.data;
    }
   async me(): Promise<User> {
        const response = await this._api.get<User>("/me");
        return response.data;
    }

   async signIn(options: SignInOptions): Promise<User> {
        const response = await this._api.post<User>("/signup", options);
        return response.data;
    }
    async logIn(options: LogInOptions): Promise<User> {
        throw new Error("Method not implemented.");
    }
    

    
}

export default function ApiSignleton (): ErederApi {
    let instance: ErederApi | undefined;
    if(!instance)  instance = new ErederApi();
    return instance

}