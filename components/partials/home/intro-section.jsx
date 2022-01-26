import React from 'react';
import Reveal from "react-awesome-reveal";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Image from "next/image"

// import Custom Components
import ALink from '~/components/features/custom-link';
import SidebarMenu from '~/components/common//partials/sidebar-menu';
import OwlCarousel from '~/components/features/owl-carousel';

import { introSlider } from '~/utils/data/carousel';
import { fadeInRightShorter, fadeInUp, fadeInLeftShorter, blurIn, fadeInDownShorter, fadeIn } from '~/utils/data/keyframes';

function IntroSection({sliders, campaigns, context}) {
    return (
        <div className="intro-section appear-animate fadeIn appear-animation-visible">
            <div className="container-fluid">
                <div className="row">
                    {
                        !context ? <div className="col-xl-3 col-lg-3 col-md-12 height-x2 category-list d-lg-block d-none top-0">
                            <SidebarMenu/>
                        </div> : ''
                    }
                    
                    <div className={!context ? "col-xl-9 col-lg-9 col-md-12" : "col-xl-12 col-lg-12 col-md-12" }>
                        <OwlCarousel adClass="intro-slider owl-theme owl-dot-inner animation-slider" options={ introSlider }>
                            {
                                sliders?.Banner?.length ? sliders.Banner.map((banner, index) => <div className="banner banner-fixed" 
                                    key={"banner-" + index}>
                                        <figure>
                                            <LazyLoadImage
                                                src={process.env.NEXT_PUBLIC_ASSET_URI + "/" + banner.link}
                                                alt="Intro Slider"
                                                effect="opacity"
                                                width="auto"
                                                // height={ 460 }
                                            />
                                        </figure>
                                    </div>) : ''
                            }
                        </OwlCarousel >

                        <OwlCarousel adClass="intro-slider owl-theme owl-dot-inner animation-slider" options={ introSlider }>
                            <div className="row mt-2 px-2">
                                {
                                    campaigns?.length ? campaigns.map((campaign, index) => <div className="col-lg-3 col-md-3 col-sm-3 height-x1" key={"campaign4-" + index}>
                                        <div className="category category-new category-absolute overlay-dark category-banner banner-radius">
                                            <ALink href={`/campaign/${campaign.id}`}>
                                                <figure className="category-media">
                                                    <Image 
                                                        layout="responsive" 
                                                        src={process.env.NEXT_PUBLIC_ASSET_URI + "/" + campaign.thumbnail} 
                                                        alt="banner" 
                                                        width={480} 
                                                        height={328} 
                                                        quality={10}/>
                                                </figure>
                                                <div className="category-content y-50 appear-animate fadeIn appear-animation-visible"
                                                    style={{ animationDuration: '1.2s' }}>
                                                    {/* <h5 className="category-name text-white mb-0">{campaign.title}</h5> */}
                                                </div>
                                            </ALink>    
                                        </div>
                                    </div>) : ''
                                }
                            </div>
                        </OwlCarousel>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo( IntroSection );