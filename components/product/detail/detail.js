import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';

import ALink from '../../features/custom-link';
// import Countdown from '../../features/countdown';
import Quantity from '../../features/quantity';

// import ProductNav from '../product/product-nav';
import DescTwo from '../desc/desc-two';
import { ADD_WISHLIST_MUTATION, UPADTE_CART_ITEMS, ADD_TO_CART } from '../../../server/queries';

import { wishlistActions } from '../../../store/wishlist';
import { cartActions } from '../../../store/cart';
import { modalActions } from "../../../store/modal";

import {intersect} from "../../../utils/helpers";
import { toDecimal, canShowSpecialPrice, isInstock } from '../../../utils';

import CartPopup from '../../partials/cart-popup';
import ProductSocialShare from "../../partials/product-social-share";

function DetailOne( props ) {
    let router = useRouter();
    const { data, isSticky = false, isDesc = false, adClass = '', changeVarient } = props;
    const { toggleWishlist, wishlist, cartList, isUserLogin, addMultipleCarts, updateSingleCart, openLoginModal, setWishList } = props;
    const [ cartActive, setCartActive ] = useState( false );
    const [ quantity, setQauntity ] = useState( 1 );
    const [ attribuites, setAttribuite ] = useState([]);
    const [ selectedvariation, setSelectedvariation ] = useState(null);
    const [ currentItems, setSuccrentItems ] = useState();
 
    let product = data && data.product;

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

    const [updateCartItems] = useMutation(UPADTE_CART_ITEMS, {
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
    });

    useEffect( () => {
        setSuccrentItems(null)

        if (product?.productVariation?.length) {
            let variations = [],
                rootAttribute = product.productVariation[0].variationAttribute;

            product.productVariation.forEach(varian => {
                if (varian?.variationAttribute?.length) {
                    varian.variationAttribute.map(attri => {
                        variations.push(attri);
                    })
                }
            });

            if (rootAttribute?.length && variations?.length) {
                let content = [];
                
                rootAttribute.forEach(attribute => {
                    let allItems = variations.filter(v => v?.attributeDetails?.code === attribute?.attributeDetails?.code);

                    function getUniqueListBy(arr, key) {
                        return [...new Map(arr.map(item => [item[key], item])).values()]
                    }
                    const items = getUniqueListBy(allItems, 'attribute_value');

                    items.forEach(item => {
                        let variationIds = allItems.map(value => value.attribute_value === item.attribute_value ? value.variation_id : null);
                        item.variationIds = variationIds.filter(function (e) {return e != null;});
                    });

                    content.push({
                        code: attribute?.attributeDetails?.code,
                        labelName: attribute.attributeDetails?.attributeLabel[0]?.label,
                        items
                    });
                });

                setAttribuite(content);
            }
        }
    }, [ product ] )

    useEffect( () => {
        setCartActive( true );
    }, [ currentItems, product ] )

    const wishlistHandler = async ( e ) => {
        e.preventDefault();

        if ( toggleWishlist && !isWishlisted ) {
            let currentTarget = e.currentTarget;
            currentTarget.classList.add( 'load-more-overlay', 'loading' );

            let res = await addNewWish({
                variables: {variationId: selectedvariation ? selectedvariation : product?.productVariation[0].id * 1 }
            });

            if (res) {
                currentTarget.classList.remove( 'load-more-overlay', 'loading' );
                setWishList( res?.data?.createWishlist?.wishlistItems );
                toast.success(" Wish Added Successfully! ")
            }
        } else {
            router.push( '/my-account/?content=wishlist' );
        }
    }

    const toggleSizeHandler = ( item, code ) => {
        if (!isDisableAttri(item)) {
            setSuccrentItems(prevState => ({
                ...prevState,
                [code]: item
            }));

            console.log("item.variation_id", item.variation_id);
            console.log("attribuites", attribuites);

            setSelectedvariation(item.variation_id)
        }
    }

    const addToCartHandler = async () => {
        if (isUserLogin) { 
            if (arrangeVariationQty()) {
                let cartItem = [],
                varientId = selectedvariation || product?.productVariation[ 0 ]?.id;

                cartItem.push({qty: quantity, variation_id: varientId});
                
                let res = await addToCard({
                    variables: {
                        cartItems: JSON.stringify(cartItem),
                        languageId: router.locale === 'en' ? 1 : 2
                    }
                });

                if (res) {
                    addMultipleCarts(res?.data?.addToCart?.cartItems || []);
                    toast( <CartPopup product={ product } quality={quantity} varientId={varientId} /> );
                }
            } else {
                toast.error(<span> Product not available! </span>)
            }
        } else {
            openLoginModal();
        }
    }

    const productBuyNow = () => {
        addToCartHandler();

        if (isUserLogin) {
            setTimeout(() => {
                router.push( {
                    pathname: '/p/checkout'
                });
            }, 500)
        } else {
            openLoginModal();
        }
    }

    const isDisableAttri = (item) => {
        if (currentItems) {
            let varientIds = [];

            for (const property in currentItems) {
                if (varientIds.length) {
                    varientIds = intersect( varientIds, currentItems[property]?.variationIds );
                } else {
                    varientIds = currentItems[property]?.variationIds;
                }
            }

            if (item?.variationIds?.length && varientIds?.length) {
                let checkContents = item.variationIds.map(varId => {
                    return varientIds.findIndex( variant => variant === varId );
                });

                let index = checkContents.findIndex( variant => variant !== -1 );

                if (index === -1) return true;
                else return false;
            } else return false;
        } else return false;
    }

    function changeQty( qty ) {
        setQauntity( qty );
    }

    const arrangeVariationQty = () => {
        if (selectedvariation) {
            let productVariation = product.productVariation;
            let findProduct = productVariation.find(varia => varia.id == selectedvariation);

            if (findProduct) return findProduct.qty;
        } else {
            return product?.productVariation[0]?.qty;
        }
    }

    const productVariationPrice = (type) => {
        if (selectedvariation) {
            let productVariation = product.productVariation;
            let findProduct = productVariation.find(varia => varia.id == selectedvariation);

            if (type === 'special') {
                return canShowSpecialPrice(findProduct);
            } else {
                return findProduct.price;
            }
        } return 0
    }

    const isActiveAttri = (attribuiteId, code) => {
        if (currentItems && currentItems[code] && currentItems[code].id === attribuiteId) return true;
        else return false;
    }
    
    useEffect(() => {
        if (currentItems) {
            let varientIds = [];

            for (const property in currentItems) {
                if (varientIds.length) {
                    varientIds = intersect( varientIds, currentItems[property]?.variationIds );
                } else {
                    varientIds = currentItems[property]?.variationIds;
                }
            }

            console.log("currentItems", currentItems);

            // setSelectedvariation(varientIds[0]);
            changeVarient(varientIds);
        }
    }, [currentItems])

    return (
        <div className={ `product-details ${ isSticky ? 'sticky' : '' } ${ adClass }` }>
            <div className="product-navigation">
                <ul className="breadcrumb breadcrumb-lg">
                    <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                    <li><ALink href="/s" className="active">Products</ALink></li>
                    <li>
                        <ALink href={`/s/?category=${product?.categoryDetails?.categoryDetailInformation?.url_key}`} className="active">
                            {product?.categoryDetails?.categoryDetailInformation?.categoryDetail[0]?.name}
                        </ALink>
                    </li>
                    <li>{product?.productDetail[0]?.name}</li>
                </ul>
            </div>
            <h2 className="product-name">{ product?.productDetail[0]?.name }</h2>

            <div className="product-meta font-weight-bold mb-1">
                Seller Name: <span className="text-blue">
                        <ALink href={`/store/${product?.sellerDetails?.id}/`}>{product?.sellerDetails?.shop_name || ''}</ALink>
                    </span>
                {/* <span className="font-weight-normal"> | </span>
                BRAND: <span className="product-brand">Not found in object</span> */}
            </div>

            <div className='product-meta'>
                SKU: <span className='product-sku'>{ product?.prod_sku }</span>
            </div>

            <div className="product-price">
                    {
                        currentItems ? <>
                            {
                                productVariationPrice('special') ? <Fragment>
                                <ins className="new-price">৳ { productVariationPrice('special') }</ins>
                                <del className="old-price">৳ { productVariationPrice('reg') }</del>
                            </Fragment> : <ins className="new-price">৳ { productVariationPrice('reg') }</ins>
                            } 
                        </> : canShowSpecialPrice(product?.productVariation[0]) ? <Fragment>
                                <ins className="new-price">৳ { canShowSpecialPrice(product?.productVariation[0]) }</ins>
                                <del className="old-price">৳ { product.productVariation[0].price }</del>
                            </Fragment> : <ins className="new-price">৳ { product?.productVariation[0]?.price }</ins>
                    }
                
            </div>

            <div className="ratings-container">
                <div className="ratings-full">
                    <span className="ratings" style={ { width: 20 * product?.ratingAverage + '%' } }></span>
                    <span className="tooltiptext tooltip-top">{ toDecimal( product?.ratingAverage || 0 ) }</span>
                </div>

                <ALink href="#" className="rating-reviews">( { product?.reviews?.paginatorInfo?.total } reviews )</ALink>
            </div>

            <div className="product-meta font-weight-bold mb-0">
                {
                    isInstock(product, selectedvariation) ? <label className="product-label label-sale bg-slimy-green">
                        In Stock
                    </label> : <label className="product-label label-sale bg-primary">
                        Stock Out
                    </label> 
                }
			</div>

            <p className="product-short-desc">{ product?.productDetail[0]?.short_description }</p>
            <hr className="product-divider mb-4"/>

            {
                attribuites?.length ?
                    <>
                        {
                            attribuites.map((attribuite, index) => {
                                return <div className='product-form product-size mb-0 pb-2' key={"attribure-" + index}>
                                            <label>{attribuite.labelName}:</label>
                                            
                                            <div className="product-form-group">
                                                <div className="product-variations">
                                                    {
                                                        attribuite?.items?.map( (item, index) =>
                                                            <ALink href="#" className={`w-auto ram 
                                                                ${isActiveAttri(item.id, attribuite.code) ? 'active' : '' } ${isDisableAttri( item ) ? 'disabled' : ''}`}
                                                                key={ "size-" + index } 
                                                                onClick={ ( e ) => toggleSizeHandler( item, attribuite.code ) }>
                                                                    {item.attribute_value}
                                                            </ALink> )
                                                    }
                                                </div>

                                                {
                                                    (attribuites?.length - 1) === index ? <Collapse in={ !!(currentItems && Object.keys(currentItems).length) }>
                                                        <div className="card-wrapper overflow-hidden reset-value-button w-100 mb-0">
                                                            <ALink href='#' className='product-variation-clean' 
                                                            onClick={() => { setSuccrentItems(null); setSelectedvariation(null) }}>Clean All</ALink>
                                                        </div>
                                                    </Collapse> : ''
                                                }            
                                            </div>
                                        </div>
                            })
                        }
                    </>
                    : ''
            }

            <hr className="product-divider"></hr>

            <div className="product-form product-qty pb-0">
                <label className="d-none">QTY:</label>
                <div className="product-form-group">
                    <Quantity max={ arrangeVariationQty() } context="product"
                        product={ product } onChangeQty={ changeQty } />

                    {
                        isInstock(product, selectedvariation) ? <>
                            <button className={ `btn-product btn-cart text-normal ls-normal font-weight-semi-bold mr-2 ${ cartActive ? '' : 'disabled' }` }
                                onClick={ addToCartHandler }><i className='d-icon-bag'></i>Add to Cart
                            </button>

                            <button className={ `btn-product btn-cart btn-buy-now text-normal ls-normal font-weight-semi-bold ${ cartActive ? '' : 'disabled' }` } 
                                onClick={ productBuyNow }><i className='d-icon-bag'></i
                                >Buy now
                            </button>
                        </> : ''
                    }
                </div>
            </div>

            {
                isUserLogin ? <>
                    <hr className="product-divider mb-3"></hr>
                    <div className="product-footer">
                        <a href="#" className={ `d-inline-block mb-2` } 
                            title={ isWishlisted ? 'Browse wishlist' : 'Add to wishlist' } onClick={ wishlistHandler }>
                            <i className={ isWishlisted ? "d-icon-heart-full" : "d-icon-heart" }></i> {
                                isWishlisted ? 'Browse wishlist' : 'Add to Wishlist'
                            }
                        </a>
                    </div>
                </> : ''
            }

            {/*
                <hr className="product-divider mt-1 mb-3"></hr>
                <ProductSocialShare/>
            */}
            
            {
                isDesc ? <DescTwo product={ product.data } adClass={ adClass } /> : ''
            }
        </div >
    )
}

function mapStateToProps( state ) {
    return {
        wishlist: state.wishlist.data ? state.wishlist.data : [],
        isUserLogin: state.user.isUserLogin,
        cartList: state.cart.data,
    }
}

export default connect( mapStateToProps, { toggleWishlist: wishlistActions.toggleWishlist, setWishList: wishlistActions.setWishList,
updateSingleCart: cartActions.updateSingleCart, addMultipleCarts: cartActions.addMultipleCarts,
openLoginModal: modalActions.openLoginModal } )( DetailOne );


{/* product/test-my-new-product/ */}