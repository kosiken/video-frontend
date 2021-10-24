import { DefaultUser } from '../constants';
import User from '../models/User';
export type AuthState = {
    user?: User;
}
type AuthAction = {
    type: 'login' | 'logout';
    user?: User;

}

let initalAuthState: AuthState = {
    user: DefaultUser
};


export function authReducer(state = initalAuthState, action: AuthAction): AuthState{
    let returnObj = state;
    switch(action.type) {
        case 'login':
            returnObj.user = action.user;
            break;
        case 'logout':
            returnObj.user = undefined;
            break;
        default:
            console.warn("unknown action "+ action.type);
            break;
    }
    return returnObj;

}

