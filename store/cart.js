import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { toast } from 'react-toastify';
import { takeEvery } from 'redux-saga/effects';

const actionTypes = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    UPDATE_CART: 'UPDATE_CART',
    REFRESH_STORE: 'REFRESH_STORE',
    UPDATE_SINGLE_CART: 'UPDATE_SINGLE_CART',
    ADD_MULTIPLE_CARTS: "ADD_MULTIPLE_CARTS"
}

const initialState = {
    data: []
}

function cartReducer( state = initialState, action ) {
    switch ( action.type ) {
        case actionTypes.ADD_TO_CART:
            let tmpProduct = { ...action.payload.product };

            if ( state.data.findIndex( item => item.url_key === action.payload.product.url_key ) > -1 ) {
                let tmpData = state.data.reduce( ( acc, cur ) => {
                    if ( cur.url_key === tmpProduct.url_key ) {
                        acc.push( {
                            ...cur,
                            qty: parseInt( cur.qty ) + parseInt( tmpProduct.qty )
                        } );
                    } else {
                        acc.push( cur );
                    }

                    return acc;
                }, [] )

                return { ...state, data: tmpData };
            } else {
                return { ...state, data: [ ...state.data, tmpProduct ] };
            }

        case actionTypes.REMOVE_FROM_CART:
            let cart = state.data.reduce( ( cartAcc, product ) => {
                if ( product.url_key !== action.payload.product.url_key ) {
                    cartAcc.push( product );
                }
                return cartAcc;
            }, [] );

            return { ...state, data: cart };
        
        case actionTypes.UPDATE_SINGLE_CART:
            let cartList = [];

            let findIndex = state.data.findIndex(item => item.url_key === action.payload.product.url_key);

            
            if (findIndex !== -1) {
                state.data.forEach(cat => {
                    if (cat.url_key === action.payload.product.url_key) cartList.push(action.payload.product);
                    else cartList.push(cat);
                });
            } else {
                cartList = [ ...state.data, action.payload.product ];
            }

            return { ...state, data: cartList };

        case actionTypes.ADD_MULTIPLE_CARTS:
            let tmpCart = [ ...action.payload.products ];
            return { ...state, data: tmpCart || [] };
            
        case actionTypes.UPDATE_CART:
            return { ...state, data: action.payload.products };

        case actionTypes.REFRESH_STORE:
            return initialState;

        default:
            return state;
    }
}

export const cartActions = {
    addToCart: product => ( { type: actionTypes.ADD_TO_CART, payload: { product } } ),
    removeFromCart: product => ( { type: actionTypes.REMOVE_FROM_CART, payload: { product } } ),
    updateCart: products => ( { type: actionTypes.UPDATE_CART, payload: { products } } ),
    updateSingleCart: product => ( {type: actionTypes.UPDATE_SINGLE_CART, payload: { product }} ),
    addMultipleCarts: products => ( { type: actionTypes.ADD_MULTIPLE_CARTS, payload: { products }})
};

const persistConfig = {
    keyPrefix: "b71-",
    key: "cart",
    storage
}

export default persistReducer( persistConfig, cartReducer );