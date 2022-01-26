import { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
// import Image from "next/image";
import { useRouter } from 'next/router';
import Modal from 'react-modal';

import { cartActions } from '../../store/cart';
import { authUserActions } from '../../store/authUser';

import ALink from '../../components/features/custom-link';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { CREATE_ORDER, GET_LOGIN_USER_INFO,
        ADDRESS_ECOURIER, GET_CUSTOMER_CART, APPLY_COUPON, UPADTE_CART_ITEMS } from '../../server/queries';
import { toast } from 'react-toastify';

import AddressBook from "../../components/myAccount/address-book";
import AddressBookAdd from "../../components/myAccount/address-book-add";
import { objectifyForm } from "../../utils/helpers";
import { toDecimal, getTotalPriceFromCart, originalPriceFromCart, extraPriceFromCart } from '../../utils';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: "flex"
    },
    content:{
        position: 'relative',
        inset:0,
        overflow:'inherit',
        width: '90%'
    }
};

function Checkout( props ) {
    const { addToCart, isUserLogin, addMultipleCarts, userInfo, setUserInfo } = props;

    const [addBillingAddress, setAddBillingAddress] = useState()
    const router = useRouter();
    const [showShippingAddress, setShowShippingAddress] = useState(false); 
    const [showBillingAddress, setShowBillingAddress] = useState(false);

    const [modalOpen, setModelOpen] = useState(false);
    const [addressType, setAddressType] = useState();
    const [termsConditionDisabled, setTermsConditionDisabled] = useState(false);
    const [thanas, setThana] = useState([]);
    const [postcode, setPostcode] = useState([]);
    const [unions, setUnions] = useState([]);

    const [billingThanas, setbillingThanas] = useState([]);
    const [billingPostcode, setBillingPostcode] = useState([]);
    const [billingUnions, setBillingUnions] = useState([]);
    const [couponInfo, setCouponInfo] = useState();
    const [cartLoading, setCartLoading] = useState(true);
    const [showAddressBook, setShowAddressBook] = useState(true);

    const { data, loading, error } = useQuery(ADDRESS_ECOURIER);
    const addressMap = data && data.getAddressEcourier;

    const cartInfo = useQuery(GET_CUSTOMER_CART, { fetchPolicy: 'network-only',
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            console.log("graphQLErrors", graphQLErrors);
            if (graphQLErrors?.length) {
            }
            setCartLoading(false);
        },
        onCompleted(data) {
            setCartLoading(false);
        }
    });
    
    const shippingCharge = cartInfo && cartInfo?.data && cartInfo?.data?.getCustomercartItems?.shippingCharge ? cartInfo.data.getCustomercartItems.shippingCharge : 0;
    const cartList = cartInfo && cartInfo?.data && cartInfo?.data?.getCustomercartItems?.cartItems;
    
    const [ getUserData, userDataInfo ] = useLazyQuery( GET_LOGIN_USER_INFO, { fetchPolicy: 'network-only',
            onError: ({ graphQLErrors, networkError, operation, forward }) => {
                if (graphQLErrors?.length) {
                }
            } } );

    const [ createOrder ] = useMutation( CREATE_ORDER, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                
            }
        }
    });

    const [applyCoupon] = useMutation(APPLY_COUPON, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                toast.error( <div className="m-5"> &nbsp; &nbsp; {graphQLErrors[0].message} &nbsp; &nbsp;</div> )
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

    const changeQty = ( qty, product ) => {
        addToCart( { ...product, qty: qty, price: product?.productVariation[ 0 ]?.special_price } );
    }

    const placeOrder = async (e) => {
        e.preventDefault();

        if (!termsConditionDisabled) {
            toast.error( <div className="m-5">Please agree with our terms and conditions</div> );

            return false;
        }

        let orderData = {};

        let orderItem = [];

        cartList.forEach(cart => {
            orderItem.push({
                "id": cart.productVariation.product_id,
                "variation_id": cart?.variation_id,
                "qty": cart.qty,
                "price": originalPriceFromCart(cart)
            });
        });

        orderData.orderItem = JSON.stringify(orderItem);

        if (showShippingAddress && userInfo?.customer?.shippingAddressDetails?.id) {
            orderData.shippingAddress = parseInt(userInfo?.customer?.shippingAddressDetails?.id);
        } else {
            let formArray = $('#form-address-save').serializeArray();
            let shippingData = objectifyForm(formArray);

            console.log("shippingData", shippingData);

            if (shippingData && shippingData.newAddress && shippingData.newArea && 
                shippingData.newCity && shippingData.shippingEmail && shippingData.shippingName && shippingData.shippingPhone && shippingData.newThana && 
                shippingData.newUnion) {
                    orderData.newAddress = shippingData.newAddress;
                    orderData.newArea = shippingData.newArea;
                    orderData.newCity = shippingData.newCity;
                    orderData.shippingEmail = shippingData.shippingEmail;
                    orderData.shippingName = shippingData.shippingName;
                    orderData.shippingPhone = shippingData.shippingPhone;
                    orderData.newThana = shippingData.newThana;
                    orderData.newUnion = shippingData.newUnion;

                    if (!addBillingAddress) {
                        orderData.newBillingAddress = shippingData.newAddress;
                        orderData.newBillingArea = shippingData.area;
                        orderData.newBillingCity = shippingData.newCity;
                        orderData.billingEmail = shippingData.shippingEmail;
                        orderData.billingName = shippingData.shippingName;
                        orderData.billingPhone = shippingData.shippingPhone;               
                        orderData.newBillingThana = shippingData.newThana;
                        orderData.newBillingUnion = shippingData.newUnion;
                    }
                } else {
                    document.getElementById("js-save-shipping-address").click();
                    return false;
                }
        }

        if (showBillingAddress && userInfo?.customer?.billingAddressDetails?.id) {
            orderData.billingAddress = parseInt(userInfo?.customer?.billingAddressDetails?.id);
        } else if (!addBillingAddress) {
            orderData.billingAddress = parseInt(userInfo?.customer?.shippingAddressDetails?.id);
        } else {
            let formArray = $('#form-billing-address-save').serializeArray();
            let billingData = objectifyForm(formArray);
            console.log("billingData", billingData);
            if (billingData && billingData.newBillingAddress && billingData.newBillingArea && 
                billingData.newBillingCity && billingData.billingEmail && billingData.billingName && billingData.billingPhone 
                && billingData.newBillingThana && billingData.newBillingUnion) {
                    orderData.newBillingAddress = billingData.newBillingAddress;
                    orderData.newBillingArea = billingData.newBillingArea;
                    orderData.newBillingCity = billingData.newBillingCity;
                    orderData.billingEmail = billingData.billingEmail;
                    orderData.billingName = billingData.billingName;
                    orderData.billingPhone = billingData.billingPhone;
                    orderData.newBillingThana = billingData.newBillingThana;
                    orderData.newBillingUnion = billingData.newBillingUnion;
                } else {
                    document.getElementById("js-save-bulling-address").click();
                    return false;
                }
        }

        // orderData.paymentMethod = "";
        orderData.shippingMethod = "cash";
        orderData.paymentStatus = "paid";
        orderData.shippingFee = shippingCharge;
        orderData.orderNotes = $("#js-order-note").val();
        if (couponInfo?.coupon) orderData.couponCode = couponInfo.coupon;

        const res = await createOrder({
            variables: orderData
        });

        if ( res?.data?.createOrder) {
            toast.success( <div className="m-5"> Order Placed Successfully </div> );
            getUserData({ variables: {} });
            addMultipleCarts([])
            router.push('/payment/payment-method-selection/' + res?.data?.createOrder?.id);
        }
    }

    const closeModal = () => {
        setAddressType(null)
    };

    const chnageCity = (e) => {
        let value = e.target.value;
        setPostcode([]);
        setUnions([]);

        if (value && addressMap?.length) {
            let findThana = addressMap.find(address => address.city === value);
            setThana(findThana?.thana || []);
        } else {    
            setThana([]);
        }
    }

    const chnageThana = (e) => {
        let value = e.target.value;

        setUnions([]);

        if (value && thanas?.length) {
            let findThana = thanas.find(tanan => tanan.thana_name === value);

            setPostcode(findThana?.post_codes || []);
        } else {    
            setPostcode([])
        }
    }

    const changeUnion = (e) => {
        let value = e.target.value;

        if (value && postcode?.length) {
            let findUnion = postcode.find(union => union.post_code_name === value);

            setUnions(findUnion?.area || []);
        } else {    
            setUnions([])
        }
    } 
    
    const changeBillingCity = (e) => {
        let value = e.target.value;
        
        setBillingPostcode([]);
        setBillingUnions([]);

        if (value && addressMap?.length) {
            let findThana = addressMap.find(address => address.city === value);
            setbillingThanas(findThana?.thana || []);
        } else {    
            setbillingThanas([]);
        }
    }

    const changeBillingThana = (e) => {
        let value = e.target.value;

        setBillingUnions([]);

        if (value && billingThanas?.length) {
            let findThana = billingThanas.find(tanan => tanan.thana_name === value);
            setBillingPostcode(findThana?.post_codes || []);
        } else {    
            setBillingPostcode([])
        }
    }

    const changeBillingUnion = (e) => {
        let value = e.target.value;

        if (value && billingPostcode?.length) {
            let findUnion = billingPostcode.find(union => union.post_code_name === value);

            console.log("findUnion",findUnion);

            setBillingUnions(findUnion?.area || []);
        } else {    
            setBillingUnions([]);
        }
    } 

    const couponApply = async () => {
        let value = $('#js-coupne-field').val();
        if (value) {
            let res = await applyCoupon({
                variables: {
                    "coupon": value
                }
            });

            if (res?.data?.applyCoupon) {
                setCouponInfo({
                    discount_amount: res?.data?.applyCoupon?.discount_amount,
                    coupon: value
                });

                toast.success( <div className="m-5"> Coupon Added Successfully </div> )
            }
        } else {
            toast.error( <div className="m-5"> Invalid Coupon </div> )
        }
    }

    const handelView = () => {
        setShowAddressBook(false);
    }
    
    useEffect(() => {
        if (!isUserLogin) {
            router.push({ pathname: '/'});
        }
    }, [isUserLogin])

    useEffect(() => {
        if (userInfo?.customer) {
            if (userInfo?.customer?.shippingAddressDetails?.id) setShowShippingAddress(true);
            if (userInfo?.customer?.billingAddressDetails?.id) setShowBillingAddress(true);
        }
    }, [userInfo]);

    useEffect(() => {
        if (userDataInfo?.data?.getUserFromToken) {
            setUserInfo( userDataInfo?.data?.getUserFromToken );
        };
    }, [userDataInfo]);

    return (
        <main className="main checkout custom-bg-color-one">
            <Head>
                <title>B71 - ECommerce Store || Checkout</title>
            </Head>

            <div className={ `page-content pt-7 pb-10 ${ cartList?.length > 0 ? 'mb-0' : 'mb-0' }` }>
                {
                    cartLoading ? <div className={ `row product-wrapper` }>
                        {
                            [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                            )
                        }
                    </div> : <div className="container-fluid">
                        {
                            cartList?.length > 0 ?
                                <>
                                    <div className="row">
                                        <div className="col-lg-7 mb-6 mb-lg-0 pr-lg-4">
                                            <div className="card">
                                                <div className="card-body">
                                                    {/* <h3 className="title title-simple text-left text-uppercase mb-3">Shipping Details</h3> */}
                                                    <div className="d-flex justify-content-between align-items-center pb-2"> 
                                                        <h3 className="title title-simple text-uppercase m-0 pb-0 border-bottom-0"> Shipping Details </h3>
                                                        {
                                                            showShippingAddress ? <button 
                                                                onClick={ () => {setAddressType('shipping'); setModelOpen(true)}  }
                                                                className="btn btn-secondary btn-outline btn-rounded btn-sm px-1">
                                                                    Change  
                                                                </button> : ''
                                                        }
                                                    </div>

                                                    <hr/>

                                                    {
                                                        showShippingAddress ? <>
                                                            <div className="row">
                                                                <div className="col-xs-6 mb-1">
                                                                    <label className="text-black"> <strong> Name: 
                                                                        </strong> { userInfo?.customer?.shippingAddressDetails?.name || 'N/A' } 
                                                                    </label>
                                                                </div>
                                                                <div className="col-xs-6 mb-1">
                                                                    <label className="text-black">  <strong> Mobile: </strong> 
                                                                    { userInfo?.customer?.shippingAddressDetails?.mobile || 'N/A' }</label>
                                                                </div>
                                                                <div className="col-xs-6 mb-1">
                                                                    <label className="text-black">  <strong> Email: </strong> 
                                                                    { userInfo?.customer?.shippingAddressDetails?.email || 'N/A' }</label>
                                                                </div> 

                                                                <div className="col-xs-6 mb-1">
                                                                    <label className="text-black"> <strong> City: </strong> 
                                                                        { userInfo?.customer?.shippingAddressDetails?.city || 'N/A' }
                                                                    </label> 
                                                                </div>

                                                                <div className="col-xs-6 mb-1">
                                                                    <label className="text-black"> <strong> Thana: </strong>  
                                                                        { userInfo?.customer?.shippingAddressDetails?.thana || 'N/A' }
                                                                    </label> 
                                                                </div>

                                                                <div className="col-xs-6 mb-1">
                                                                    <label className="text-black"> <strong> PostCode: </strong>  
                                                                        { userInfo?.customer?.shippingAddressDetails?.union || 'N/A' }
                                                                    </label> 
                                                                </div>

                                                                <div className="col-xs-6 mb-1">
                                                                    <label className="text-black"> <strong> Area: </strong>  
                                                                    { userInfo?.customer?.shippingAddressDetails?.area || 'N/A' }
                                                                    </label> 
                                                                </div>
                                                                <div className="col-xs-12 mb-1">
                                                                    <label className="text-black"> <strong> Street Address: </strong>
                                                                    { userInfo?.customer?.shippingAddressDetails?.address || 'N/A' }
                                                                    </label>
                                                                </div>

                                                                {
                                                                    !userInfo?.customer?.billingAddressDetails?.id ? <div className="form-checkbox mt-3">
                                                                        <input type="checkbox" className="custom-checkbox" id="terms-condition1"
                                                                            name="terms-condition" 
                                                                            onClick={(e) => {setAddBillingAddress(e.target.checked), console.log("erer", e.target.checked)}} />
                                                                        <label className="form-control-label" htmlFor="terms-condition1">
                                                                            Bill to a different address
                                                                        </label>
                                                                    </div> : ''
                                                                }
                                                                
                                                            </div>
                                                        </> : ''
                                                    }

                                                    {!showShippingAddress ? <Fragment>
                                                        <form id="form-address-save">
                                                            <div className="row">
                                                                <div className="col-xs-12">
                                                                    <label>Name *</label>
                                                                    <input type="text" className="form-control" name="shippingName" required />
                                                                </div>
                                                                <div className="col-xs-6">
                                                                    <label>Phone *</label>
                                                                    <input type="text" className="form-control" name="shippingPhone" required />
                                                                </div>
                                                                <div className="col-xs-6">
                                                                    <label>Email Address *</label>
                                                                    <input type="text" className="form-control" name="shippingEmail" required />
                                                                </div>
                                                                <div className="col-xs-6">
                                                                    <label>City *</label>
                                                                    <div className="select-box">
                                                                        <select name="newCity" className="form-control" required onChange={chnageCity}>
                                                                            <option value=""></option>
                                                                            {
                                                                                addressMap?.length ? addressMap.map(data => <option key={data.city} value={data.city}>{data.city}</option>) : ''
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                <div className="col-xs-6">
                                                                    <label>Thana *</label>
                                                                    <div className="select-box">
                                                                        <select name="newThana" className="form-control" required onChange={chnageThana}>
                                                                            <option value=""></option>
                                                                            {
                                                                                thanas.map(thana => <option key={thana.thana_name} value={thana.thana_name}>{thana.thana_name}</option>)
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-xs-6">
                                                                    <label>PostCode *</label>
                                                                    <select name="newUnion" className="form-control" required 
                                                                        onChange={changeUnion}>
                                                                        <option value=""></option>
                                                                        {
                                                                            postcode.map(code => <option key={code.post_code_name} value={code.post_code_name}>{code.post_code_name}</option>)
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="col-xs-6">
                                                                    <label>Area *</label>
                                                                    <select name="newArea" className="form-control" required>
                                                                        <option value=""></option>
                                                                        {
                                                                            unions.map(union => <option key={union.name} value={union.name}>{union.name}</option>)
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="col-xs-12">
                                                                    <label>Street Address *</label>
                                                                    <input type="text" className="form-control" name="newAddress" required
                                                                        placeholder="House number and street name" />
                                                                </div>

                                                                <div className="form-checkbox mt-4 mb-5">
                                                                    <input type="checkbox" className="custom-checkbox" id="terms-condition1"
                                                                        name="terms-condition" onClick={(e) => {setAddBillingAddress(e.target.checked)}} />
                                                                    <label className="form-control-label" htmlFor="terms-condition1">
                                                                        Bill to a different address
                                                                    </label>
                                                                </div>
                                                                <hr/>
                                                            </div>

                                                            <p className="mb-4 mt-4 text-right"> 
                                                                <button className="btn btn-rounded btn-md btn-secondary d-none" type="submit"
                                                                    id="js-save-shipping-address">Save Address</button> 
                                                            </p> 
                                                        </form>
                                                    </Fragment> : '' }

                                                    {
                                                        showBillingAddress ? <Fragment>
                                                            <hr/>
                                                            <div className="d-flex justify-content-between align-items-center pb-2"> 
                                                                <h3 className="title title-simple text-uppercase m-0 pb-0 border-bottom-0"> Billing Address 
                                                                    {
                                                                        userInfo?.customer?.shippingAddressDetails?.id === userInfo?.customer?.billingAddressDetails?.id ? 
                                                                        <Fragment><small> ( Same As Shipping Address ) </small></Fragment> : ''
                                                                    }
                                                                </h3>
                                                                <button 
                                                                    onClick={ () => {setAddressType('billing'); setModelOpen(true)}  }
                                                                    className="btn btn-secondary btn-outline btn-rounded btn-sm px-1">
                                                                    Change  
                                                                </button>
                                                            </div>
                                                            {console.log("userInfo ===", userInfo)}
                                                            <hr/>
                                                            {
                                                                userInfo?.customer?.shippingAddressDetails?.id !== userInfo?.customer?.billingAddressDetails?.id ?
                                                                <Fragment>
                                                                    <div className="row">
                                                                        <div className="col-xs-6 mb-1">
                                                                            <label className="text-black"> <strong> Name: 
                                                                                </strong> { userInfo?.customer?.billingAddressDetails?.name || 'N/A' }
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-xs-6 mb-1">
                                                                            <label className="text-black">  <strong> Mobile: </strong> 
                                                                                { userInfo?.customer?.billingAddressDetails?.mobile || 'N/A' }
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-xs-6 mb-1">
                                                                            <label className="text-black">  <strong> Email: </strong> 
                                                                                { userInfo?.customer?.billingAddressDetails?.email || 'N/A' }
                                                                            </label>
                                                                        </div> 

                                                                        <div className="col-xs-6 mb-1">
                                                                            <label className="text-black"> <strong> City: </strong> 
                                                                                { userInfo?.customer?.billingAddressDetails.city || 'N/A' }
                                                                            </label> 
                                                                        </div>

                                                                        <div className="col-xs-6 mb-1">
                                                                            <label className="text-black"> <strong> Thana: </strong>  
                                                                                { userInfo?.customer?.billingAddressDetails?.thana || 'N/A' }
                                                                            </label> 
                                                                        </div>

                                                                        <div className="col-xs-6 mb-1">
                                                                            <label className="text-black"> <strong> PostCode: </strong>  
                                                                                { userInfo?.customer?.billingAddressDetails?.union || 'N/A' }
                                                                            </label> 
                                                                        </div>

                                                                        <div className="col-xs-6 mb-1">
                                                                            <label className="text-black"> <strong> Area: </strong>  
                                                                                { userInfo?.customer?.billingAddressDetails.area || 'N/A' }
                                                                            </label> 
                                                                        </div>
                                                                        <div className="col-xs-12 mb-1">
                                                                            <label className="text-black"> <strong> Street Address: </strong>
                                                                                { userInfo?.customer?.billingAddressDetails.address || 'N/A' }
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </Fragment> : ''
                                                            }
                                                        </Fragment> : ''
                                                    }

                                                    {
                                                        !showBillingAddress ? <Fragment>
                                                        {
                                                            addBillingAddress ? <form id="form-billing-address-save" className="mt-4">
                                                                <h3 className="title title-simple text-left text-uppercase mb-3">Billing Details</h3>
                                                                <hr/>

                                                                <div className="row">
                                                                    <div className="col-xs-12">
                                                                        <label>Name *</label>
                                                                        <input type="text" className="form-control" name="billingName" required />
                                                                    </div>
                                                                    <div className="col-xs-6">
                                                                        <label>Phone *</label>
                                                                        <input type="text" className="form-control" name="billingPhone" required />
                                                                    </div>
                                                                    <div className="col-xs-6">
                                                                        <label>Email Address *</label>
                                                                        <input type="text" className="form-control" name="billingEmail" required />
                                                                    </div>
                                                                    <div className="col-xs-6">
                                                                        <label>City *</label>
                                                                        <div className="select-box">
                                                                            <select name="newBillingCity" className="form-control" required onChange={changeBillingCity}>
                                                                                <option value=""></option>
                                                                                {
                                                                                    addressMap?.length ? addressMap.map(data => <option key={data.city} value={data.city}>{data.city}</option>) : ''
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xs-6">
                                                                        <label>Thana *</label>
                                                                        <div className="select-box">
                                                                            <select name="newBillingThana" className="form-control"  required onChange={changeBillingThana}>
                                                                                <option value=""></option>
                                                                                {
                                                                                    billingThanas.map(thana => <option key={thana.thana_name} value={thana.thana_name}>{thana.thana_name}</option>)
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xs-6">
                                                                        <label>PostCode *</label>
                                                                        <select name="newBillingUnion" className="form-control" required onChange={changeBillingUnion}>
                                                                            <option value=""></option>
                                                                            {
                                                                                billingPostcode.map(code => <option key={code.post_code_name} value={code.post_code_name}>{code.post_code_name}</option>)
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-xs-6">
                                                                        <label>Area *</label>
                                                                        <select name="newBillingArea" className="form-control" required>
                                                                            <option value=""></option>
                                                                            {
                                                                                billingUnions.map(union => <option key={union.name} value={union.name}>{union.name}</option>)
                                                                            }
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-xs-12">
                                                                        <label>Street Address *</label>
                                                                        <input type="text" className="form-control" name="newBillingAddress" required
                                                                            placeholder="House number and street name" />
                                                                    </div>
                                                                    <hr/>
                                                                </div>
                                                                <p className="mb-4 mt-4 text-right"> 
                                                                    <button className="btn btn-rounded btn-md btn-secondary d-none" type="submit"
                                                                        id="js-save-bulling-address">Save Address</button> 
                                                                </p> 
                                                            </form> : ''
                                                        }
                                                        </Fragment> : ''
                                                    }

                                                    <h2 className="title title-simple text-uppercase text-left mt-6 mb-3">Additional Information</h2>
                                                    <hr/>
                                                    <label>Order Notes (Optional)</label>

                                                    <textarea className="form-control pb-2 pt-2 mb-0" cols="30" rows="5" name="note"
                                                        id='js-order-note'
                                                        placeholder="Notes about your order, e.g. special notes for delivery">
                                                    </textarea>
                                                </div>
                                            </div>

                                        <div className="card mt-4"><div className="card-body">
                                            <h5 className="font-weight-bold">Package One</h5>
                                            <table className="shop-table cart-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{width:'60px'}}><span>Product</span></th>
                                                        <th></th>
                                                        <th style={{width:'150px'}}><span>Price</span></th>
                                                        <th className="text-center"><span>quantity</span></th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        cartList.map((item, index) => <tr key={index}>
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
                                                                <span className="amount">
                                                                    ৳ { toDecimal( originalPriceFromCart(item) ) } 
                                                                    {extraPriceFromCart(item) ? <span> - <span style={{textDecoration: "line-through"}}>৳ {extraPriceFromCart(item)}</span></span> : ''} 
                                                                </span>
                                                            </td>
                                                            <td className="product-quantity text-center">
                                                                { item?.qty }
                                                                {/* <div className="mr-2 input-group">
                                                                    <Quantity qty={ item?.qty } max={ item?.productVariation?.qty } product={ item }
                                                                                    onChangeQty={ qty => onChangeQty( item, qty ) } context="cart" />
                                                                </div> */}
                                                            </td>
                                                            <td className="product-price"><span className="amount">
                                                                ৳ { toDecimal( originalPriceFromCart(item) * item?.qty ) }</span>
                                                            </td>
                                                            {/* <td className="product-close">
                                                                <ALink href="#" className="product-remove" title="Remove this product" 
                                                                    onClick={ () => removeCartItem( item ) }>
                                                                    <i className="fas fa-times"></i>
                                                                </ALink>
                                                            </td> */}
                                                        </tr>)
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>    
                                </div>

                                <aside className="col-lg-5 sticky-sidebar-wrapper">
                                    <div className="sticky-sidebar" data-sticky-options="{'bottom': 50}">
                                        <div className="summary pt-5">
                                            <h3 className="title title-simple text-left text-uppercase mb-3">Order Summery</h3>
                                            <hr className="mb-0"/>
                                            <table className="order-table">
                                                <tbody>
                                                    <tr className="summary-subtotal">
                                                        <td>
                                                            <h4 className="summary-subtitle">Subtotal ({cartList.length} Items)</h4>
                                                        </td>
                                                        <td className="summary-subtotal-price pb-0 pt-0">৳ { toDecimal( getTotalPriceFromCart( cartList ) ) }
                                                        </td>
                                                    </tr>
                                                    
                                                    <tr className="summary-subtotal">
                                                        <td>
                                                            <h4 className="summary-subtitle">Delivery Charge</h4>
                                                        </td>
                                                        <td>
                                                            <p className="summary-subtotal-price">৳ {shippingCharge}</p>
                                                        </td>
                                                    </tr>
                                                    {/* <tr className="summary-subtotal">
                                                        <td>
                                                            <h4 className="summary-subtitle">Discount (Coupon Code #1234)</h4>
                                                        </td>
                                                        <td>
                                                            <p className="summary-subtotal-price">৳ -250</p>
                                                        </td>
                                                    </tr> */}

                                                    {
                                                        couponInfo && couponInfo.discount_amount && couponInfo.coupon ? <tr className="summary-subtotal">
                                                            <td colSpan="2" className="pt-3 pb-3">
                                                        
                                                                <div className="coupon rounded d-flex align-items-center">  
                                                                    <div className="tengah mt-2 col-sm-3 text-center">
                                                                        <img src="../images/ticket.svg" width={40} />  
                                                                    </div>
                                                                    <div className="kanan col-sm-5">
                                                                        <div className="info">
                                                                        <div className="text-left pt-2 pl-5">
                                                                            <h6 className="text-black mb-0"> {couponInfo.coupon} </h6>  
                                                                            <a onClick={() => setCouponInfo(null)} className="cursor-pointer text-primary mt-0 font-16">
                                                                                Remove
                                                                            </a>  
                                                                        </div> 
                                                                        </div>
                                                                    </div> 
                                                                    <div className="col-sm-4 text-center">
                                                                        <h6 className="text-primary mb-0"> - ৳ {couponInfo.discount_amount}</h6>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr> : <tr className="summary-subtotal">
                                                            <td colSpan="2" className="text-left pt-5 pb-5 mb-2">
                                                                <h4 className="summary-subtitle m-0 pb-2 pt-0">Have a Coupon Code?</h4>
                                                            <div className="d-flex mb-2 input-wrapper-inline"> 

                                                                    <input type="text" className="form-control mb-0" 
                                                                        name="coupon" id="js-coupne-field" required="" />
                                                                    <button className="btn btn-secondary" onClick={couponApply} type="bitton">Apply</button>
                                                            </div>  
                                                            </td>  				
                                                        </tr>
                                                    }

                                                    <tr className="summary-total">
                                                        <td className="pb-0">
                                                            <h4 className="summary-subtitle">Total</h4>
                                                        </td>
                                                        <td className=" pt-0 pb-0">
                                                            <p className="summary-total-price ls-s text-dark">
                                                                ৳ { toDecimal( getTotalPriceFromCart( cartList ) - (couponInfo?.discount_amount || 0 ) + shippingCharge ) }
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            
                                            <div className="form-checkbox mt-4 mb-5">
                                                <input type="checkbox" className="custom-checkbox" id="terms-condition"
                                                    onClick={(e) => { setTermsConditionDisabled(e.target.checked) }}
                                                    name="terms-condition"  />
                                                <label className="form-control-label" htmlFor="terms-condition">
                                                    I have read and agree to the website <a href="/page/terms-condition/" target="_blank">terms and conditions </a>*
                                                </label>
                                            </div>
                                            <button type="submit" disabled={!termsConditionDisabled}
                                                className={`btn btn-dark btn-rounded btn-order ${!termsConditionDisabled ? 'cursur-wait' : ''}`} 
                                                onClick={placeOrder}>Proceed to Payment</button>
                                        </div>
                                    </div>
                                </aside>
                            </div>
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
                }
            </div>

            <Modal
                className="overflow-custom"
                isOpen={modalOpen}
                style={ customStyles }
                onRequestClose={ closeModal }
            >
                {console.log("addressType", addressType)}
                { showAddressBook ? <AddressBook addressType={addressType} context={'checkout'}
                    handelView={ handelView } setModelOpen={setModelOpen} /> : <div className='modal-address'>
                            <AddressBookAdd context={'checkout'} addressType={addressType}
                                setModelOpen={setModelOpen}/>
                        </div>
                }
                
                <button title="product" type="button" className="mfp-close" 
                    onClick={ () => setModelOpen(false) }><span>×</span>
                </button>
            </Modal>
        </main>
    )
}

function mapStateToProps( state ) {
    return {
        isUserLogin: state.user.isUserLogin,
        userInfo: state.user.userInfo
    }
}

export default connect( mapStateToProps, { 
    addMultipleCarts: cartActions.addMultipleCarts,
    addToCart: cartActions.addToCart,
    setUserInfo: authUserActions.setUserInfo } )( Checkout );