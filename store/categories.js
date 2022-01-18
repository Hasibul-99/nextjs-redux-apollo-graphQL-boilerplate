import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

import { takeEvery } from 'redux-saga/effects';

const actionTypes = {
    ADD_TO_CATEGORY: 'ADD_TO_CATEGORY',
    // REMOVE_FROM_CATEGORY: 'REMOVE_FROM_CATEGORY',
    // UPDATE_CATEGORY: 'UPDATE_CATEGORY',
    // REFRESH_STORE: 'REFRESH_STORE'
};

const initialState = {
    data: []
};

function categoryReducer( state = initialState, action ) {
    switch ( action.type ) {
        case actionTypes.ADD_TO_CATEGORY:
            let tmpCategory = action.payload.category ;
            
            return { ...state, data: tmpCategory };
        case actionTypes.REFRESH_STORE:
            return initialState;

        default:
            return state;
    }
};

export const categoryActions = {
    addToCategory: category => ( { type: actionTypes.ADD_TO_CATEGORY, payload: { category } } ),
};

const persistConfig = {
    keyPrefix: "b71-",
    key: "category",
    storage
};

export default persistReducer( persistConfig, categoryReducer );