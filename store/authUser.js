import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

const actionTypes = {
    SET_USER_INFO: 'SET_USER_INFO',
    REMOVE_USER_INFO: 'REMOVE_USER_INFO',
    SET_USER_ORDERS: 'SET_USER_ORDERS',
    REMOVE_USER_ORDERS: 'REMOVE_USER_ORDERS',
    SET_USER_NOTIFICATION: "SET_USER_NOTIFICATION",
    REMOVE_USER_NOTIFICATION: "REMOVE_USER_NOTIFICATION",
    ADD_NEW_USER_NOTIFICATION: "ADD_NEW_USER_NOTIFICATION",
    REFRESH_STORE: 'REFRESH_STORE',
};

const initialState = { 
    isUserLogin: false,
    userInfo: null,
    userOrders: null,
    notifications: null,
}

function authUserReducer( state = initialState, action ) {
    switch ( action.type ) {
        case actionTypes.SET_USER_INFO:
            return {
                ...state,
                isUserLogin: true,
                userInfo: action.payload.userInfo
            }
        case actionTypes.REMOVE_USER_INFO:
            return {
                ...state,
                isUserLogin: false,
                userInfo: 0
            }
        case actionTypes.REFRESH_STORE:
            return initialState;
        
        case actionTypes.SET_USER_ORDERS:
            return {
                ...state,
                userOrders: action.payload.order
            }
        case actionTypes.REMOVE_USER_ORDERS:
            return {
                ...state,
                userOrders: null,
            }
        case actionTypes.SET_USER_NOTIFICATION:
            return {
                ...state,
                notifications: action.payload.notifications
            }
        case actionTypes.REMOVE_USER_NOTIFICATION:
            return {
                ...state,
                notifications: null
            }
        default:
            return state;
    }
}

export const authUserActions = {
    setUserInfo: userInfo => ( { type: actionTypes.SET_USER_INFO, payload: {userInfo}} ),
    removeUserInfo: userInfo => ( { type: actionTypes.REMOVE_USER_INFO, payload: {userInfo}} ),
    setUserOrder: order => ( { type: actionTypes.SET_USER_ORDERS, payload: {order}} ),
    removeUserOrder: order => ( { type: actionTypes.REMOVE_USER_ORDERS, payload: {order}} ),
    setUserNotifications: notifications => ( { type: actionTypes.SET_USER_NOTIFICATION, payload: { notifications }} ),
    removeUserNotifications: notifications => ( { type: actionTypes.REMOVE_USER_NOTIFICATION, payload: {notifications}} ),
};

const persistConfig = {
    keyPrefix: "b71-",
    key: "user",
    storage
}

export default persistReducer( persistConfig, authUserReducer );