import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
// Language 
import useTranslation from "next-translate/useTranslation";

import ALink from '../features/custom-link';
import Quantity from '../features/quantity';

import { cartActions } from '../../store/cart';
import { modalActions } from "../../store/modal";

import { useMutation } from '@apollo/client';
import { ADD_TO_CART, UPADTE_CART_ITEMS } from '../../server/queries';

import { getTotalPriceFromCart, getCartCount, toDecimal, originalPriceFromCart, getTotalPrice } from '../../utils';

import CartPopup from '../partials/cart-popup';

function CartMenu( props ) {
    let {t} = useTranslation();
    const { cartList, isUserLogin, openLoginModal, addMultipleCarts } = props;
    const router = useRouter();

    const [addToCard] = useMutation(ADD_TO_CART, {
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
    })

    useEffect( () => {
        hideCartMenu();
    }, [ router.asPath ] )

    const showCartMenu = ( e ) => {
        e.preventDefault();
        e.currentTarget.closest( '.cart-dropdown' ).classList.add( 'opened' );
    }

    const hideCartMenu = () => {
        if ( document.querySelector( '.cart-dropdown' )?.classList.contains( 'opened' ) )
            document.querySelector( '.cart-dropdown' ).classList.remove( 'opened' );
    }

    const removeCart = async ( item ) => {
        let cartItem = [];
        
        cartList.forEach(cart => {
            if (cart.variation_id !== item.variation_id) {
                cartItem.push({
                    "variation_id": cart.variation_id, 
                    "qty": cart.qty 
                })
            }
        })
        
        let res = await updateCartItems({
            variables: {
                cartItems: JSON.stringify(cartItem),
                languageId: router.locale === 'en' ? 1 : 2
            }
        });

        if (res) {
            addMultipleCarts(res?.data?.removeCartItem?.cartItems || [])
        }
    }

    const changeQty = async ( qty, product ) => {
        let cartItem = [];
        cartItem.push({qty: qty, variation_id: product?.variation_id});
        
        let res = await addToCard({
            variables: {
                cartItems: JSON.stringify(cartItem),
                languageId: router.locale === 'en' ? 1 : 2
            }
        });

        if (res) {
            addMultipleCarts(res?.data?.addToCart?.cartItems || []);
            toast( <CartPopup product={ product?.productVariation?.productDetails } quality={qty} /> );
        }
    }

    const goToCheckout = () => {
        if (isUserLogin) {
            hideCartMenu();
            router.push( {
                pathname: '/p/checkout'
            });
        } else {
            hideCartMenu();
        }
    }

    return (
        <div className="dropdown cart-dropdown type2 cart-offcanvas mr-0 mr-lg-2">
            <a href="#" className="cart-toggle label-block link" onClick={ showCartMenu }>
                <div className="cart-label d-lg-show">
                    <span className="cart-name">{t('common:shopping_cart')}:</span>
                    <span className="cart-price"> {getTotalPriceFromCart( cartList ) ? '৳ ' + toDecimal( getTotalPriceFromCart( cartList ) ) : '৳ 0.00' }</span>
                </div>
                {/* <i className="d-icon-bag"><span className="cart-count">{ getCartCount( cartList ) }</span></i> */}
                <img src="../images/cart.svg" /><span className="cart-count">
                    {/* { getCartCount( cartList ) } */}
                    {cartList?.length || 0}
                </span>
            </a>
            <div className="cart-overlay" onClick={ hideCartMenu }></div>
            <div className="dropdown-box">
                <div className="custom-holder">
                    <div className="cart-header">
                        <h5 className="cart-title">Shopping Cart ({ cartList.length } {" "} { cartList.length > 1 ? "Items" : "Item" })</h5>
                        <ALink href="#" className="btn btn-dark btn-link btn-icon-right btn-close" onClick={ hideCartMenu }>close<i
                            className="d-icon-arrow-right"></i><span className="sr-only">Cart</span></ALink>
                    </div>
                    {
                        cartList.length > 0 ?
                            <>
                                <div className="products scrollable">
                                    {
                                        cartList.map( ( item, index ) =>
                                            <div className="product product-cart" key={ 'cart-menu-product-' + index }>
                                                <figure className="product-media pure-media">
                                                    <ALink href={ '/product/' + item?.productVariation?.productDetails?.url_key }>
                                                        <img src={ item?.productVariation?.productVariationImage[ 0 ]?.image_path ?  process.env.NEXT_PUBLIC_ASSET_URI + "/"
                                                            + item?.productVariation?.productVariationImage[ 0 ]?.image_path : './images/B71_02.png' } 
                                                            alt={item?.productVariation?.productDetails?.url_key} width="40" height="46" />
                                                    </ALink>
                                                </figure>
                                                <div className="product-detail row">
                                                    <div className="col-6">
                                                        <ALink href={ '/product/' + item?.productVariation?.productDetails?.url_key }>
                                                            { item?.productVariation?.productDetails?.productDetail[0]?.name }</ALink>
                                                        <div className="price-box">
                                                            <span className="product-price">৳{ 
                                                                toDecimal( originalPriceFromCart(item) ) }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div>
                                                            <Quantity max={ item?.productVariation?.qty } qty={ item?.qty } product={ item }
                                                             onChangeQty={(qty) => changeQty(qty, item) } context="cart" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn btn-link btn-close" onClick={ () => { removeCart( item ) } }>
                                                    <i className="fas fa-times"></i><span className="sr-only">Close</span>
                                                </button>
                                            </div>
                                        ) }
                                </div>

                                <div className="cart-bottom-section">
                                    <div className="cart-price-content">
                                        <div className="cart-total">
                                            <label>Subtotal:</label>
                                            <span className="subprice">৳{ toDecimal( getTotalPrice( cartList ) ) }</span>
                                        </div>
                                        {/* <div className="cart-total my-0">
                                            <label>Discount:</label>
                                            <span className="subprice">৳{ toDecimal( getTotalPriceFromCart( cartList ) ) }</span>
                                        </div>
                                        <div className="cart-total">
                                            <label>Delivery Charge:</label>
                                            <span className="subprice">৳{ toDecimal( getTotalPriceFromCart( cartList ) ) }</span>
                                        </div> */}
                                        <div className="cart-total">
                                            <label>Total:</label>
                                            <span className="price">৳{ toDecimal( getTotalPriceFromCart( cartList ) ) }</span>
                                        </div>
                                    </div>
                                    
                                    

                                    <div className="cart-action">
                                        <ALink href="/p/cart" className="btn btn-dark btn-link" onClick={ hideCartMenu }>View Cart</ALink>
                                        {
                                            isUserLogin ? <ALink href="/p/checkout" className="btn btn-primary" 
                                                onClick={ hideCartMenu }><span>Go To Checkout</span></ALink> : <ALink 
                                                    href="#" className="btn btn-primary" 
                                                    onClick={ () => { openLoginModal(); hideCartMenu()}}><span>Go To Checkout</span>
                                                </ALink>
                                        }
                                    </div>
                                </div>
                            </> :
                            <p className="mt-4 text-center font-weight-semi-bold ls-normal text-body">No products in the cart.</p>
                    }
                </div>
            </div>
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        cartList: state.cart.data,
        isUserLogin: state.user.isUserLogin
    }
}

export default connect( mapStateToProps, {
    addMultipleCarts: cartActions.addMultipleCarts,
    openLoginModal: modalActions.openLoginModal } )( CartMenu );