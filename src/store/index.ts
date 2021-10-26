import {  configureStore } from "@reduxjs/toolkit";
import { logger } from "./middleware";

import { AuthAction, authReducer, AuthState, SettingsAction, settingsReducer, SettingsState } from "./reducers";


export interface AppState {
    auth: AuthState;
    settings: SettingsState
    
}

export default configureStore<AppState, AuthAction & SettingsAction>({
    reducer: {
        auth: authReducer,
        settings: settingsReducer
    }, middleware: [logger]
})