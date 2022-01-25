import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery, useLazyQuery } from '@apollo/client';
import imagesLoaded from 'imagesloaded';
import { GET_PRODUCT_INFO, GET_PRODUCT_INFO_QUERY } from '../../server/queries';

import OwlCarousel from '../../components/features/owl-carousel';
import ProductSidebar from '../../components/product/product-sidebar';
import MediaFive from '../../components/product/media/media';
import DetailThree from '../../components/product/detail/detail';
import DescOne from '../../components/product/desc/desc-one';
import NewCollection from '../../components/home/new-collection';

import { mainSlider17 } from '../../utils/data/carousel';
import { productImage } from "../../utils";


function ProductStickyInfo({content, metaTags}) {
  const slug = useRouter().query.slug;
  if ( !slug ) return '';
  
  const [ loaded, setLoadingState ] = useState( false );
  const product = content && content.product;
  const related = product?.relatedProduct ? product?.relatedProduct : []; // remove in future

  const [selectedVarient, setSelectedVarient] = useState()

  const chnageVarient = (varients) => {
      setSelectedVarient(varients);
  }
  
  useEffect( () => {
      if ( product ) {
          imagesLoaded( 'main' ).on( 'done', function () {
              setLoadingState( true );
          } ).on( 'progress', function () {
              setLoadingState( false );
          } );
      }  
      if ( !product ) setLoadingState( false )
  }, [ product ] );

  return (
      <main className="main single-product custom-bg-color-one pt-5">
          <Head>
              <title> { product?.productDetail[0]?.name } </title>
              {/* <meta charset="UTF-8"></meta>
              <meta name="theme-color" content="#FF284F"></meta>
              <meta name="description" content={product?.productDetail[0]?.short_description}></meta>
              <meta property="og:title" content={ product?.productDetail[0]?.name }/>
              <meta property="og:site_name" content={window.location.href}/>

              <meta property="og:description" content={product?.productDetail[0]?.short_description}/>
              <meta property="og:image" content={productImage(product)}/>
              <meta property="og:image:secure_url" content={productImage(product)}/>
              <meta property="og:image:type" content="image/*"></meta>
              <meta property="og:image:width" content="1200"/>
              <meta property="og:image:height" content="627"/>
              <meta property="fb:pages" content="340302609456794,213778865764136"/>
              

              <meta name="og:url" content={window.location.href} />
              <meta name="og:title" content={ product?.productDetail[0]?.name } />
              <meta name="og:type" content="product" />
              <meta name="og:description" content={product?.productDetail[0]?.short_description} />
              <meta name="og:image" content={productImage(product)} /> */}
              
              {metaTags && Object.keys(metaTags).length &&
                  Object.entries(metaTags).map((entry) => (
                      <meta title={entry[0]} content={entry[1]} />
                  ))
              }
          </Head>

          {
              product ?
                  <div className={ `page-content single-product-content` }>
                      <div className="container-fluid skeleton-body">
                          <div className="row">
                              <ProductSidebar shippingCharge={product?.shippingCharge} />

                              <div className="col-lg-9">
                                  <div className="product product-single pt-4 pr-4 pb-4 pl-4 mb-4 bg-white">
                                      <div className="row">
                                          <div className="col-md-6">
                                              <MediaFive product={ product } adClass='pb-0' selectedVarient={selectedVarient} />
                                          </div>

                                          <div className="col-md-6">
                                              <DetailThree data={ content } changeVarient={ chnageVarient } />
                                          </div>
                                      </div>
                                  </div>

                                  <DescOne product={ product } isDivider={ false } />
                              </div>
                          </div>
                          {
                              related?.length ? <div className="row mt-4 related-product">
                                  <div className="col-lg-12">
                                      <NewCollection products={ related } productTitle={"Related Products"} addClass={'pl-3 pr-3'} />
                                  </div>
                              </div> : ''
                          }
                      </div>
                  </div> : ''
          }
          {
              product ? ''
                  : <div className="skeleton-body container mb-10">
                      <div className="row mt-8 gutter-lg">
                          <div className="col-lg-3 right-sidebar sidebar-fixed sticky-sidebar-wrapper">
                              <div className="sidebar-content">
                                  <div className="widget-2"></div>
                              </div>
                          </div>
                          <div className="col-lg-9">
                              <div className="row mb-4">
                                  <div className="col-md-6">
                                      <div className="skel-pro-gallery"></div>
                                  </div>

                                  <div className="col-md-6">
                                      <div className="skel-pro-summary"></div>
                                  </div>
                              </div>

                              <div className="skel-pro-tabs"></div>

                              <section className="pt-3 mt-4">
                                  <h3 className="title justify-content-center">Related Products</h3> 
                                  <OwlCarousel adClass="owl-carousel owl-theme owl-nav-full" options={ mainSlider17 }>
                                      {
                                          [ 1, 2, 3, 4, 5, 6 ].map( ( item ) =>
                                              <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                                          )
                                      }
                                  </OwlCarousel>
                              </section>
                          </div>
                      </div>
                  </div>
          }
      </main>
  )
}

ProductStickyInfo.getInitialProps = async ( ctx ) => {
  let results = await fetch(`${ process.env.NEXT_PUBLIC_SERVER_URL }/graphql`, {
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          query: GET_PRODUCT_INFO_QUERY,
          variables: {
              urlKey: ctx.query.slug, 
              languageId: ctx?.locale === 'en' ? 1 : 2,
              first: 5 
          }})
      })
      let content = await results.json();
      let product = content && content?.data?.product;

      const metaTags = {
          "og:title": product?.productDetail[0]?.name,
          "og:description": product?.productDetail[0]?.short_description,
          "og:image": productImage(product),
          "og:url": `${(process.env.NEXT_PUBLIC_CLIENT_URI || 'https://b71-stage.sslwireless.com') + '/product/' + product?.url_key}`,
      };

      return {
          content: content.data,
          metaTags
      }
};

export default ProductStickyInfo;