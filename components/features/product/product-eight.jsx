import React from 'react';
import { connect } from 'react-redux';
import Image from "next/image";
import { useRouter } from 'next/router';

import ALink from '~/components/features/custom-link';

import { cartActions } from '~/store/cart';
import { modalActions } from '~/store/modal';
import { wishlistActions } from '~/store/wishlist';
import { ADD_WISHLIST_MUTATION, ADD_TO_CART } from '~/server/queries';
import { useMutation } from '@apollo/react-hooks';
import CartPopup from '~/components/features/product/common/cart-popup';
import { toast } from 'react-toastify';

import { toDecimal, productImage, canShowSpecialPrice } from '~/utils';

function ProductEight( props ) {
    const router = useRouter();
    const { product, adClass, toggleWishlist, wishlist, openQuickview, setWishList, cartList,
            price, addMultipleCarts, isUserLogin, openLoginModal } = props;

    // decide if the product is wishlisted
    let isWishlisted;
    isWishlisted = wishlist.findIndex( item => item?.productVariation?.product_id == product?.id ) > -1 ? true : false;

    const [ addNewWish ] = useMutation( ADD_WISHLIST_MUTATION, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        }
    });

    const [addToCard] = useMutation(ADD_TO_CART, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        }
    })

    const showQuickviewHandler = () => {
        openQuickview( product?.slug );
    }

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
                        setWishList( res?.data?.createWishlist?.wishlistItems );
                        
                        setTimeout( () => {
                            currentTarget.classList.remove( 'load-more-overlay', 'loading' );
                        }, 1000 );
                        toast.success(" Wish Added Successfully! ")
                    }
                }
            }
        }
    }

    const addToCartHandler = async ( e ) => {
        e.preventDefault();

        if (isUserLogin && product?.productVariation[ 0 ]?.id) {
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
            } else {

            }
        } else {
            openLoginModal();
        }
    }

    return (
        <div className={ `product product-list ${ adClass } ${ product?.productVariation?.length > 0 ? 'product-variable' : '' }` }>
            <figure className="product-media">
                <Image
                    alt={ product?.url_key }
                    src={productImage(product)}
                    width={300}
                    height={300}
                    quality={90}
                    placeholder="blur"
                    responsive="true"
                    blurDataURL="/images/product-banner.png"
                />

                <div className="product-label-group">
                    {/* { product.is_new ? <label className="product-label label-new">New</label> : '' }
                    { product.is_top ? <label className="product-label label-top">Top</label> : '' }
                    {
                        product.discount > 0 ?
                            product.variants.length === 0 ?
                                <label className="product-label label-sale">{ product.discount }% OFF</label>
                                : <label className="product-label label-sale">Sale</label>
                            : ''
                    } */}
                </div>
            </figure>

            <div className="product-details">
                <div className="product-cat">
                    {/* {
                        product.categories ?
                            product.categories.map( ( item, index ) => (
                                <React.Fragment key={ item.name + '-' + index }>
                                    <ALink href={ { pathname: '/shop', query: { category: item.slug } } }>
                                        { item.name }
                                        { index < product.categories.length - 1 ? ', ' : "" }
                                    </ALink>
                                </React.Fragment>
                            ) ) : ""
                    } */}
                </div>

                <h3 className="product-name">
                    <ALink href={ `/product/${ product?.url_key }` }>{ product?.productDetail[0]?.name }</ALink>
                </h3>

                <div className="product-price">
                    {
                        canShowSpecialPrice(product?.productVariation[0]) ? <>
                            <ins className="new-price">৳{ price ? price : 
                                canShowSpecialPrice(product?.productVariation[0]) ? canShowSpecialPrice(product?.productVariation[0]) : 0}</ins>
                            <del className="old-price">৳{product?.productVariation[0]?.price || 0}</del>
                        </> : <>
                            <ins className="new-price">৳{product?.productVariation[0]?.price || 0}</ins>
                        </>
                    }
                </div>

                <div className="ratings-container">
                    <div className="ratings-full">
                        <span className="ratings" style={ { width: 20 * product?.ratingAverage + '%' } }></span>
                        <span className="tooltiptext tooltip-top">{ toDecimal( product?.ratingAverage) || "0.00" }</span>
                    </div>

                    <ALink href={ `/product/${ product?.url_key }` } className="rating-reviews">
                        ( { product?.reviews?.paginatorInfo?.total || 0 } reviews )
                    </ALink>
                </div>

                <p className="product-short-desc">{ product?.productDetail[0]?.short_description || '' }</p>

                <div className="product-action">
                    {
                        product?.productVariation.length > 0 ?
                            <ALink href={ `/product/${ product?.url_key }` } className="btn-product btn-cart" title="Go to product">
                                <span>Select Options</span>
                            </ALink> :
                            <a href="#" className="btn-product btn-cart" title="Add to cart" onClick={ addToCartHandler }>
                                <i className="d-icon-bag"></i><span>Add to cart</span>
                            </a>
                    }
                    {/* isWishlisted ? 'Remove from wishlist' : */}
                    {
                        isUserLogin ? <a className="btn-product-icon btn-wishlist cursor-pointer" title={ 'Add to wishlist' } 
                            onClick={ wishlistHandler }>
                            <i className={ isWishlisted ? "d-icon-heart-full" : "d-icon-heart" }></i>
                        </a> : ''
                    }
                    
                </div>
            </div>
        </div >
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
    openLoginModal: modalActions.openLoginModal,
    addMultipleCarts: cartActions.addMultipleCarts, ...modalActions } )( ProductEight );