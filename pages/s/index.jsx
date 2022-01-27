import React from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';

import ALink from '../../components/features/custom-link';

import SidebarFilterOne from '../../components/partials/shop/sidebar/sidebar-filter-one'
import ProductListOne from '../../components/partials/shop/product-list/product-list-one';

import { PRODUCT_SEARCH_UNI, GET_CATEGORY_SHORT_INFO } from '../../server/queries';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useState } from 'react';

function ShopBoxedBanner() {
    const router = useRouter();
    const query = router.query;
    const [search, setSearch] = useState();
    const [categoryInfo, getCategoryInfo] = useState();

    const [serachProduct] = useMutation( PRODUCT_SEARCH_UNI, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        }
    });
    const [ getCategoryImege, { data } ] = useLazyQuery( GET_CATEGORY_SHORT_INFO, {
        onCompleted(data) {
            getCategoryInfo(data?.categoryDetails);

            console.log("categoryInfo", data?.categoryDetails);
        }
    } );

    const generateSearchQuery = () => {
        let filterQuery = {
            language_id: router.locale === 'en' ? 1 : 2,
            "size": query.per_page ? parseInt( query.per_page ) : 12,
            "page": query.page ? query.page : 1,
        };

        if (query.category) filterQuery.cat = query.category;
        if (query.search) filterQuery.q = query.search;

        // Price filter
        if (query.min_price && query.max_price) {
            filterQuery.min_price = query.min_price;
            filterQuery.max_price = query.max_price;
        }

        // Rating filter
        if (query.min_range && query.max_range) {
            filterQuery.min_rating = query.min_range;
            filterQuery.max_rating = query.max_range;
        }

        // sort filter 
        if (query.sortby) {
            filterQuery.sort_field = query.sortby;
        }

        // Attribute 
        let dynaAttri = [];
        for (const key in query) {
            let notAllow = ['sortby', 'min_range', 'max_range', 'min_price', 'max_price', 'category', 'search', 'grid', 'page', 'type'];
            
            if (!(notAllow.includes(key))) {
                let data = {
                    "field": key,
                    "values": [query[key]]
                };
    
                dynaAttri.push(data);
            }
        };

        if (dynaAttri?.length) {
            filterQuery.attr = dynaAttri;
        }

        return JSON.stringify(filterQuery);
    }

    const processSerchProduct = async () => {
        let res = await serachProduct({
            variables: { 
                "searchQuery": generateSearchQuery()
            }
        });

        if (res?.data?.ProductSearchUni) {
            setSearch(res?.data?.ProductSearchUni)
        }
    } 

    useEffect(() => {
        processSerchProduct();

        if (query.category) {
            getCategoryImege( { variables: {
                "urlKey": query.category
            } } );
        } else {
            getCategoryInfo(null);
        }
    }, [query]);

    return (
        <main className="main">
            <Head>
                <title>B71 - ECommerce Store | Product List</title>
            </Head>

            <nav className="breadcrumb-nav">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li>Shop</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content mb-10 pb-7">
                <div className="container-fluid">
                    <div className="row main-content-wrap gutter-lg">
                        <SidebarFilterOne type="boxed" layered_data={search?.layered_data} 
                            priceRange={{max_price: search?.max_price, min_price: search?.min_price}} 
                            reviewRange={{max_review: 5, min_review: 1}}/>

                        <div className="col-lg-9 main-content">
                            <button className='btn btn-secondary btn-rounded mb-3 back-button-for-mobile'>Go Back</button>

                            {
                                categoryInfo?.image ? <div className="shop-banner banner mb-4"
                                    style={ { backgroundImage: `url(${process.env.NEXT_PUBLIC_ASSET_URI + "/" + categoryInfo?.image})`, backgroundColor: "#EFEFEF" } }>
                                    {/* <div className="banner-content">
                                        <h1 className="banner-title ls-m text-uppercase"><strong
                                            className="mr-2">-50<sup>%</sup></strong><span
                                                className="font-weight-normal"><strong className="d-block">Sporting</strong>Goods
                                                Sale</span></h1>
                                        <h4 className="banner-subtitle text-body font-weight-normal">Spring/summer 2020
                                            collection</h4>
                                        <ALink href="/s" className="btn btn-outline btn-dark btn-rounded">Shop now</ALink>
                                    </div> */}
                                </div> : ''
                            }
                            
                            
                            {
                                search?.product ? <ProductListOne type="boxed" 
                                products={ JSON.parse(search?.product)} count={search?.result_count} /> : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main >
    )
}

export default ShopBoxedBanner;


// {
//     "q": "quo",                                                                          done
//     "cat": "ut-odio-perspiciatis-cum-consequatur-molestia",                              done 
//     "size": "10",                                                                        done
//     "page": "1",                                                                         done
//     "attr": [
//       {
//         "field": "Resolution English",
//         "values": [
//           "720"
//         ]
//       },
//       {
//         "field": "Processor type English",
//         "values": [
//           "1 Core"
//         ]
//       }
//     ],
//     "language_id": "1",                                                                  done
//     "sort_field": "product_variation.price", {product_variation.price, rating_average, latest, oldest}
//     "order": "desc",
//     "min_price": "100",                                                                  done
//     "max_price": "10000",                                                                done
//     "min_rating": "0",
//     "max_rating": "5"
// }