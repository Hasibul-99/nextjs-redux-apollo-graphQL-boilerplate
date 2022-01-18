import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleWare from 'redux-saga';
import { persistStore } from 'redux-persist';

import rootSaga from './root-saga';

import cartReducer from './cart';
import modalReducer from "./modal";
import wishlistReducer from "./wishlist";
import categoryReducer from "./categories";
import authUserReducer from "./authUser";

const sagaMiddleware = createSagaMiddleWare();

const rootReducers = combineReducers( {
    cart: cartReducer,
    modal: modalReducer,
    wishlist: wishlistReducer,
    category: categoryReducer,
    user: authUserReducer
});

const makeStore = ( initialState, options ) => {
    const store = createStore( rootReducers, applyMiddleware( sagaMiddleware ) );

    store.sagaTask = sagaMiddleware.run( rootSaga );

    // store.sagaTask = sagaMiddleware.run( rootSaga );
    store.__persistor = persistStore( store );
    return store;
}

export default makeStore;
