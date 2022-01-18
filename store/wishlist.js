import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

const actionTypes = {
    TOGGLE_WISHLIST: 'TOGGLE_WISHLIST',
    REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
    REFRESH_STORE: 'REFRESH_STORE',
    SET_WISHLIST: 'SET_WISHLIST'
}

const initialState = {
    data: []
}

function wishlistReducer( state = initialState, action ) {
    switch ( action.type ) {
        case actionTypes.TOGGLE_WISHLIST:
            let product = action.payload?.product;

            let index = state?.data?.findIndex( item => item?.productVariation?.id === product?.productVariation?.id );
            let tmpData = [ ...state.data ];

            if ( index === -1 ) {
                tmpData.push( product );
            } else {
                tmpData.splice( index );
            }

            return { ...state, data: tmpData };
        case actionTypes.REMOVE_FROM_WISHLIST:
            let wishlist = state.data?.filter(el => el.variation_id !== action.payload.product); 
            return { ...state, data: wishlist };
        case actionTypes.SET_WISHLIST:
            return {
                data: action.payload.wishList || []
            }
        case actionTypes.REFRESH_STORE:
            return initialState;

        default:
    }
    return state;
}

export const wishlistActions = {
    toggleWishlist: product => ( { type: actionTypes.TOGGLE_WISHLIST, payload: { product } } ),
    setWishList: wishList => ({type: actionTypes.SET_WISHLIST, payload: {wishList}}),
    removeFromWishlist: product => ( { type: actionTypes.REMOVE_FROM_WISHLIST, payload: { product } } )
};

const persistConfig = {
    keyPrefix: "b71-",
    key: "wishlist",
    storage
}

export default persistReducer( persistConfig, wishlistReducer );