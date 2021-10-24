import { configureStore } from "@reduxjs/toolkit";
import { logger } from "./middleware";

import { authReducer, AuthState } from "./reducers";


export interface AppState {
    auth: AuthState;
    
}

export default configureStore({
    reducer: {
        auth: authReducer
    }, middleware: [logger]
})