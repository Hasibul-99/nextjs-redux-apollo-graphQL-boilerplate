import { useRouter } from 'next/router';

import { ORDER_DETAILS, ORDER_CANCEL_REASONS, RETURN_REASONS } from '../../server/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Fragment, useEffect, useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import ALink from '../../components/features/custom-link';

import {dateFormate} from "../../utils/helpers";
import {orderStatusShow } from "../../utils";

import CancelOrderModel from "../../components/myAccount/component/cancel-order-model.js";
import ReturnRequestModal from "../../components/myAccount/component/return-request-modal";
import RefundRequestModal from "../../components/myAccount/component/refund-request-modal";
import TimeCoundown from "../../components/common/time-coundown";

export default function TrackOrder() {
    const [selectOrder, setSelectOrder] = useState();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [reasons, setReasons] = useState([]);
    const [returnModalIsOpen, setRetunrModalIsOpen] = useState(false);
    const [returnReason, setReturnReason] = useState([]);
    const [refundModalIsOpen, setRefundModalIsOpen] = useState(false);

    
    const router = useRouter();
    const query = router.query;

    const [ getOrderInfo, { data, loading, error } ] = useLazyQuery( ORDER_DETAILS, {
        fetchPolicy: 'network-only',
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
                if (graphQLErrors?.length) {
                    console.log("graphQLErrors", graphQLErrors);
                }
            }
        });
    
    const cancelResons = useQuery( ORDER_CANCEL_REASONS, {
        onCompleted(data) {
            setReasons(data?.cancelReason)
        }
    });

    const refunsReason = useQuery( RETURN_REASONS, {
        onCompleted(data) {
            setReturnReason(data?.returnReason)
        }
    });
    
    const orderInfo = data && data?.orderDetails;
    const shippingAddress = orderInfo?.shipping_address ? JSON.parse(orderInfo.shipping_address) : '';
    const billingAddress = orderInfo?.billing_address ? JSON.parse(orderInfo.billing_address) : '';

    const showSubTotal = (orderItem) => {
        let total = 0;
        
        if (orderItem && orderItem.length) {
            orderItem.forEach(order => {
                total = total + (order.unit_price * order.quantity)
            })
        }

        return total;
    }

    const disCountTotal = (orderItem) => {
        let total = 0;

        if (orderItem && orderItem.length) {
            orderItem.forEach(order => {
                total = total + (order.discount || 0)
            })
        }

        return total;
    }

    const closeModal = () => {
        setIsOpen(false);
        setSelectOrder(null);
    }

    const closeReturnModal = () => {
        setRetunrModalIsOpen(false);
        setSelectOrder(null);
    }

    const closeRefundModal = () => {
        setRefundModalIsOpen(false);
        setSelectOrder(null);
    }

    const generateOrderInfo = () => {
        getOrderInfo( {
            variables: {
                orderDetailsId: parseInt(query.orderId),
            }
        })
    }

    const canReturnRequest = (packageDetails) => {
        if (packageDetails?.status === 'DELIVERED') {
            if (!packageDetails?.hasReturnRequest?.id) {
                if (moment().toDate() < moment(packageDetails.updated_at).add(7, 'd')) {
                    return true;
                } else return false;
            } return false;
        } else return false;
    }

    const canShowCompletePayamnt = (date) => {
        if (moment().isBefore(moment(date).add(1, "h"))) return true;
        else return false;
    }

    const isOrderCancled = () => {
        if (orderInfo && orderInfo.orderItem) {
            let isCancled = true;

            orderInfo.orderItem.forEach(item => {
                if (item?.packageDetails?.status === "CANCELLED") isCancled = false;
            })

            return isCancled;
        }
    }

    useEffect(() => {
        generateOrderInfo();
    }, [query.orderId]);

    return (
        <div className="trackorder">
            {
                loading ? <div className={ `row product-wrapper` }>
                    {
                        [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                            <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                        )
                    }
                </div> : ""
            }
            <div className='row'>
                <div className='col-md-5'>
                    <h3 className="title title-simple text-left mb-3">Track your Order</h3>
                </div>
                {
                    orderInfo && canShowCompletePayamnt(orderInfo?.created_at) && 
                    isOrderCancled() &&
                    orderInfo.payment_method !== 'cash_on_delivery' && orderInfo?.payment_status === "un_paid" ? <>
                        <div className='col-md-4'>
                            {/* Place your order within <TimeCoundown time={orderInfo?.created_at}/> */}
                            You have 1 hour to complete your Order. Otherwise your order will be cancled. 
                        </div>
                        <div className='col-md-3'>
                            <button type="button" className="btn btn-primary btn-rounded float-right">
                                <ALink className="button wc-backward btn-md" href={`/payment/payment-method-selection/${query.orderId}`}>
                                    Complete Payment
                                </ALink>
                            </button>
                        </div>
                    </> : ''
                }
            </div>
            <hr/>
            
            <div className="card custom-bordered mt-4" style={{borderRadius:5}}>
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <div className="mr-auto">
                            <h3 className="title title-simple title-small-custom text-left mb-0">
                                Order No: {query.orderId}
                            </h3>
                        </div>
                        {/* {order.unit_price} */}
                        <div className="text-black font-weight-bold"><a href="#">
                            Total : ৳{ orderInfo?.order_total }</a></div>
                    </div>
                </div>
            </div>

            {
                orderInfo ? <Fragment>
                     {
                        orderInfo?.orderItem.map((order, index) => <Fragment key={'itemsorder-' + index}>
                            <div className="card custom-bordered mt-4" style={{borderRadius:5}}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="mr-auto">
                                            <h3 className="title title-simple title-small-custom text-left mb-1">
                                                <i className="d-icon-gift font-weight-bold font-20"> </i> Package {index + 1}
                                            </h3>
                                            <span>Sold By: {order?.productVariation?.productDetails?.sellerDetails?.shop_name || 'N/A'}</span>
                                        </div>
                                        {/* <div className="font-weight-normal"><a href="#"><i className="far fa-comment-alt"> </i> Chat now</a></div> */}
                                    </div>
                                    <hr className="mt-3 mb-3" />
                                    
                                    <ul className="StepProgress">
                                        {/* <li className="StepProgress-item">
                                            <strong>Approximate Delivery - 23 November, 2021 </strong>
                                            <p className="mb-0"> Product will be delivered at your doorstep </p> 
                                            </li>
                                        <li className="StepProgress-item current"><strong>Shipped </strong>
                                            <p className="mb-0"> Your package has been handed over to BD-DEX. </p>
                                            <p className="mb-0 font-weight-normal font-13"> 21 November, 2021 - 10.00 AM </p> 
                                        </li>
                                        <li className="StepProgress-item current"><strong>Picked </strong>
                                            <p className="mb-0"> Your package has been picked up from Seller. </p>
                                            <p className="mb-0 font-weight-normal font-13"> 20 November, 2021 - 4.25 PM </p> 
                                        </li>
                                        <li className="StepProgress-item is-done"><strong>Processing</strong>
                                            <p className="mb-0"> Your package has been picked up from Seller. </p>
                                            <p className="mb-0 font-weight-normal font-13"> 20 November, 2021 - 4.25 PM </p> 
                                        </li>
                                        <li className="StepProgress-item is-done"><strong>Order Placed - 20 November, 2021</strong>
                                            <p className="mb-0"> Your order has been started. </p>
                                        </li>  */}
                                        
                                        {
                                            order?.packageDetails?.packageStatusHistory.length 
                                                ? [...order?.packageDetails?.packageStatusHistory].reverse().map((his, i) => <li className={`StepProgress-item ${i === 0 ? 'current' : ''} `}
                                                    key={his.updated_at}>
                                                        <strong>{orderStatusShow(his.status)} </strong>
                                                        <p className="mb-0"> {his.message} </p>
                                                        <p className="mb-0 font-weight-normal font-13"> 
                                                            {dateFormate(his.updated_at)}
                                                        </p> 
                                                </li>) : ''
                                        }
                                    </ul>

                                    <div className="table-responsive bordered-custom mt-4">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Product Name</th>
                                                    <th>Item</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        {order.product_name}
                                                        <p className="mb-0"> 
                                                            <span className="amount">
                                                                {/* Color: White , Size: Large */}
                                                                {order.productVariation?.variationAttribute?.length ? <>
                                                                    {
                                                                        order.productVariation?.variationAttribute.map((att, i) => <Fragment key={'tree-' + i }>
                                                                            <span style={{textTransform: "capitalize"}}>{att?.attributeDetails?.code}</span>: {att?.attribute_value}
                                                                            {(order.productVariation?.variationAttribute?.length - 1) !== i ? ',' : ''} &nbsp;
                                                                        </Fragment>)
                                                                    }
                                                                </> : ''}
                                                            </span> 
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <span className="product-thumb-img-custom">	
                                                            <img src={ order?.productVariation?.productVariationImage[ 0 ]?.image_path ? process.env.NEXT_PUBLIC_ASSET_URI + "/"
                                + order?.productVariation?.productVariationImage[ 0 ]?.image_path : './images/B71_02.png' } />
                                                        </span>
                                                    </td>
                                                    <td>৳{ order.unit_price }</td>
                                                    <td>{ order.quantity }</td>
                                                    <td>৳{ order.unit_price * order.quantity }</td>
                                                    <td>{orderStatusShow(order?.packageDetails?.status)}</td>
                                                    <td>
                                                        <div className="font-weight-normal">
                                                            <a> 
                                                                {
                                                                    (orderInfo.payment_method !== 'default' && 
                                                                    (orderInfo?.payment_status !== "un_paid" || orderInfo.payment_method === "cash_on_delivery" )
                                                                        && (order?.packageDetails?.status === 'ORDER_PLACED' || order?.packageDetails?.status === 'PROCESSING')) ? <
                                                                        div className="">
                                                                            <a className="btn btn-block btn-link text-left" style={{color: "#b10001"}}
                                                                                onClick={() => { setIsOpen(true), setSelectOrder(order) }}>
                                                                                Cancel Order
                                                                            </a>
                                                                        </div> : ""
                                                                }

                                                                {
                                                                    (canReturnRequest(order.packageDetails)) ? <
                                                                        div className="">
                                                                            <a className="btn btn-block btn-link text-left" style={{color: "#b10001"}}
                                                                                onClick={() => { setRetunrModalIsOpen(true), setSelectOrder(order) }}>
                                                                                Return Request
                                                                            </a>
                                                                        </div> : ""
                                                                }

                                                                {
                                                                    (order?.packageDetails?.status === 'RETURN_APPROVED' && !order?.packageDetails?.hasRefundRequest?.id ) ? <
                                                                        div className="">
                                                                            <a className="btn btn-block btn-link text-left" style={{color: "#b10001"}}
                                                                                onClick={() => { setRefundModalIsOpen(true), setSelectOrder(order) }}>
                                                                                Refund Request
                                                                            </a>
                                                                        </div> : ""
                                                                }

                                                                {/* {
                                                                    !(order?.packageDetails?.status === 'ORDER_PLACED' || 
                                                                    order?.packageDetails?.status === 'PROCESSING') ? <span tooltip="Cancellation Not Available  
                                                                            Sorry, you cannot cancel this package as it has already been shipped by the seller. If you still wish to cancel the package please contact b71 customer support." flow="down"> <i className="d-icon-info ml-1"></i> 
                                                                    </span> : ''
                                                                } */}
                                                            </a>

                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Fragment>)
                     }

                    <div className="row mt-4">
                        <div className="col-lg-7 col-md-7 col-sm-12 col-sx-12">
                            <div className="card custom-bordered" style={{borderRadius:5}}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="mr-auto">
                                            <h3 className="title title-simple title-small-custom text-left mb-0">Address</h3>
                                        </div>
                                    </div>
                                    <hr className="mt-2 mb-3" />
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <h6 className="mb-2"><i className="d-icon-map"> </i> Shipping Address</h6>
                                            <p className="mb-1 font-13"> {shippingAddress?.address} </p>
                                            <a href="#." className="font-13"> 
                                                <i className="d-icon-phone font-15"></i> {shippingAddress?.phone}
                                            </a>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <h6 className="mb-2"><i className="d-icon-map"> </i> Billing Address</h6>
                                            <p className="mb-1 font-13"> {billingAddress?.address} </p>
                                            <a href="#." className="font-13"> 
                                                <i className="d-icon-phone font-15"> </i> 
                                                {billingAddress?.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-5 col-sm-12 col-sx-12">
                            <div className="card custom-bordered" style={{borderRadius:5}}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="mr-auto">

                                            <h3 className="title title-simple title-small-custom text-left mb-0">Total Summary 
                                                {orderInfo.payment_method === 'sslcommerz' ? ' ( SSLCOMMERZ )' : ''}
                                                {orderInfo.payment_method === 'cash_on_delivery' ? ' ( Cash On Delivery )' : ''}
                                                {orderInfo.payment_method === 'default' ? ' ( N/A )' : ''}
                                                </h3>
                                        </div>
                                    </div>
                                    <hr className="mt-2 mb-3" />
                                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2 pt-1 mt-1 mb-1">
                                        <h6 className="m-0">Subtotal</h6> 
                                        <span className="">৳ {showSubTotal(orderInfo.orderItem)}</span>   
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2 pt-1 mt-1 mb-1">
                                        <h6 className="m-0">Shipping Fee</h6> 
                                        <span className="">৳ { orderInfo.shipping_fee }</span>   
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2 pt-1 mt-1 mb-1">
                                        <h6 className="m-0">Discount</h6> 
                                        <span className="">- ৳ { orderInfo.discount_amount }</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between pb-2 pt-1 mt-1 mb-1">
                                        <h6 className="m-0">Total</h6> 
                                        <span className="font-weight-bold">
                                            ৳ { orderInfo.order_total }
                                        </span>   
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment> : <div className="empty-cart text-center pt-5 pb-5">
                            <p>Order Not found.</p>
                            <i className="cart-empty d-icon-heart"></i>
                            <p className="return-to-shop mb-0">
                                <ALink className="button wc-backward btn btn-dark btn-md" href="/s">
                                    Return to shop
                                </ALink>
                            </p>
                        </div>
            }

            {/* Start Cancel Order  */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal} 
                contentLabel="Example Modal"  
                className="cancel-modal-test"
            >
                <CancelOrderModel closeModal={closeModal} reasons={reasons}
                    generateOrderInfo={generateOrderInfo} selectOrder={selectOrder}/>
            </Modal>

            {/* End Cancel Order */}

            {/* Start return request  */}
            <Modal
                isOpen={returnModalIsOpen}
                onRequestClose={closeReturnModal} 
                contentLabel="Example Modal"
                className="cancel-modal-test"
            >
                <ReturnRequestModal returnReason={returnReason} closeReturnModal={closeReturnModal} 
                    generateOrderInfo={generateOrderInfo} selectOrder={selectOrder}></ReturnRequestModal>
            </Modal>
            {/* End return Request  */}

            {/* Start refund request */}
            <Modal
                isOpen={refundModalIsOpen}
                onRequestClose={closeRefundModal} 
                contentLabel="Example Modal"
                className="cancel-modal-test"
            >
                <RefundRequestModal closeRefundModal={closeRefundModal} 
                    generateOrderInfo={generateOrderInfo} selectOrder={selectOrder}></RefundRequestModal>
            </Modal>
            {/* End Refund Request  */}

            
        </div>
    )
}
