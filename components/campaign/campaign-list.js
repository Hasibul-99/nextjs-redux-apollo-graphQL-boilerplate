import { useEffect } from 'react';
import { useRouter } from 'next/router';

import ToolBox from '../partials/shop/toolbox';
import ProductTwo from '../../components/product/product-two';
import ProductEight from '../../components/features/product/product-eight';
import Pagination from '../../components/features/pagination';

function CampaignList( props ) {
    const { itemsPerRow = 5, type = "left", isToolbox = true } = props;
    const { products, loading, paginatorInfo, perPage, page }  = props;

    const router = useRouter();
    const query = router.query;

    const gridClasses = {
        3: "cols-2 cols-sm-3",
        4: "cols-2 cols-sm-3 cols-md-4",
        5: "cols-2 cols-sm-3 cols-md-4 cols-xl-5",
        6: "cols-2 cols-sm-3 cols-md-4 cols-xl-6",
        7: "cols-2 cols-sm-3 cols-md-4 cols-lg-5 cols-xl-7",
        8: "cols-2 cols-sm-3 cols-md-4 cols-lg-5 cols-xl-8"
    };

    const gridType = query.type ? query.type : 'grid';

    return (
        <>
            {/* {
                isToolbox ? <ToolBox type={ type } /> : ''
            } */}
            <div className="p-5 m-5">
                <br/>
                <br/>
            </div>
            {
                loading ?
                    gridType === 'grid' ?
                        <div className={ `row product-wrapper ${ gridClasses[ itemsPerRow ] }` }>
                            {
                                [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                    <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                                )
                            }
                        </div> :
                        <div className="row product-wrapper skeleton-body cols-1">
                            {
                                [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                    <div className="skel-pro skel-pro-list mb-4" key={ 'list-skel-' + item }></div>
                                )
                            }
                        </div>
                    : ''
            }
            
            {
                gridType === 'grid' ?
                    <div className={ `row product-wrapper ${ gridClasses[ itemsPerRow ] }` }>
                        { products && products.map( (item, index) =>
                            <div className="product-wrap" key={ 'shop-' + index }>
                                {console.log("item?.productVariation", item?.productVariation)}
                                <ProductTwo product={ item?.productVariation?.productDetails } 
                                    // price={item?.productVariation?.price}
                                    adClass="" 
                                    imageWidth={350} 
                                    imageHight={350} />
                            </div>
                        ) }
                    </div>
                    :
                    <div className="product-lists product-wrapper">
                        { products && products.map( (item, index) =>
                            <ProductEight product={ item?.productVariation?.productDetails }
                                price={item?.productVariation?.price} key={ 'shop-list-' + index } />
                        ) }
                    </div>
            }

            {
                products && products.length === 0 ?
                    <p className="ml-1">No products were found matching your selection.</p> : ''
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
        </>
    )
}

export default CampaignList;