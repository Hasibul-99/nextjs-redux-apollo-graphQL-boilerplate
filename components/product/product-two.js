import React from 'react';
import { connect } from 'react-redux';
import Image from "next/image";
import { useRouter } from 'next/router';
import Router from 'next/router';

import { useMutation } from '@apollo/client';
import ALink from '../features/custom-link';

import { toast } from 'react-toastify';
import { cartActions } from '../../store/cart';
import { modalActions } from '../../store/modal';
import { wishlistActions } from '../../store/wishlist';
import { ADD_WISHLIST_MUTATION, ADD_TO_CART } from '../../server/queries';
import CartPopup from '../partials/cart-popup';

import { toDecimal, productImage, canShowSpecialPrice, isInstock } from '../../utils';

function ProductTwo( props ) {
    const router = useRouter();
    const { product, adClass = 'text-center', toggleWishlist, wishlist, cartList, setWishList,
    openQuickview, imageWidth, imageHight, isUserLogin,
    price, addMultipleCarts } = props;

    // decide if the product is wishlisted
    let isWishlisted;
    isWishlisted = wishlist.findIndex( item => item?.productVariation?.product_id == product?.id ) > -1 ? true : false;

    const [ addNewWish ] = useMutation( ADD_WISHLIST_MUTATION, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
                
                if (graphQLErrors[0].message === "Invalid User") {
                    Router.reload("/");
                }
            }
        }
    });

    const [addToCard] = useMutation(ADD_TO_CART, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
                if (graphQLErrors[0].message === "Unauthenticated.") {
                    Router.reload("/");
                }
            }
        }
    })

    const wishlistHandler = async ( e ) => {
        e.preventDefault();

        if (isWishlisted) {
            toast.warning(<span className='py-5'>&nbsp; This product already added to your wishlist! &nbsp;</span>);
        } else {
            if ( toggleWishlist ) {
                let currentTarget = e.currentTarget;
                    currentTarget.classList.add( 'load-more-overlay', 'loading' );
    
                if (product?.productVariation[0]?.id) {
                    let res = await addNewWish({
                        variables: {variationId: product?.productVariation[0].id * 1 }
                    });
    
                    if (res) {
                        currentTarget.classList.remove( 'load-more-overlay', 'loading' );
                        setWishList( res?.data?.createWishlist?.wishlistItems );
                        toast.success(" Wish Added Successfully! ")
                    }
                }
            }
        }
    }

    const addToCartHandler = async ( e ) => {
        e.preventDefault();

        let cartItem = [],
            varientOne = product?.productVariation[ 0 ];

        let findCartVer = cartList?.length ? cartList.find(cart => cart?.variation_id === varientOne?.id) : null;

        if (varientOne?.qty && (!findCartVer || (findCartVer?.qty < varientOne?.qty))) {
            cartItem.push({qty: 1, variation_id: varientOne?.id});
        
            let res = await addToCard({
                variables: {
                    cartItems: JSON.stringify(cartItem),
                    languageId: router.locale === 'en' ? 1 : 2
                }
            });
    
            if (res) {
                addMultipleCarts(res?.data?.addToCart?.cartItems || []);
                toast( <CartPopup product={ product } quality={1} /> )
            }
        }  else {
            toast.error(<span> &nbsp; Product not available! &nbsp; </span>)
        }
        
    }

    return (
        <div className={ `product product-two-content text-left ${ adClass }` }>
            <figure className="product-media">
                <ALink href={ `/product/${ product?.url_key }` }>
                    <Image
                        alt={ product?.url_key }
                        src={productImage(product)}
                        // src={ product?.productVariation[0]?.productVariationImage[0]?.image_path 
                        //     ? process.env.NEXT_PUBLIC_ASSET_URI + "/" + product?.productVariation[0]?.productVariationImage[0]?.image_path : "/images/B71_02.png" }
                        width={imageWidth || 350}
                        height={imageHight || 350}
                        quality={10}
                        responsive="true"
                        blurDataURL="/images/product-banner.png"
                    />
                </ALink>

                <div className="product-label-group">
                    { product?.is_new ? <label className="product-label label-new">New</label> : '' }
                    { product?.is_top ? <label className="product-label label-top">Top</label> : '' }
                    {
                        product?.discount > 0 ?
                            product?.variants.length === 0 ?
                                <label className="product-label label-sale">{ product?.discount }% OFF</label>
                                : <label className="product-label label-sale">Sale</label>
                            : ''
                    }
                </div>

                <div className="product-action-vertical">
                    {
                        isUserLogin ? <a href="#" className="btn-product-icon btn-cart" title="Add to cart" onClick={ addToCartHandler }>
                            <i className="d-icon-bag"></i>
                        </a> : ''
                    }
                    {
                        isUserLogin ? <a className="btn-product-icon btn-wishlist" 
                            title={ isWishlisted ? 'Remove from wishlist' : 'Add to wishlist' } 
                                onClick={ wishlistHandler }>
                                <i className={ isWishlisted ? "d-icon-heart-full" : "d-icon-heart" }></i>
                            </a> : ''
                    }
                </div>

                {/* <div className="product-action">
                    <ALink href="#" className="btn-product btn-quickview" title="Quick View" 
                        onClick={ showQuickviewHandler }>Quick View</ALink>
                </div> */}
            </figure>

            <div className="product-details">
                <h3 className="product-name">
                    <ALink href={ `/product/${ product?.url_key }` }>{ product?.productDetail[0]?.name }</ALink>
                </h3>

                <div className="product-price">
                    {
                        canShowSpecialPrice(product?.productVariation[0]) ? <>
                            <ins className="new-price">৳{price ? price : canShowSpecialPrice(product?.productVariation[0])}</ins>
                            <del className="old-price">৳{product?.productVariation[0]?.price || 0}</del>
                        </> : <>
                            <ins className="new-price">৳{product?.productVariation[0]?.price || 0}</ins>
                        </>
                    }
                </div>

                <div className="ratings-container">
                    <div className="ratings-full">
                        <span className="ratings" style={ { width: 20 * product?.ratingAverage + '%' } }></span>
                        <span className="tooltiptext tooltip-top">{ toDecimal( product?.ratingAverage ) || "0.00" }</span>
                    </div>

                    <ALink href={ `/product/${ product?.url_key }` } className="rating-reviews">( 
                        { product?.review_count ? product?.review_count : product?.reviews?.paginatorInfo?.total ?  product?.reviews?.paginatorInfo?.total : 0 } reviews )
                    </ALink>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        wishlist: state.wishlist.data ? state.wishlist.data : [],
        isUserLogin: state.user.isUserLogin,
        cartList: state.cart.data ? state.cart.data : [],
    }
}

export default connect( mapStateToProps, { toggleWishlist: wishlistActions.toggleWishlist, setWishList: wishlistActions.setWishList,
    addMultipleCarts: cartActions.addMultipleCarts, ...modalActions } )( ProductTwo );