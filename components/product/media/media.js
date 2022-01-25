import { useState, useEffect } from 'react';
import { Magnifier } from 'react-image-magnifiers';

import ALink from '../../features/custom-link';
import OwlCarousel from '../../features/owl-carousel';

import ThumbTwo from '../thumb/thumb';
import MediaLightBox from '../light-box';

import { mainSlider3 } from '../../../utils/data/carousel';

export default function MediaFive( props ) {
    const { product, adClass = '', selectedVarient } = props;
    const [ index, setIndex ] = useState( 0 );
    const [ mediaIndex, setMediaIndex ] = useState( 0 );
    const [ isOpen, setOpenState ] = useState( false );
    const [ mediaRef, setMediaRef ] = useState( 'null' );
    const [ lgImages, setLgImages ] = useState();
    const [ allVerientImages, setAllVerientImages ] = useState();

    const manageLgImage = () => {
        if (product?.productVariation?.length) {
            let allImages = [];
            product.productVariation.forEach(variantion => {
                variantion?.productVariationImage.forEach(images => {
                    allImages.push(images)
                })
            });

            if (allImages?.length) {
                setAllVerientImages(allImages);
                setLgImages(allImages);
            }
        }
    };

    const setIndexHandler = ( mediaIndex ) => {
        if ( mediaIndex !== index ) {
            setIndex( mediaIndex );
        }
    }

    const changeRefHandler = ( carRef ) => {
        if ( carRef.current !== undefined ) {
            setMediaRef( carRef );
        }
    }

    const changeOpenState = openState => {
        setOpenState( openState );
    }

    const openLightBox = () => {
        setOpenState( true );
    }

    let events = {
        onTranslate: function ( e ) {
            if ( !e.target ) return;
            if ( document.querySelector( '.product-thumbs' ) ) {
                document.querySelector( '.product-thumbs' ).querySelector( '.product-thumb.active' ).classList.remove( 'active' );
                document.querySelector( '.product-thumbs' ).querySelectorAll( '.product-thumb' )[ e.item.index ].classList.add( 'active' );
            }
        }
    }

    useEffect(() => {
        if (selectedVarient?.length && allVerientImages?.length) {
            let images = [];

            allVerientImages.forEach(img => {
                let index = selectedVarient.findIndex(verId => verId === img.variation_id);

                if (index !== -1) {
                    images.push(img)
                }
            });

            setLgImages(images);
        } else {
            manageLgImage(); 
        }
    }, [selectedVarient])
    
    useEffect(() => {
        manageLgImage();
    }, [product?.productVariation]);

    useEffect( () => {
        setIndex( 0 );
    }, [ window.location.pathname ] )

    useEffect( () => {
        if ( mediaRef !== 'null' && mediaRef.current !== 'null' && index >= 0 ) {
            mediaRef?.current?.$car?.to( index, 300, true );
        }
    }, [ index ] )

    return (
        <div className={ `product-gallery product-gallery-vertical product-gallery-sticky ${ adClass }` }>
            <div className="product-label-group">
                {
                    product?.productVariation && product?.productVariation[0].qty === 0 ?
                        <label className="product-label label-out">out</label> : ""
                }

                {/* {
                    product?.is_top ?
                        <label className="product-label label-top">top</label> : ""
                }

                {
                    product?.is_new ?
                        <label className="product-label label-new">new</label> : ""
                }

                {
                    product.discount ?
                        <label className="product-label label-sale">sale</label> : ""
                } */}
            </div>

            <OwlCarousel adClass="product-single-carousel owl-theme owl-nav-inner"
                options={ mainSlider3 }
                onChangeIndex={ setIndexHandler }
                onChangeRef={ changeRefHandler }
                events={ events }
            >
                {
                    lgImages?.length ? lgImages.map( ( image, index ) =>
                        <div key={ image + '-' + index }>
                            <Magnifier
                                imageSrc={ process.env.NEXT_PUBLIC_ASSET_URI + "/" + image?.image_path }
                                imageAlt="magnifier"
                                largeImageSrc={ process.env.NEXT_PUBLIC_ASSET_URI + "/" + image?.image_path }
                                dragToMove={ false }
                                mouseActivation="hover"
                                cursorStyleActive="crosshair"
                                className="product-image large-image"

                            />
                        </div>
                    ) : <div key={ "image-demo" }>
                            <Magnifier
                                imageSrc={ "/images/product-banner.png" }
                                imageAlt="magnifier"
                                largeImageSrc={ "/images/product-banner.png" }
                                dragToMove={ false }
                                mouseActivation="hover"
                                cursorStyleActive="crosshair"
                                className="product-image large-image"
                            />
                        </div>
                }
            </OwlCarousel>

            <ALink href="#" className="product-image-full" onClick={ openLightBox }><i className="d-icon-zoom"></i></ALink>

            <ThumbTwo productImages={lgImages} index={ index } onChangeIndex={ setIndexHandler } />

            <MediaLightBox images={ lgImages } isOpen={ isOpen } 
                changeOpenState={ changeOpenState } index={ index } product={ product } />
        </div>
    )
}