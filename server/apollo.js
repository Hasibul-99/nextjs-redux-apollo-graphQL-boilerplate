import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import Cookies from 'js-cookie'


const API_URI = `${ process.env.NEXT_PUBLIC_SERVER_URL }/graphql`;
const token = Cookies.get('b71_access_token');

let apolloClient;

// export const createApolloClient = new ApolloClient({
//   uri: API_URI,
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           links: relayStylePagination(),
//         },
//       },
//     },
//   }),
//   ssrMode: typeof window === "undefined", // set to true for SSR
// });

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined", // set to true for SSR
    link: new HttpLink({
      uri: API_URI,
      headers: {
        authorization: token ? `Bearer ${token}` : "hello",
      }
    }),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}