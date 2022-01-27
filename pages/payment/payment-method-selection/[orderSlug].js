import React, { useEffect, useState } from 'react';
import { PAYMENT_INTRIGATION, ORDER_DETAILS_QUERY, ORDER_CANCEL_FROM_PAYMENT_PAGE } from '../../../server/queries';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import moment from "moment";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '5px',
      border: '1px solid #f2f2f2',
    },
};

const PaymentMethodSelection = ({isUserLogin, orderDetails}) => {
    const router = useRouter();
    const query = router.query;
    const [paymentType, setPaymentType] = useState('SSL');
    const [isLoading, setIsLoading] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);

    const [paymentIntrigation] = useMutation(PAYMENT_INTRIGATION, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
                toast.error(graphQLErrors[0].message);
            }
        }
    });

    const [ orderCancel ] = useMutation(ORDER_CANCEL_FROM_PAYMENT_PAGE, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
                toast.error(graphQLErrors[0].message);
            }
        }
    })

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

    const placeOrder = async () => {
        let res = await paymentIntrigation({
            variables: {
                "orderId": parseInt(query.orderSlug),
                "paymentMethod": paymentType === 'SSL' ? 'sslcommerz' : 'cash_on_delivery'
            }
        });

        if (res && res?.data?.paymentInitiate) {
            if ( res?.data?.paymentInitiate?.GatewayPageURL ) {
                window.location.replace(res?.data?.paymentInitiate?.GatewayPageURL)
            }

            if (res?.data?.paymentInitiate?.order?.id) {
                router.push( `/my-account/?content=track-order&orderId=${query.orderSlug}` );
            }
        }
    }

    const cancelOrderConfirm = async () => {
        let res = await orderCancel({
            variables: {
                "orderId": parseInt(query.orderSlug)
            }
        });

        if (res?.data?.orderCancelFromPaymentPage) {
            toast.success( res?.data?.orderCancelFromPaymentPage?.message );
            
            setTimeout(() => {
                router.push( `/my-account/?content=order-history` );
            }, 500)
        }
    }

    const canShowCompletePayamnt = (date) => {
        if (moment().isBefore(moment(date).add(1, "h"))) return true;
        else return false;
    }

    const isOrderCancled = (orderInfo) => {
        if (orderInfo && orderInfo.orderItem) {
            let isCancled = true;

            orderInfo.orderItem.forEach(item => {
                if (item?.packageDetails?.status === "CANCELLED") isCancled = false;
            })

            return isCancled;
        }
    }

    useEffect(() => {
        if (isUserLogin && orderDetails) {
            if (orderDetails) {
                setIsLoading(false);
            }
            
            if (!(canShowCompletePayamnt(orderDetails?.created_at) && isOrderCancled(orderDetails) && 
                orderDetails.payment_method !== 'cash_on_delivery' && orderDetails?.payment_status === "un_paid") ) {
                router.push('/my-account/?content=order-history');
            }
        } else {
            router.push({ pathname: '/'});
        }
    }, []);

    return (
        <div className="payment-method row pt-10 pb-5 mb-10">
            {
                isLoading ? <div>
                    <div className={ `row product-wrapper` }>
                        {
                            [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                            )
                        }
                    </div> 
                </div> : <div className="col-lg-8 col-md-10 col-sm-12 m-auto">  
                    <div className="row text-center justify-content-center"> 
                        <h4 className="mb-0"> Order Number #{orderDetails ? orderDetails.id : ''} </h4>
                        <h6 className="mb-0"> Please select a payment method below </h6> 
                        
                        <div className="row mb-5 m-auto justify-content-center p-0"> 
                            <div className="col-lg-4 payment-col"> 
                                <label htmlFor="radio-card-2" className="radio-card" onClick={() => setPaymentType("SSL")}>
                                    <input type="radio" name="radio-card" id="radio-card-2" checked={paymentType === 'SSL' ? true : false } />
                                    <div className="card-content-wrapper">
                                    <span className="check-icon"></span>
                                    <div className="card-content">
                                        <img src={"/images/online-payment.png"} width="150px" className="w-120"/> 
                                        <h4>Online Payment</h4> 
                                    </div>
                                    </div>
                                </label>
                            </div>
                            <div className="col-lg-4 payment-col"> 
                                <label htmlFor="radio-card-3" className="radio-card" onClick={() => setPaymentType("COD")}>
                                    <input type="radio" name="radio-card" id="radio-card-3" checked={paymentType === 'COD' ? true : false } />
                                    <div className="card-content-wrapper">
                                    <span className="check-icon"></span>
                                    <div className="card-content">
                                        <img src={"/images/delivery.svg"} width="62px" className="w-62" /> 
                                        <h4>Cash on Delivery</h4> 
                                    </div>
                                    </div>
                                </label>
                            </div> 
                        </div>
                    </div>

                    <hr/>

                    {
                        orderDetails ? <div className="row pt-3 justify-content-center"> 
                                <div className="col-lg-8 order-summary"> 
                                    <h5 className="mb-1"> Order Summary </h5>
                                    <ul className="list-group pl-0 mt-0">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Subtotal 
                                            <span className="">৳ {showSubTotal(orderDetails?.orderItem)}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Delivery Charge
                                            <span className="">৳ { orderDetails?.shipping_fee }</span>
                                        </li>
                                        {
                                            orderDetails?.discount_amount ? <li className="list-group-item d-flex justify-content-between align-items-center">
                                                Discount Total
                                                <span className="">- ৳ { orderDetails?.discount_amount}</span>
                                            </li> : ''
                                        }
                                        
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <strong> Payment to Pay </strong>  
                                            <span className="font-weight-bold">৳ { orderDetails?.order_total }</span>
                                        </li>
                                    </ul>
                                </div>
                            </div> : ''
                    }

                    {/* end row */} 

                    <hr/>
                    <div className="row pt-3 justify-content-center">   
                        <div className="col-lg-8 text-center">
                            <button className="btn btn-outline-secondary btn-rounded btn-sm mr-2" type="button"
                                onClick={() => {setIsOpen(true)}}>Cancel
                            </button>
                            <button className="btn btn-secondary btn-rounded btn-sm" type="button" 
                                onClick={() => placeOrder()}>
                                {paymentType === 'COD' ? 'Confirm Order' : 'Pay Now'}
                            </button>  
                        </div> 
                    </div> {/* end row */}
                </div>  
            } 

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => {setIsOpen(false)}}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <section className="error-section d-flex flex-column justify-content-center align-items-center text-center">
                    <div className="remove-btn-modal-custom" onClick={() => setIsOpen(false)}>
                        <i className="fas fa-times"></i>
                    </div>
                    <h1 className="mb-2 ls-m">Warning!</h1>
                    <img className="img-fluid" src="../images/delete-cart.svg" alt="" />
                    <h4 className="mt-7 mb-0 ls-m">Cancel Order</h4>
                    <p className="text-grey font-primary ls-m mb-1">Are you sure want to cancel this order?</p>
                    <div className="d-flex justify-content-between mt-4">
                        <button className="btn btn-outline btn-rounded mb-4 mr-4" onClick={() => setIsOpen(false)}>Cancel</button>
                        <button className="btn btn-primary btn-md btn-rounded btn-icon-left mb-4"
                            onClick={() => cancelOrderConfirm()}>Confirm</button>
                    </div> 
                </section>
            </Modal>      
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        isUserLogin: state.user.isUserLogin
    }
}

PaymentMethodSelection.getInitialProps = async ( ctx ) => {
    const token = Cookies.get('b71_access_token');

    let results = await fetch(`${ process.env.NEXT_PUBLIC_SERVER_URL }/graphql`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
            query: ORDER_DETAILS_QUERY,
            variables: {
                orderDetailsId: parseInt(ctx.query.orderSlug)
            }})
        })
        let orderDetails = await results.json();

        return {
            orderDetails: orderDetails?.data?.orderDetails
        }
};

export default PaymentMethodSelection;


