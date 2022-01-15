// import App, { Container } from "next/app";

import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { PersistGate } from 'redux-persist/integration/react';

import makeStore from "../store";
import '../styles/globals.css'

function MyApp({ Component, pageProps, store }) {
  return <Provider store={store}>
            <PersistGate
                persistor={ store?.__persistor }
                loading={ <div className="loading-overlay">
                    <div className="bounce-loader">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                        <div className="bounce4"></div>
                    </div>
                </div> }>

                <Component {...pageProps} />
            </PersistGate>
          </Provider>
}

export default withRedux(makeStore)(MyApp);
