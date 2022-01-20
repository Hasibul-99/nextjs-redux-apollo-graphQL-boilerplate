import Head from 'next/head';
import { initializeApollo  } from "../server/apollo";

// Import Apollo Server and Query
import { GET_HOME_DATA, GET_HOME_DATA_QUERY } from '../server/queries';

// import Home Components
import NewCollection from '../components/home/new-collection';
import IntroSection from '../components/home/intro-section';


export default function Home({ homeContent }) {
  const product = homeContent && homeContent?.webStorefrontHomeContent;

  return (
    <div className="main home mt-lg-4 homepage">
      <Head>
        <title> B71 - ECommerce Store </title>
      </Head>

      <div className="page-content">
          <IntroSection sliders={product?.slider} campaigns={product?.campaign}/>
          
          <div className='container-fluid'>
              {
                  product?.new_arrival_products?.length ? <NewCollection products={ product?.new_arrival_products || []} 
                  productTitle={"New Arrivals"} loading={ !product?.new_arrival_products?.length } /> : ''
              }
              {
                  product?.best_selling_products?.length ? <NewCollection products={ product?.best_selling_products || []} 
                      productTitle={"Best Selling"} loading={ !product?.new_arrival_products?.length } /> : ''
              }

              {
                  product?.featured_products?.length ? <NewCollection products={ product?.featured_products || [] } 
                      productTitle={"Featured Products"} loading={ !product?.new_arrival_products?.length } /> : ''
              }
          </div>
      </div>

    </div>
  )
}

export async function getStaticProps(ctx) {
  const apolloClient = initializeApollo();

  let homeContent = await apolloClient.query({
    query: GET_HOME_DATA,
    variables: {
      sliderPosition: 'home', 
      languageId: ctx?.locale === 'en' ? 1 : 2,
      first: 5 
    }
  });

  return {
    props: {
      homeContent: homeContent.data,
    },
    revalidate: 1,
  };
}
