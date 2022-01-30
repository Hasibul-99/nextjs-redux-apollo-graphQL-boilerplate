import React from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import ALink from '../../components/features/custom-link';

export default function success() {
    const router = useRouter();
    const query = router.query;
    
    return (
        <div className="row success pt-10 pb-8 mb-10"> 
            <div className="col-md-7 m-auto text-center">
                <Image
                    src={"/images/failed.svg"}
                    alt="Picture of the author"
                    placeholder="blur"
                    width={350}
                    height={350}
                    quality={90}
                    blurDataURL="/images/failed.svg"
                />
                <h4 className="mb-1"> Payment Failed !</h4>
                <p> Oops! Something went wrong while payment an order. Please try again.</p>
               
                <ALink href={`/s/`} className="btn btn-sm btn-outline-primary mr-2"> Continue Shopping </ALink>
                <ALink href={`/payment/payment-method-selection/${query.orderID}`} className="btn btn-sm btn-primary"> Try Again </ALink>  
            </div>
        </div>
    )
}
