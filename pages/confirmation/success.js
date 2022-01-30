import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { ORDER_DETAILS } from '../../server/queries';
import { useLazyQuery } from '@apollo/client';
import { dateFormate } from "../../utils/helpers";
import ALink from '../../components/features/custom-link';

const success = () => {
    const router = useRouter();
    const query = router.query;
    const [orderInfo, setOrderInfo] = useState();

    const [ getOrderInfo, { data, loading, error } ] = useLazyQuery( ORDER_DETAILS, {
        fetchPolicy: 'network-only',
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
                if (graphQLErrors?.length) {
                    console.log("graphQLErrors", graphQLErrors);
                }
            },
        onCompleted(data) {
            setOrderInfo(data?.orderDetails)
        }
    });

    const generateOrderInfo = () => {
        getOrderInfo( {
            variables: {
                orderDetailsId: parseInt(query.orderID),
            }
        })
    }

    const showMailAddress = (order) => {
        console.log("order", order);
        let shipping_address = JSON.parse(order.shipping_address);

        if (shipping_address) return shipping_address.email;
    }

    useEffect(() => {
        generateOrderInfo()
    }, [])

    return (
        <div className="row success pb-8 mb-10"> 
            {
                orderInfo ? <div className="col-md-7 m-auto text-center">
                    <Image
                        src={"/images/success.svg"}
                        alt="Picture of the author"
                        placeholder="blur"
                        width={350}
                        height={350}
                        quality={90}
                        blurDataURL="/images/success.svg"
                    />
                    <h4 className="mb-1"> Thank You !</h4>
                    <p className="mb-0"> Your order #{orderInfo.id} has been placed successfully.</p>
                    <p className="muted"> Time: {dateFormate(orderInfo.created_at)} </p>

                    <p> We have sent an email to {showMailAddress(orderInfo)} with your order confirmation and invoice. </p>

                
                    <ALink href={`/my-account/?content=track-order&orderId=${query.orderID}`} 
                        className="btn btn-sm btn-outline-primary mr-2"> View Order 
                    </ALink>
                    <ALink href={`/s/`} className="btn btn-sm btn-primary"> Continue Shopping </ALink>
                </div> : <div className={ `row product-wrapper` }>
                        {
                            [ 1 ].map( ( item ) =>
                                <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                            )
                        }
                    </div>
            }
            
        </div>
    )
}

export default success;