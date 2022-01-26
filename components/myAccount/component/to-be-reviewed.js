import { useEffect } from 'react';
import ALink from '../../../components/features/custom-link';

import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { PACKAGE_TO_BE_REVIEWS } from '../../../server/queries';
import { dateFormate } from "../../../utils/helpers";
import Pagination from '../../../components/features/pagination';

export default function ToBeReviewed() {
    const router = useRouter();
    const query = router.query;

    const [ getTOBeReview, { data, loading, error } ] = useLazyQuery( PACKAGE_TO_BE_REVIEWS, {
        fetchPolicy: 'network-only'
    });

    const packages = data && data.packageToBeReviews.data;
    const paginatorInfo = data && data.packageToBeReviews.paginatorInfo;

    const perPage = query.per_page ? parseInt( query.per_page ) : 10;
    const page = query.page ? query.page : 1;

    useEffect(() => {
        getTOBeReview( {
            variables: {
                first: parseInt(perPage),
                page: parseInt(page),
                languageId: router.locale === 'en' ? 1 : 2
            }
        })
    }, [query]);

    return (
        <div>
            <div className="table-responsive bordered-custom">
                <table className="table table-striped review-table">
                    <thead>
                        <tr>
                            <th>
                            <span>Date</span>
                            </th>
                            <th>
                            <span>Image</span>
                            </th>
                            <th>
                            <span>Product Name</span>
                            </th>
                            <th>
                            <span>Sold by</span>
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="wishlist-items-wrapper">
                        {
                            packages?.length ? packages.map((pack, index) => <tr key={'to-be-reviewed-' + index}>
                                <td>
                                    <ALink href={`/product/${pack.productVariation?.productDetails?.url_key}/`}>
                                        {dateFormate(pack?.packageDetails?.updated_at)}
                                    </ALink>
                                </td>
                                <td>
                                    <ALink href={`/product/${pack.productVariation?.productDetails?.url_key}/`}>
                                        <figure>
                                        <div className="product-thumb-img-custom4">
                                            {
                                                pack.productVariation?.productVariationImage?.length 
                                                    ? pack.productVariation?.productVariationImage.map(image => <img key={image.image_path}
                                                        src={ process.env.NEXT_PUBLIC_ASSET_URI + "/" + image.image_path } 
                                                        alt="product" />) : ''
                                            }
                                            
                                        </div>
                                        </figure>
                                    </ALink>
                                </td>
                                <td>
                                    <ALink href={`/product/${pack.productVariation?.productDetails?.url_key}/`}>
                                        {pack.product_name}
                                    </ALink>
                                </td>
                                <td>{ pack.productVariation?.productDetails?.sellerDetails?.shop_name }</td>
                                <td>
                                    <ALink href={`/my-account/?content=review-add&productId=${pack?.productVariation?.product_id}&pr_n=${pack?.product_name}&orderId=${pack.order_id}&orderItemId=${pack?.packageDetails?.order_item_id}&shop_name=${pack?.productVariation?.productDetails?.sellerDetails?.shop_name}`}>
                                        <button className="btn btn-secondary btn-outline btn-sm btn-rounded">Review</button>
                                    </ALink>
                                </td>
                            </tr>) : ''
                        }
                    </tbody>
                </table>
            </div>
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
        </div>    
    )
}
