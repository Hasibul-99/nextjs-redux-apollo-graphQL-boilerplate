import { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ALink from '../../components/features/custom-link';

import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { cartActions } from '../../store/cart';
import { wishlistActions } from '../../store/wishlist';
import Pagination from '../../components/features/pagination';

import { useMutation, useLazyQuery } from '@apollo/client';
import { DELETE_WISHLIST, GET_USER_WISHLISTS } from '../../server/queries';

import { toDecimal, originalPriceFromCart } from '../../utils';

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

function Wishlist( props ) {
    const { addToCart, removeFromWishlist } = props;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedWish, setSelectedWish] = useState();
    const router = useRouter();
    const query = router.query;
    const [getWishList, { data, loading, error }] = useLazyQuery(GET_USER_WISHLISTS, {
        fetchPolicy: 'network-only'
    });

    const wishLists = data?.wishlist?.wishlistItems || [];
    const [reset, setReset] = useState(1);


    const [ deleteWishlist ] = useMutation( DELETE_WISHLIST, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        }
    });
    
    const moveToCart = ( e, item ) => {
        e.preventDefault();
        addToCart( { ...item, qty: 1, price: item.price[ 0 ] } );
        removeFromWishlist( item );
    }

    const closeModal = () => {
        setIsOpen(false);
        setSelectedWish(null);
    }

    const confirmDelete = async () => {
        console.log("selectedWish", selectedWish);
        const res = await deleteWishlist({
            variables: {
                variationId: parseInt(selectedWish.variation_id)
            }
        });

        if (res?.data?.deleteWishList) {
            removeFromWishlist( selectedWish.variation_id );
            setIsOpen(false);
            setReset(reset + 1);
            toast.success( <div className="m-5"> Wish deleted successfully. </div> );
        } else {
            toast.error( <div className="m-5"> Something went wrong, Please try again later. </div> );
        }
    }

    useEffect(() => {
        getWishList({
            variables: {
                languageId: router.locale === 'en' ? 1 : 2
            }
        })
    }, [reset])

    useEffect(() => {
        console.log("data =====> ", data);
    }, [data])

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">My Wishlist</h3>
            <hr className="mb-2"/>

            {
                loading ? <div className={ `row product-wrapper` }>
                            {
                                [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                    <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                                )
                            }
                        </div> : ''
            }
            <div className="page-content">
                {
                    wishLists.length ?
                        <>
                        <div className="table-responsive bordered-custom">
                            <table className="table table-striped shop-table wishlist-table">
                                <thead>
                                    <tr>
                                        <th className="product-name"><span>Product</span></th>
                                        <th></th>
                                        <th className="product-price"><span>Price</span></th>
                                        <th className="product-stock-status"><span>Stock status</span></th>
                                        <th className="product-add-to-cart"></th>
                                        <th className="product-remove"></th>
                                    </tr>
                                </thead>
                                <tbody className="wishlist-items-wrapper">
                                    {
                                        wishLists.map( ( item, index ) =>
                                            <Fragment key={'wishlist--' + index}>
                                                {item?.productVariation ? <tr key={ 'wishlist--' + index }>
                                                    <td className="product-thumbnail">
                                                        <ALink href={ '/product/' + item?.productVariation?.productDetails?.url_key }>
                                                            <figure>
                                                                <div className="product-thumb-img-custom">
                                                                <img src={ item?.productVariation?.productVariationImage[ 0 ]?.image_path ?  process.env.NEXT_PUBLIC_ASSET_URI + "/"
                                + item?.productVariation?.productVariationImage[ 0 ]?.image_path : './images/B71_02.png' }
                                                                    alt="product" />
                                                                </div>
                                                            </figure>
                                                        </ALink>
                                                    </td>
                                                    <td className="product-name">
                                                        <ALink href={ '/product/' + item?.productVariation?.productDetails?.url_key }>
                                                            { item?.productVariation?.productDetails?.productDetail[0]?.name }
                                                        </ALink>
                                                    </td>
                                                    <td className="product-price">
                                                        <span className="amount">৳ { toDecimal( originalPriceFromCart(item)) }</span>
                                                    </td>
                                                    <td className="product-stock-status">
                                                        <span className={ item?.productVariation?.qty > 0 ? 'wishlist-in-stock' : 'wishlist-out-stock' }>
                                                            { item?.productVariation?.qty > 0 ? 'In Stock' : 'Out of Stock' }
                                                        </span>
                                                    </td>
                                                    <td className="product-add-to-cart">
                                                        <ALink href={ '/product/' + item?.productVariation?.productDetails?.url_key } className="btn btn-sm btn-link btn-underline text-secondary p-0">
                                                            <span>View Product</span>
                                                        </ALink> 
                                                        {/* <a href="#" className="btn-product btn-primary" onClick={ ( e ) => moveToCart( e, item ) }>
                                                            <span>Add to Cart</span>
                                                        </a> */}
                                                    </td>
                                                    <td className="product-remove">
                                                        <div>
                                                            <ALink href="#" className="remove" title="Remove this product"><i
                                                                className="fas fa-times" onClick={ () => { setIsOpen(true); setSelectedWish(item) }}></i></ALink>
                                                                {/* removeFromWishlist( item ) */}
                                                        </div>
                                                    </td>
                                                </tr> : <Fragment key={'wishlist--' + index}></Fragment>}
                                            </Fragment>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        </>
                        :
                        <div className="empty-cart text-center pt-5 pb-5">
                            <p>No products added to the wishlist.</p>
                            <i className="cart-empty d-icon-heart"></i>
                            <p className="return-to-shop mb-0">
                                <ALink className="button wc-backward btn btn-dark btn-md" href="/s">
                                    Return to shop
                                </ALink>
                            </p>
                        </div>
                }
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <section className="error-section d-flex flex-column justify-content-center align-items-center text-center">
                    <div className="remove-btn-modal-custom" onClick={() => setIsOpen(false)}>
                        <i className="fas fa-times"></i>
                    </div>
                    <h1 className="mb-2 ls-m">Warning!</h1>
                    <img className="img-fluid" src="../images/delete-cart.svg" alt="" />
                    <h4 className="mt-7 mb-0 ls-m">Delete from wishlist?</h4>
                    <p className="text-grey font-primary ls-m mb-1">Are you sure want to delete this item?</p>
                    <div className="d-flex justify-content-between mt-4">
                        <button className="btn btn-outline btn-rounded mb-4 mr-4" onClick={() => setIsOpen(false)}>Cancel</button>
                        <button className="btn btn-primary btn-md btn-rounded btn-icon-left mb-4"
                            onClick={() => confirmDelete()}>Confirm</button>
                    </div> 
                </section>
            </Modal>
        </div>
    )
}

export default Wishlist;

