
import { connect } from 'react-redux';
import moment from "moment";
import { dateFormate } from "../../utils/helpers";
import ALink from '../../components/features/custom-link';


function dashboard({userOrders, userInfo}) {
    
    const showOrderStatus = (status) => {
        let text = "N/A";
        
        switch (status) {
            case 'cash_on_delivery':
                text = "Cash On Delivery";
                break;
            case "sslcommerz":
                text = "SSLCOMMERZ";
                break;
            default:
                text = "N/A";
        }

        return text;
    }

    return (
        <div>
            {
                userInfo ? <>
                    <div className="row flex">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-4">
                            <div className="card custom-bordered">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="mr-auto">
                                            <h5 className="text-left mb-0">Personal Profile</h5>
                                        </div>
                                        <div className="text-primary font-weight-bold">
                                            <ALink className="text-uppercase" 
                                                href={ { pathname: '/my-account', query: { content: 'edit-profile' } } }>
                                                    Edit
                                            </ALink>
                                        </div>
                                    </div>
                                    <hr className="mt-2 mb-3" />
                                    <h6 className="mb-1">{userInfo?.customer?.name}</h6>
                                    <p className="card-text text-grey mb-0">
                                        <i className="d-icon-phone"></i> {userInfo?.mobile}
                                    </p>
                                    <p className="card-text text-grey mb-0">
                                        <img src="../images/mail.svg" width="18" className="mr-1" style={{position:'relative', top: 2}} />
                                        {userInfo?.email}
                                    </p>
                                    {
                                        userInfo?.customer?.gender ? <p className="card-text text-grey mb-0">
                                                <img src="../images/gender.svg" width="18" className="mr-1" style={{position:'relative', top: 5}} /> 
                                                {userInfo?.customer?.gender === 'male' ? "Male" : 'Female'}
                                            </p> : ''
                                    }
                                    
                                    {
                                        userInfo?.customer?.dob ? <p className="card-text text-grey mb-0">
                                            <img src="../images/dob.svg" width="18" className="mr-1" style={{position:'relative', top: 2}} /> 
                                            {moment(userInfo?.customer?.dob).format('DD MMM, YYYY')}
                                        </p> : ''
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mb-4">
                            <div className="card custom-bordered">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="mr-auto">
                                            <h5 className="text-left mb-0">Address Book</h5>
                                        </div>
                                        <div className="text-primary font-weight-bold">
                                            <ALink className="text-uppercase" 
                                                href={ { pathname: '/my-account', query: { content: 'address-book' } } }>Edit</ALink>
                                        </div>
                                    </div>
                                    <hr className="mt-2 mb-3" />

                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pb-5">
                                            <h6 className="mb-1 text-uppercase mb-3 font-weight-normal" style={{fontSize:"13px"}}>Default Shipping Address</h6>
                                            {
                                                userInfo?.customer?.shippingAddressDetails ? <>
                                                    <h5 className="mb-1">{userInfo?.customer?.shippingAddressDetails?.name}</h5>
                                                    <p className="card-text text-grey mb-0">
                                                        <i className="d-icon-map"></i> {userInfo?.customer?.shippingAddressDetails.address}
                                                    </p>
                                                    {
                                                        userInfo?.customer?.shippingAddressDetails.mobile ? <p className="card-text text-grey mb-0">
                                                            <i className="d-icon-phone"></i> {userInfo?.customer?.shippingAddressDetails.mobile}
                                                        </p> : ''
                                                    }
                                                </> : <>
                                                    <p className="card-text text-grey mb-0">
                                                        <i className="d-icon-map"></i> Address not found
                                                    </p>
                                                </>
                                            }
                                            
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <h6 className="mb-1 text-uppercase mb-3 font-weight-normal" style={{fontSize:"13px"}}>Default Billing Address</h6>
                                            {
                                                userInfo?.customer?.billingAddressDetails ? <>
                                                    <h5 className="mb-1">{userInfo?.customer?.billingAddressDetails?.name}</h5>
                                                    <p className="card-text text-grey mb-0">
                                                        <i className="d-icon-map"></i> {userInfo?.customer?.billingAddressDetails?.address}
                                                    </p>
                                                    {
                                                        userInfo?.customer?.billingAddressDetails?.mobile ? <p className="card-text text-grey mb-0">
                                                                <i className="d-icon-phone"></i> {userInfo?.customer?.billingAddressDetails?.mobile}
                                                        </p> : ''
                                                    }
                                                </> : <>
                                                    <p className="card-text text-grey mb-0">
                                                        <i className="d-icon-map"></i> Address not found
                                                    </p>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </> : ''
            }
            
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="card custom-bordered">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="mr-auto">
                                    <h5 className="text-left mb-0">Recent Orders</h5>
                                </div>
                                <div className="text-primary font-weight-bold">
                                    <ALink className="text-uppercase" 
                                    href={ { pathname: '/my-account', query: { content: 'order-history' } } }>View all</ALink>
                                </div>
                            </div>
                            <hr className="mt-2 mb-3" />
                            <div className="table-responsive bordered-custom">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Order no.</th>
                                            <th>Date</th>
                                            {/* <th>Product Name</th> */}
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th>Payment Method</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            userOrders?.data?.length ? userOrders.data.map(order => <>
                                                <tr>
                                                    <td>{order.id}</td>
                                                    <td>{dateFormate(order.created_at)}</td>
                                                    {/* <td>{order?.orderItem[0].product_name}</td> */}
                                                    <td>
                                                        <span className={`badge ${order.payment_status == 'paid' ? 'badge-success' : 'badge-warning' } `}>{order.payment_status == 'paid' ? 'Paid' : 'Unpaid'}</span>
                                                    </td>
                                                    <td>৳ {order.orderItem[0]?.unit_price || 0}</td>
                                                    <td>{ showOrderStatus(order.payment_method) }</td>
                                                    <td>
                                                        <ALink href={{ pathname: '/my-account', query: { content: 'track-order', orderId: order.id }}} className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</ALink>
                                                    </td>
                                                </tr>
                                            </>) : ''
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}


function mapStateToProps( state ) {
    return {
        userInfo: state.user.userInfo,
        userOrders: state.user.userOrders
    }
}

export default connect( mapStateToProps, {})( dashboard );
