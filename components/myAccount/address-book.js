
import Router from 'next/router';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { USER_ADDRESS, UPADTE_DEFAULT_ADDRESS, GET_LOGIN_USER_INFO } from '../../server/queries';
import ALink from '../../components/features/custom-link';

import { authUserActions } from '../../store/authUser';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
    
function AddressBook({ userInfo, setUserInfo, addressType, handelView, context, setModelOpen  }) {
    const { data, loading, error } = useQuery( USER_ADDRESS, { variables: { }, fetchPolicy: 'network-only' } );
    const [ getUserData, userDataInfo ] = useLazyQuery( GET_LOGIN_USER_INFO, { fetchPolicy: 'network-only' } );

    const address = data && data?.address;
    const [type, setType] = useState();
    const [checkedAddressId, setCheckedAddressId] = useState();

    const [updateDefaultAddress] = useMutation( UPADTE_DEFAULT_ADDRESS, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
                toast.error( <div className="m-5"> First Select Address </div> );
            }
        }
    });

    const isBillingAddress  = (address) => {
        let billingAddress = userInfo && userInfo?.customer?.billingAddressDetails;
        
        if (address?.id && billingAddress?.id && address?.id === billingAddress?.id) return true;
        else return false;
    };

    const isShippingAddress = (address) => {
        let shippingAddressDetails = userInfo && userInfo?.customer?.shippingAddressDetails;

        if (address?.id && shippingAddressDetails?.id && address?.id === shippingAddressDetails?.id) return true;
        else return false;
    };

    const setNewDefaultAddress = async () => {
        if (checkedAddressId && type) {
            let res = await updateDefaultAddress({
                variables: {
                    addressType: type,
                    addressId: checkedAddressId * 1
                }
            });

            if (res?.data?.setDefaultAddress) {
                toast.success( <div className="m-5"> Address Updated Successfully </div> );
                setCheckedAddressId(null);
                setType(null);
                getUserData({ variables: {} });
                if (setModelOpen && context === 'checkout' ) {
                    setModelOpen (false);
                    Router.reload(window.location.pathname);
                } 
            }
        } else {
            toast.error( <div className="m-5"> First Select Address </div> );
        }
    }

    useEffect(() => {
        if (userDataInfo?.data?.getUserFromToken) {
            setUserInfo( userDataInfo?.data?.getUserFromToken );
        };
    }, [userDataInfo?.data?.getUserFromToken]);

    useEffect(() => {
        if (addressType) setType(addressType);
    }, [addressType])

    return (
        <div className="address-book-in-modal-custom">
            <div className="card custom-bordered">
                <div className="card-body">

                    {
                        loading ? <div className={ `row product-wrapper` }>
                            {
                                [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                    <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                                )
                            }
                        </div> : ""
                    }
                    
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 mt-2 mb-2">
                            <div className='d-flex align-items-center'>
                                <h3 className="title title-simple text-left mb-0">
                                    { !type ? 'Address Book' : ''}
                                    {
                                        type === 'billing' ? 'product' : ''
                                    }
                                    {
                                        type === 'shipping' ? 'Make default shipping address' : ''
                                    }
                                </h3>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mt-2 mb-2">
                            <div className='d-flex align-items-center justify-content-end'>
                                {
                                    address?.length > 1 ? <>
                                    {
                                        !type ? <div className="text-primary font-weight-bold">
                                                <span className="text-primary text-uppercase font-weight-normal mr-4 cursor-pointer" 
                                                    onClick={() => setType('billing')}>Make Default Billing Address</span>
                                                <span className="text-light mr-4">|</span>
                                                <span className="text-primary text-uppercase font-weight-normal cursor-pointer" 
                                                    onClick={() => setType('shipping')}>Make Default Shipping Address</span>
                                            </div> : ''
                                    }
                                    </> : ''
                                }
                            </div>    
                        </div>
                        
                    </div>

                    <hr className="mt-3 mb-3" />
                    {
                        address?.length ? <div className="table-responsive bordered-custom">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        address.map(item => <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.mobile}</td>
                                            <td>
                                                <span style={{fontWeight:'500'}}>Address: </span><span>{item.address}</span><br/>
                                                <span style={{fontWeight:'500'}}>City: </span><span>{item.city}</span><br/>
                                                <span style={{fontWeight:'500'}}>Thana: </span><span>{item.thana}</span><br/>
                                                <span style={{fontWeight:'500'}}>PostCode: </span><span>{item.union}</span><br/>
                                                <span style={{fontWeight:'500'}}>Area: </span><span>{item.area}</span>
                                            </td>
                                            <td>
                                                {
                                                    isBillingAddress(item) ? <span className="badge badge-light mt-1 mr-1 mb-1 ml-0">
                                                            Billing Address
                                                        </span> : ''
                                                }

                                                {
                                                    isShippingAddress(item) ? <span className="badge badge-light mt-1 mr-1 mb-1 ml-0">
                                                            Shipping Address
                                                        </span> : ''
                                                }
                                            </td>
                                            <td>
                                                {
                                                    type ? <div className="form-check radio-custom" style={{display:'inline-block'}} 
                                                            onClick={() => { setCheckedAddressId(item.id), console.log("item.id", item.id)}}>
                                                            <input className="form-check-input" type="radio" name="address-select" 
                                                                id={item.id} checked={ checkedAddressId == item.id } readOnly
                                                                 />
                                                            <label className="form-check-label" htmlFor="exampleRadios1">
                                                            </label>
                                                        </div> : <div className="text-secondary font-weight-bold" style={{display:'inline-block'}}>
                                                            <ALink className="text-uppercase" href={ { pathname: '/my-account', query: { content: 'address-book-edit', address_id: item.id }}}>Edit</ALink>
                                                        </div>
                                                }
                                            </td>
                                        </tr>)
                                    }
                                </tbody>
                            </table>
                        </div> : 
                        <div className="empty-cart text-center pt-5 pb-5">
                            <p>No Address found.</p>
                            <i className="cart-empty d-icon-heart"></i>
                            <p className="return-to-shop mb-0">
                                {/* <ALink className="button wc-backward btn btn-dark btn-md" href="/s">
                                    Return to shop
                                </ALink> */}
                            </p>
                        </div>
                    }
                    
                    <p className="text-right mt-4 mb-0 p-0">
                        {
                            addressType ? <button className="btn btn-block mr-5" 
                                style={{ width: '200px', display: 'inline', float: 'left' }}
                                onClick={handelView} >Add Address</button> : ''
                        }
                        
                        {
                            !type ? <ALink href="/my-account/?content=address-book-add">
                                        <button type="submit" className="btn btn-secondary btn-rounded"> 
                                        <i className="d-icon-plus"> </i> Add New Address</button>
                                    </ALink> : <> 
                                        <button className="btn btn-block mr-5" 
                                            style={{width: '200px', display: 'inline'}}
                                            onClick={() => { if (context === 'checkout') {
                                                setModelOpen(false)
                                            } else setType(null), setCheckedAddressId(null)}}>Cancel</button>
                                        <button className="btn btn-secondary btn-rounded" style={{width: '200px'}}
                                            onClick={() => setNewDefaultAddress()} >Save</button>
                                    </>
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}


function mapStateToProps( state ) {
    return {
        userInfo: state.user.userInfo
    }
}

export default connect( mapStateToProps, {setUserInfo: authUserActions.setUserInfo})( AddressBook );
