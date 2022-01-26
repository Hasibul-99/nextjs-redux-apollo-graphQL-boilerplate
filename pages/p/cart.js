import { connect } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import ALink from '../../components/features/custom-link';
import Quantity from '../../components/features/quantity';

import { cartActions } from '../../store/cart';
import { modalActions } from "../../store/modal";

import { useMutation } from '@apollo/client';
import { ADD_TO_CART, UPADTE_CART_ITEMS } from '../../server/queries';

import { toDecimal, getTotalPrice, getTotalPriceFromCart, originalPriceFromCart, extraPriceFromCart } from '../../utils';

function Cart ( props ) {
    const router = useRouter();
    const { cartList, removeFromCart, isUserLogin, addToCart, openLoginModal, addMultipleCarts } = props;
    const [ cartItems, setCartItems ] = useState( [] );

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
        setCartItems( [ ...cartList ] );
    }, [ cartList ] )

    const onChangeQty = async ( product, qty ) => {
        // addToCart( { ...product, qty: qty } );
        let cartItem = [];
        cartItem.push({qty: qty, variation_id: product?.variation_id});
        
        let res = await addToCard({
            variables: {
                cartItems: JSON.stringify(cartItem),
                languageId: router.locale === 'en' ? 1 : 2
            }
        });

        if (res) {
            addMultipleCarts(res?.data?.addToCart?.cartItems || [])
        }
    }

    const removeCartItem = async (item) => {
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

    return (
        <div className="main cart">
            <nav className="breadcrumb-nav custom-bg-color-one">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        {/* <li><ALink href="/">Category</ALink></li> */}
                        <li>Cart</li>
                    </ul>
                </div>
            </nav>
            <div className="page-content custom-bg-color-one pt-0 pb-10">

                <div className="container-fluid mt-0 mb-2">    
                    <div className="row">
                        {
                            cartItems.length > 0 ?
                                <>
                                    <div className="col-lg-8 col-md-12">
                                        <div className="view-cart-custom">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="font-weight-bold">CART DETAILS</h5>
                                                    <table className="shop-table cart-table">
                                                        <thead>
                                                            <tr>
                                                                <th style={{width:'60px'}}><span>Product</span></th>
                                                                <th></th>
                                                                <th style={{width:'150px'}}><span>Price</span></th>
                                                                <th><span>quantity</span></th>
                                                                <th>Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                cartItems.map( item =>
                                                                    <tr key={ 'cart' + item?.productVariation?.productDetails?.url_key }>
                                                                        <td className="product-thumbnail">
                                                                            <figure>
                                                                                <ALink href={ '/product/' + item.productVariation?.productDetails?.url_key }>
                                                                                    <img src={ item?.productVariation?.productVariationImage[ 0 ]?.image_path ?  process.env.NEXT_PUBLIC_ASSET_URI + "/"
                                            + item?.productVariation?.productVariationImage[ 0 ]?.image_path : './images/B71_02.png' } width="100" height="100"
                                                                                        alt="product" />
                                                                                </ALink>
                                                                            </figure>
                                                                        </td>
                                                                        <td className="product-name" style={{width: '250px'}}>
                                                                            <div className="product-name-section">
                                                                                <ALink href={ '/product/' + item?.productVariation?.productDetails?.url_key }>
                                                                                    {item.productVariation?.productDetails?.productDetail[0].name}
                                                                                </ALink>
                                                                                <p class="mb-0"> 
                                                                                    <span class="amount">
                                                                                        {/* Color: White , Size: Large */}
                                                                                        {item.productVariation?.variationAttribute?.length ? <>
                                                                                            {
                                                                                                item.productVariation?.variationAttribute.map((att, i) => <Fragment key={'tree-' + i }>
                                                                                                    <span style={{textTransform: "capitalize"}}>{att?.attributeDetails?.code}</span>: {att.attribute_value}
                                                                                                    {(item.productVariation?.variationAttribute?.length - 1) !== i ? ',' : ''} &nbsp;
                                                                                                </Fragment>)
                                                                                            }
                                                                                        </> : ''}
                                                                                    </span> 
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                        <td className="product-subtotal">
                                                                            <span className="amount">৳ { toDecimal( originalPriceFromCart(item) ) }</span>
                                                                            {
                                                                                extraPriceFromCart(item) ? <span>
                                                                                    - <br/> <span style={{textDecoration: "line-through"}}>৳ {extraPriceFromCart(item)}
                                                                                     </span>
                                                                                     </span> : ''
                                                                            }
                                                                        </td>

                                                                        <td className="product-quantity">
                                                                            <Quantity qty={ item?.qty } max={ item?.productVariation?.qty } product={ item }
                                                                                onChangeQty={ qty => onChangeQty( item, qty ) } context="cart" />
                                                                        </td>
                                                                        <td className="product-price">
                                                                            <span className="amount">
                                                                            ৳ { toDecimal( originalPriceFromCart(item) * item?.qty ) }
                                                                            </span>
                                                                        </td>
                                                                        <td className="product-close">
                                                                            <ALink href="#" className="product-remove" title="Remove this product" 
                                                                                onClick={ () => removeCartItem( item ) }>
                                                                                <i className="fas fa-times"></i>
                                                                            </ALink>
                                                                        </td>
                                                                    </tr>
                                                                ) }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="cart-actions mb-6">
                                            <ALink href="/s" className="btn btn-rounded btn-md btn-secondary btn-icon-left mb-4">
                                                <i className="d-icon-arrow-left"></i>
                                                Continue Shopping
                                            </ALink>
                                        </div>
                                    </div>
                                    
                                    <aside className="col-lg-4 sticky-sidebar-wrapper">
                                        <div className="sticky-sidebar" data-sticky-options="{'bottom': 20}">
                                            <div className="summary bg-white mb-4">
                                                <h3 className="summary-title text-left">Cart Totals</h3>
                                                <table className="shipping">
                                                    <tbody>
                                                        {/* <tr className="summary-subtotal">
                                                            <td>
                                                                <h4 className="summary-subtitle">Subtotal</h4>
                                                            </td>
                                                            <td>
                                                                <p className="summary-subtotal-price">৳ { toDecimal( getTotalPrice( cartItems ) ) }</p>
                                                            </td>
                                                        </tr> */}
                                                        {/* <tr className="sumnary-shipping shipping-row-last">
                                                            <td colSpan="2">
                                                                <h4 className="summary-subtitle">Delivery Charge</h4>
                                                                <ul>
                                                                    <li>
                                                                        <div className="custom-radio">
                                                                            <input type="radio" id="flat_rate" name="delivery-charge" className="custom-control-input" defaultChecked />
                                                                            <label className="custom-control-label" htmlFor="flat_rate">Inside Dhaka ৳ 80</label>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="custom-radio">
                                                                            <input type="radio" id="free-shipping" name="delivery-charge" className="custom-control-input" />
                                                                            <label className="custom-control-label" htmlFor="free-shipping">Outside Dhaka ৳ 180</label>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                        </tr> */}
                                                    </tbody>
                                                </table>
                                                {/* <h4 className="summary-subtitle text-left">Have a Coupon code?</h4>
                                                <form action="#" className="form input-wrapper input-wrapper-inline track-order-input"> 
                                                    <input type="text" name="coupon_code" className="form-control text-body bg-white" id="coupon_code" placeholder="Enter coupon code here..." />
                                                    <button className="btn btn-sm btn-secondary btn-icon-left" style={{borderTopLeftRadius:0, borderBottomLeftRadius:0, marginLeft:-4}} type="submit"> Apply Coupon </button>
                                                </form> */}
                                                
                                                <table className="total">
                                                    <tbody>
                                                        <tr className="summary-subtotal">
                                                            <td>
                                                                <h4 className="summary-subtitle">Total</h4>
                                                            </td>
                                                            <td>
                                                                <p className="summary-total-price ls-s">৳ { toDecimal( getTotalPriceFromCart( cartItems ) ) }</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {
                                                    isUserLogin ? <ALink href="/p/checkout" 
                                                            className="btn btn-primary btn-rounded btn-checkout">Proceed to checkout
                                                        </ALink> : <ALink href="#" onClick={() => {openLoginModal()}}
                                                            className="btn btn-primary btn-rounded btn-checkout">Proceed to checkout
                                                        </ALink>
                                                }
                                            </div>
                                        </div>
                                    </aside>
                                </>
                                :
                                <div className="empty-cart text-center">
                                    <p>Your cart is currently empty.</p>
                                    <i className="cart-empty d-icon-bag"></i>
                                    <p className="return-to-shop mb-0">
                                        <ALink className="button wc-backward btn btn-dark btn-md" href="/s">
                                            Return to shop
                                        </ALink>
                                    </p>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

function mapStateToProps ( state ) {
    return {
        cartList: state.cart.data ? state.cart.data : [],
        isUserLogin: state.user.isUserLogin
    }
}

export default connect( mapStateToProps, { addMultipleCarts: cartActions.addMultipleCarts,
    removeFromCart: cartActions.removeFromCart, 
    addToCart: cartActions.addToCart, openLoginModal: modalActions.openLoginModal } )( Cart );