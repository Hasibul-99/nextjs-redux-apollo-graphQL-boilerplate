import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../server/apollo";

import Layout from '../components/layout';

import makeStore from "../store";
import "../public/sass/style.scss";

function MyApp({ Component, pageProps, store }) {
  const apolloClient = useApollo(pageProps?.initialApolloState);

  return  <ApolloProvider client={apolloClient}>
            <Provider store={store}>
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

                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
              </PersistGate>
            </Provider>
          </ApolloProvider>
}

export default withRedux(makeStore)(MyApp);
