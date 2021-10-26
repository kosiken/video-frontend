import { Action } from "@reduxjs/toolkit";
import { DefaultUser } from "../constants";
import User from "../models/User";
export interface AuthState  {
  user?: User;
};

export interface SettingsState  {
  darkMode: boolean;
  autoPlay: boolean;
  volume: number;
};
type authActions = "login" | "logout" | "become_creator" ;
type settingsActions = "change-theme" | "change-volume" | "change-autoplay";
export interface AuthAction extends Action<authActions> {
 
  user?: User;
};

export interface SettingsAction extends Action<settingsActions> {
  value: boolean | number;
};

let initalAuthState: AuthState = {
  user: DefaultUser,
};

let initialSettingsState: SettingsState = {
  darkMode: false,
  autoPlay: false,
  volume: 80,
};

export function authReducer(
  state = initalAuthState,
  action: AuthAction
): AuthState {
  let returnObj = null;
  switch (action.type) {
    case "login":
        returnObj = {...state};
      returnObj.user = action.user;
      break;
    case "logout":
        returnObj = {...state};
      returnObj.user = undefined;
      break;

    case "become_creator":
        returnObj = {...state};
      let user: any = { ...returnObj.user, isCreator: true };
      console.log(action);
      returnObj.user = user;
      break;
    default:
      console.warn("unknown action " + action.type);
      break;
  }
  if(returnObj == null) return state;
 else  return returnObj;
}

export function settingsReducer(
  state = initialSettingsState,
  action: SettingsAction
): SettingsState {
  let returnObj = null;
  switch (action.type) {
    case "change-autoplay":
        returnObj = {...state};
      returnObj.darkMode = action.value as boolean;
      break;
    case "change-theme":
        returnObj = {...state};
        
      returnObj.darkMode = action.value as boolean;
      break;

    case "change-volume":
        returnObj = {...state};
      returnObj.volume = action.value as number;
      break;

    default:
      console.warn("unknown action " + action.type);
      break;
  }
  if(returnObj === null  ) return state;
  else return returnObj;
}
