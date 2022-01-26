
import React, { Fragment, useState } from 'react';
import Head from 'next/head';
import moment from "moment";

import { useRouter } from 'next/router';
import Reveal from "react-awesome-reveal";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '../../components/features/custom-link';
// import IntroSection from '../../components/campaign/landing/intro-section';

// import SidebarFilterOne from '../../components/partials/shop/sidebar/sidebar-filter-one'
// import ProductListOne from '../../components/partials/shop/product-list/product-list-one';

// import ProductTwo from '../../components/features/product/product-two';

// import Custom Components
import OwlCarousel from '../../components/features/owl-carousel';

import { introCampaignSlider } from '../../utils/data/carousel';
import { fadeInUpShorter, fadeInRightShorter, fadeInDownShorter, fadeInLeftShorter } from '../../utils/data/keyframes';

import { useQuery } from '@apollo/client';

import { CAMPAIGNS_LIST } from '../../server/queries';

import NewCollection from '../../components/home/new-collection';

function Campaign() {
    const router = useRouter();
    const [bannerSlider, setBannerSlider] = useState([]);
    const [campaigns, setCampaigns] = useState([])

    const { data, loading, error } = useQuery( CAMPAIGNS_LIST, { variables: { 
        "slug": "campaign",
        "first": 100,
        "campaignProductsFirst2": 10,
        "languageId": router.locale === 'en' ? 1 : 2
     },
        onCompleted(data) {
            setBannerSlider(data?.slider?.Banner);

            let campaigns = data?.campaigns?.data;
            if (campaigns) {
                let list = [];

                campaigns.forEach(cam => {
                    if (isUnderCampaign(cam)) {
                        list.push(cam)
                    }
                });

                setCampaigns(list);
            };
        } 
    } );

    // const bannerSlider = data && data.slider.Banner;
    // const campaigns = data && data.campaigns.data;

    const isUnderCampaign = (campaign) => {
        if ( campaign && campaign.end_date && campaign.start_date && 
            moment().isAfter(campaign.start_date) && moment().isBefore(campaign.end_date)) {
                return true;
        } else return false;
    };


    return (
        <main className="main">
            <Head> <title>B71 - Campaign </title> </Head>
            
            <nav className="breadcrumb-nav">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        {/* <li><ALink href="/">Category</ALink></li> */}
                        <li>Campaign</li>
                    </ul>
                </div>
            </nav>

            {
                loading && !data ? <div className="row product-wrapper cols-2 cols-sm-3 cols-md-4">
                        {
                            [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                            )
                        }
                    </div> : ''
            }

            <div className="page-content">
                <div className="container-fluid">
                    {/* <IntroSection /> */}
                    <section className="intro-section">
                        {
                            bannerSlider?.length ? <Fragment>
                                <div className="row mb-3">
                                    <div className="col-lg-12 col-sm-12">
                                        <Reveal keyframes={fadeInRightShorter} delay={400} duration={1000} 
                                        className="h-100">
                                            <OwlCarousel adClass="intro-slider campaign-slider animation-slider owl-carousel owl-theme owl-dot-inner row cols-1 gutter-no" 
                                            options={introCampaignSlider}>
                                                
                                                {
                                                   bannerSlider.map((banner, index) => <div className="intro-slide1 banner banner-fixed" key={index}>
                                                    <figure>
                                                        <LazyLoadImage
                                                            src={ process.env.NEXT_PUBLIC_ASSET_URI + "/" + banner.link }
                                                            alt="Intro Slider"
                                                            effect="opacity"
                                                            width="auto"
                                                            height={ 460 }
                                                        />
                                                    </figure>
                                                </div>) 
                                                }
                                            </OwlCarousel>
                                        </Reveal>
                                    </div>
                                </div>
                            </Fragment> : ''
                        }

                        {
                            campaigns?.length ? <section className="campaign-section">
                            <div className="container-fluid p-0">
                                {
                                    campaigns.map(campaign => <Fragment>
                                        {
                                            isUnderCampaign(campaign) ? <>
                                                <div className="col-md-12 text-center mb-3">
                                                    <ALink href={"/campaign/" + campaign.id}> 
                                                        <img src={ process.env.NEXT_PUBLIC_ASSET_URI + "/" + campaign.banner } alt/> 
                                                    </ALink> 
                                                </div>
                                                {
                                                    campaign?.campaignProducts?.data?.length ? <NewCollection products={ campaign?.campaignProducts?.data || [] } 
                                                        productTitle={campaign?.title} loading={ loading } context="campaign" campaignId={campaign.id} /> : ''
                                                }
                                            </> : ''
                                        }
                                        
                                    </Fragment>)
                                }
                            </div>  {/* end container fluid    */} 
                        </section> : <div className="page-content mb-10 pb-7 col-4 m-auto full-width-banner-custom text-center">
                                    <h5> Campaigns Coming Soon! </h5>

                                <img src="images/campaign/no-campaign.png" />
                            </div>
                        }
                        
                    </section>
                </div>
            </div>
        </main >
    )
}

export default Campaign;