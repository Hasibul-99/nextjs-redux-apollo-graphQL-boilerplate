import React from 'react';
import Reveal from 'react-awesome-reveal';
import { useRouter } from 'next/router';

import OwlCarousel from '../features/owl-carousel';

import ProductTwo from '../product/product-two';
import ALink from '../features/custom-link';

import { productSlider } from '../../utils/data/carousel';
import { fadeIn } from '../../utils/data/keyframes';
// Language 
import useTranslation from "next-translate/useTranslation";


function NewCollection( props ) {
    let {t} = useTranslation();
    const { products, productTitle, loading, context, campaignId, addClass } = props;
  
    const router = useRouter();
    
    return (
        <Reveal keyframes={ fadeIn } delay={ 300 } duration={ 1200 } triggerOnce>
            <section className={`mt-0 mb-5 card-product-content pt-0 pb-0 ${addClass}  ${router.pathname !== '/' ? " bg-white" : ''}`}>
                <h2 className="title title-line title-underline with-link"><span>{productTitle}</span>
                    <ALink href={ campaignId ? { pathname: `/campaign/${campaignId}` } : { pathname: "/s" } }
                    className="font-weight-bold">{t('common:see_all')} <i className="d-icon-angle-right"></i></ALink>
                </h2>

                {
                    loading ?
                        <OwlCarousel adClass="owl-theme owl-nav-full" options={ productSlider }>
                            {
                                [ 1, 2, 3, 4, 5 ].map( ( item ) =>
                                    <div className="product-loading-overlay" key={ 'new-skel-' + item }></div>
                                )
                            }
                        </OwlCarousel>
                        :
                        <OwlCarousel adClass="owl-theme owl-nav-full" options={ productSlider }>
                            {
                                products && products.map( ( item, index ) =>
                                    <ProductTwo
                                        newLabel={ false }
                                        product={ context === 'campaign' ? item?.productVariation?.productDetails : item }
                                        adClass="text-left"
                                        key={ `new-product ${ index }` }
                                    />
                                )
                            }
                        </OwlCarousel>
                }
            </section>
        </Reveal>
    )
}

export default React.memo( NewCollection );
