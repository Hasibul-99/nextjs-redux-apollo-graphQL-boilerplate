import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from "@apollo/client";
import { useApollo, initializeApollo  } from "../server/apollo";

import Layout from '../components/layout';
import Footer from "../components/common/footer";

import makeStore from "../store";

import { CMS_CONTENT_QUERY, CMS_CONTENT } from '../server/queries';

import "../public/sass/style.scss";
import { useEffect } from "react";

function MyApp({ Component, pageProps, store, FooterContent }) {
  const apolloClient = useApollo(pageProps?.initialApolloState);

  useEffect(() => {

    console.log("apolloClient", pageProps);
  }, [pageProps])


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
                    <Footer FooterContent={FooterContent?.data}/>
                  </Layout>
              </PersistGate>
            </Provider>
          </ApolloProvider>
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: CMS_CONTENT,
  });

  console.log("res", await res.json());
  let content = await results.json();

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    },
    revalidate: 1,
  };
}

export default withRedux(makeStore)(MyApp);
