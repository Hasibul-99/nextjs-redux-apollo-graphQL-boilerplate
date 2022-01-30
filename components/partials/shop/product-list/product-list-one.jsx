import { useRouter } from 'next/router';

import ToolBox from '../toolbox';
import ProductTwo from '../../../product/product-two';
import ProductEight from '../../../features/product/product-eight';
import Pagination from '../../../features/pagination';

// import { GET_PRODUCT_LIST } from '~/server/queries';

function ProductListOne( props ) {
    const { itemsPerRow = 4, type = "left", isToolbox = true, products, count } = props;
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
    const perPage = query.per_page ? parseInt( query.per_page ) : 12;
    const page = query.page ? query.page : 1;
    const gridType = query.type ? query.type : 'grid';

    // useEffect( () => {
    //     getProducts( {
    //         variables: {
    //             languageId: router.locale === 'en' ? 1 : 2,
    //             search: query.search,
    //             colors: query.colors ? query.colors.split( ',' ) : [],
    //             sizes: query.sizes ? query.sizes.split( ',' ) : [],
    //             brands: query.brands ? query.brands.split( ',' ) : [],
    //             min_price: parseInt( query.min_price ),
    //             max_price: parseInt( query.max_price ),
    //             category: query.category,
    //             tag: query.tag,
    //             sortBy: query.sortby,
    //             page: parseInt(page) , //perPage * ( page - 1 ),
    //             first: parseInt(perPage) //perPage * page
    //         }
    //     } );
    // }, [ query ] )

    console.log("products", products);

    return (
        <>
            {
                isToolbox ? <ToolBox type={ type } /> : ''
            }
            {
                !products ?
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
                    <div className={ `row product-wrapper mt-3 ${ gridClasses[ itemsPerRow ] }` }>
                        { products && products.map( item =>
                            <div className="product-wrap" key={ 'shop-' + item._id }>
                                <ProductTwo product={ item._source } adClass="" imageWidth={350} imageHight={350} />
                            </div>
                        ) }
                    </div>
                    :
                    <div className="product-lists product-wrapper">
                        { products && products.map( item =>
                            <ProductEight product={ item._source } key={ 'shop-list-' + item._id } />
                        ) }
                    </div>
            }

            {
                products && products.length === 0 ?
                    <p className="ml-1">No products were found matching your selection.</p> : ''
            }

            {
                count > 0 ?
                    <div className="toolbox toolbox-pagination" style={{paddingLeft: "2rem", paddingRight: "2rem"}}>
                        {
                            <p className="show-info">Showing <span>
                                { perPage * ( page - 1 ) + 1 } - { Math.min( perPage * page, count ) } of { count }
                            </span>Products</p>
                        }

                        <Pagination totalPage={ Math.ceil(count / perPage) } />
                    </div> : ''
            }
        </>
    )
}

export default ProductListOne;