import ALink from '../../features/custom-link';
import moment from 'moment';

import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { CUSTOMER_REVIEWS } from '../../../server/queries';
import { Fragment, useEffect } from 'react';
import Pagination from '../../../components/features/pagination';
import {productImage} from "../../../utils";

export default function ReviewHisport() {
    const router = useRouter();
    const query = router.query;

    const [ getCustomerReview, { data, loading, error } ] = useLazyQuery( CUSTOMER_REVIEWS, {
        fetchPolicy: 'network-only',
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        },
    });

    const reviews = data && data.customerReviews.data;
    const paginatorInfo = data && data.customerReviews.paginatorInfo;
    const perPage = query.per_page ? parseInt( query.per_page ) : 10;
    const page = query.page ? query.page : 1;

    const showRating = (rating) => {
        return 20 * rating;
    }

    useEffect(() => {
        getCustomerReview( {
            variables: {
                first: parseInt(perPage),
                page: parseInt(page),
                languageId: router.locale === 'en' ? 1 : 2
            }
        })
    }, [])


    return (
        <div className="row flex reviews-custom">
            {
                reviews?.length ? reviews.map((review, index) => <Fragment key={'review-cus-' + index}>
                    <div className="col-md-12 col-sm-12 col-xs-12 mb-4" >
                        <div className="card custom-bordered review-history">
                            <div className="card-body">
                                <div className="row d-flex align-items-center">
                                    <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                                        <div className="row d-flex align-items-center left-section">
                                            <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 mt-2 mb-2">
                                                <img src={productImage(review?.productDetails)} />
                                            </div>
                                            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mt-2 mb-2 text">
                                                <p className="mb-0 muted font-12"> Purchased On: {moment(review?.order?.created_at).format("DD MMM, YYYY")} </p>
                                                <h6 className="mb-0 font-weight-normal">
                                                    <ALink href={`/product/${review?.productDetails?.url_key}/`}> {review.productDetails?.productDetail[0]?.name} </ALink> 
                                                </h6>
                                                {/* <p className="mb-0"> 
                                                    <small className="mb-0"> Color: Green, Size: Lage </small>   
                                                </p> */}
                                                <p className="mb-0">  
                                                    <small className="mb-0"> Sold By: { review.productDetails?.sellerDetails?.shop_name } </small>   
                                                </p> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="ratings-container mt-2 mb-2">
                                                    <div className="ratings-full">
                                                        <span className="ratings" style={ { width: showRating(review.rating) + '%' } }></span>
                                                    </div>
                                                    {/* <a href="#" className="rating-reviews">Very poor</a> */}
                                                </div> 
                                                <div className="description mb-2">
                                                    <span>{review.customer_comment}</span> 
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            review?.reviewImages?.length ? <div className="row">
                                                <div className="col-12 alignment-custom">
                                                    {
                                                        review?.reviewImages.map((img, i) => <div key={i + img.file_path} className="product-thumb-img-custom mb-2">
                                                            <img src={process.env.NEXT_PUBLIC_ASSET_URI + "/" + img.file_path} />
                                                        </div>)
                                                    }
                                                </div>
                                            </div> : ''
                                        }
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                </Fragment>) : ''
            }

            {
                paginatorInfo?.total > 0 ?
                    <div className="toolbox toolbox-pagination">
                        {
                            paginatorInfo && <p className="show-info">Showing <span>
                                { perPage * ( page - 1 ) + 1 } - { Math.min( perPage * page, paginatorInfo.total ) } of { paginatorInfo.total }
                            </span>Products</p>
                        }

                        <Pagination totalPage={ paginatorInfo?.lastPage } />
                    </div> : ''
            }   
            
            {/* <div className="col-md-12 col-sm-12 col-xs-12 mb-4">
                <div className="card custom-bordered review-history">
                    <div className="card-body">
                        <div className="row d-flex align-items-center">
                            <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                                <div className="row d-flex align-items-center left-section">
                                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 mt-2 mb-2">
                                        <img src="../images/products/product1.jpg" />
                                    </div>
                                    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mt-2 mb-2 text">
                                        <p className="mb-0 muted font-12"> Purchased On: 12 Sep, 2021 </p>
                                        <h6 className="mb-0 font-weight-normal">
                                            <a href="#."> Yoga mat TPE </a> 
                                        </h6>
                                        <p className="mb-0"> 
                                            <small className="mb-0"> Color: Green, Size: Lage </small>   
                                        </p>
                                        <p className="mb-0">  
                                            <small className="mb-0"> Sold By: Friends Sports </small>   
                                        </p> 
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="ratings-container mt-2 mb-2">
                                            <div className="ratings-full">
                                                <span className="ratings" style={ { width: 20 * 5 + '%' } }></span>
                                            </div>
                                            <a href="#" className="rating-reviews">Excellent</a>
                                        </div> 
                                        <div className="description mb-2">
                                            <span>Good quality also fast delivery</span> 
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="product-thumb-img-custom mb-2">
                                            <img src="../images/products/product1.jpg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </div> */}
        </div>
    )
}
