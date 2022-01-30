import { useEffect } from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';

import ALink from '../../components/features/custom-link';

import CampaignList from '../../components/campaign/campaign-list';

import { GET_CATEGORY_PRODUCT_INFO } from '../../server/queries';

function Campaign() {
    const router = useRouter();
    const query = router.query;
    const [ getProducts, { data, loading, error } ] = useLazyQuery( GET_CATEGORY_PRODUCT_INFO );
    const campaignInfo = data && data?.campaign;
    const products = data && data?.campaign?.campaignProducts?.data;
    const paginatorInfo = data && data?.campaign?.campaignProducts.paginatorInfo;

    const perPage = query.per_page ? parseInt( query.per_page ) : 15;
    const totalPage = paginatorInfo ? parseInt( paginatorInfo.total / perPage ) + ( paginatorInfo.total % perPage ? 1 : 0 ) : 1;
    const page = query.page ? query.page : 1;

    useEffect( () => {
        getProducts( {
            variables: {
                campaignId: query.slug,
                languageId: router.locale === 'en' ? 1 : 2,
                search: query.search,
                colors: query.colors ? query.colors.split( ',' ) : [],
                sizes: query.sizes ? query.sizes.split( ',' ) : [],
                brands: query.brands ? query.brands.split( ',' ) : [],
                min_price: parseInt( query.min_price ),
                max_price: parseInt( query.max_price ),
                category: query.category,
                tag: query.tag,
                sortBy: query.sortby,
                page: parseInt(page) , //perPage * ( page - 1 ),
                first: parseInt(perPage) //perPage * page
            }
        } );
    }, [ query ] );

    return (
        <main className="main">
            <Head>
                <title> B71 - Campaign </title>
            </Head>

            <nav className="breadcrumb-nav">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li>Campaign</li>
                    </ul>
                </div>
            </nav>
            {/* style={ { backgroundImage: `url(${
                            process.env.NEXT_PUBLIC_ASSET_URI + "/" + campaignInfo?.banner
                        })`, backgroundColor: "#EFEFEF" } } */}
            <div className="page-content mb-10 pb-7 full-width-banner-custom">
                <div className="container-fluid">
                    <div className="shop-banner banner text-center p-0">
                            <img src={process.env.NEXT_PUBLIC_ASSET_URI + "/" + campaignInfo?.banner} />
                        <div className="banner-content">
                            {/* <h1 className="banner-title ls-m text-uppercase text-white mb-1">
                                <strong className="mr-2 text-white">20% OFF ON</strong></h1> */}
                                {/* <h1 className="banner-subtitle text-body font-weight-normal text-white-important">{ campaignInfo?.title }</h1> */}
                            {/* <ALink href="/shop" className="btn btn-outline btn-white btn-rounded">Shop now</ALink> */}
                        </div>
                    </div>
                    <div className="row main-content-wrap gutter-lg">
                        {/* <CampaignSidebarFilter type="boxed" /> */}

                        <div className="col-lg-12 main-content">
                            <CampaignList type="boxed" products={products} loading={loading} 
                                paginatorInfo={paginatorInfo} perPage={perPage} page={page} />
                        </div>
                    </div>
                </div>
            </div>
        </main >
    )
}

export default Campaign;