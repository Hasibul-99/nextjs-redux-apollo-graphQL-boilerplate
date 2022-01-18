import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

const actionTypes = {
    OPEN_MODAL: 'OPEN_MODAL',
    CLOSE_MODAL: 'CLOSE_MODAL',
    OPEN_QUICKVIEW: 'OPEN_QUICKVIEW',
    CLOSE_QUICKVIEW: 'CLOSE_QUICKVIEW',
    REFRESH_STORE: 'REFRESH_STORE',
    CLOSE_LOGIN_MODAL: 'CLOSE_LOGIN_MODAL',
    OPEN_LOGIN_MODAL: 'OPEN_LOGIN_MODAL'
}

const initialState = {
    type: 'video',
    openModal: false,
    quickview: false,
    singleSlug: '',
    loginModalOpen: false,
}

function modalReducer( state = initialState, action ) {
    switch ( action.type ) {
        case actionTypes.OPEN_QUICKVIEW:
            return {
                ...state,
                quickview: true,
                singleSlug: action.payload.url_key
            }

        case actionTypes.CLOSE_QUICKVIEW:
            return {
                ...state,
                quickview: false
            }

        case actionTypes.OPEN_MODAL:
            return {
                ...state,
                singleSlug: action.payload.url_key,
                openModal: true
            }

        case actionTypes.CLOSE_MODAL:
            return {
                ...state,
                openModal: false
            }
        case actionTypes.OPEN_LOGIN_MODAL:
            return {
                ...state,
                loginModalOpen: true,
            }
        case actionTypes.CLOSE_LOGIN_MODAL:
            return {
                ...state,
                loginModalOpen: false,
            }
        case actionTypes.REFRESH_STORE:
            return initialState;

        default:
            return state;
    }
}

export const modalActions = {
    openModal: url_key => ( { type: actionTypes.OPEN_MODAL, payload: { url_key } } ),
    closeModal: modalType => ( { type: actionTypes.CLOSE_MODAL, payload: { modalType } } ),
    openQuickview: url_key => ( { type: actionTypes.OPEN_QUICKVIEW, payload: { url_key } } ),
    closeQuickview: () => ( { type: actionTypes.CLOSE_QUICKVIEW } ),
    openLoginModal: () => ( {type: actionTypes.OPEN_LOGIN_MODAL} ),
    closeLoginModal: () => ( {type: actionTypes.CLOSE_LOGIN_MODAL} ),
};

const persistConfig = {
    keyPrefix: "b71-",
    key: "modal",
    storage
}

export default persistReducer( persistConfig, modalReducer );