import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

const actionTypes = {
    RefreshStore: "REFRESH_STORE"
};

const initialState = {
    current: 1
};

function cartReducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.RefreshStore:
            return {
                ...state,
                current: action?.payload?.current
            }
        default:
            return state;
    }
}

export const cartActions = {
    refreshStore: ( current ) => ( { type: actionTypes.RefreshStore, payload: { current } } ),
};

const persistConfig = {
    keyPrefix: "test-",
    key: "cart",
    storage
};

export default persistReducer( persistConfig, cartReducer );