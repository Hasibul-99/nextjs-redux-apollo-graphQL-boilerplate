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
        <base href="/"></base>
        <link rel="icon" href="images/icons/favicon.png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" />
        <link rel="stylesheet" type="text/css" href="vendor/riode-fonts/riode-fonts.css" />
        <link rel="stylesheet" type="text/css" href="vendor/fontawesome-free/css/all.min.css" />
        <link rel="stylesheet" type="text/css" href="vendor/owl-carousel/owl.carousel.min.css" />
        
        <meta charSet="UTF-8"/>
        <meta name="theme-color" content="#FF284F"/>
        <meta property="og:title" content="ঘরে বসে B71"/>
        <meta property="og:description" content="Bangladesh's best online shopping store with 17+ million products at resounding discounts in dhaka,
                ctg & All across Bangladesh with cash on delivery (COD)"/>
        <meta property="og:image" content={process.env.NEXT_PUBLIC_CLIENT_URI + "/images/home/Group-34092.png"}/>
        <meta property="og:image:secure_url" content={process.env.NEXT_PUBLIC_CLIENT_URI + "/images/home/Group-34092.png"}/>
        <meta property="og:image:type" content="image/jpg"/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="627"/>
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
