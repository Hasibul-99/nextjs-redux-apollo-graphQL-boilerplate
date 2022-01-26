import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import { useRouter } from 'next/router';
import { GET_USER_ORDERS } from '../../server/queries';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import ALink from '../../components/features/custom-link';
import Pagination from '../../components/features/pagination';
import { objectifyForm } from "../../utils/helpers";

import { dateFormate } from "../../utils/helpers";
import { useState } from 'react';

export default function OrderHistory() {
    const router = useRouter();
    const query = router.query;

    const [ getOrders, { data, loading, error } ] = useLazyQuery( GET_USER_ORDERS, {
        fetchPolicy: 'network-only'
    });
    
    const orders = data && data?.getCustomerOrder;
    const paginatorInfo = data && data.getCustomerOrder.paginatorInfo;

    const perPage = query.per_page ? parseInt( query.per_page ) : 10;
    const page = query.page ? query.page : 1;
    const [orderId, setOrderId] = useState();

    const totalAmount = (orders) => {
        if (orders.length) {
            let total = 0;

            orders.forEach(order => {
                total = total + order.unit_price;
            })

            return total;
        } else return 0;
    } 

    const orderSearch = (e) => {
        e.preventDefault();

        // if (formData && formData.orderId) {
            router.push(`/my-account/?content=order-history&orderId=${orderId || ''}`);
        // }
    }

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

    useEffect(() => {
        getOrders({
            variables: {
                first: parseInt(perPage),
                page: parseInt(page),
                orderId: parseInt(query.orderId)
            }
        });

        setOrderId(query.orderId);
    }, [query])

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">My Orders</h3>
            <hr className="mb-2"/>
            <label>Order No.</label>
            <form onSubmit={orderSearch} id="js-order-search-list" 
                className="form input-wrapper input-wrapper-inline track-order-input mb-3"> 
                <input type="text" className="form-control text-body bg-white" 
                    defaultValue={ query.orderId || undefined } onChange={(e) => setOrderId(e.target.value)} name="orderid" id="orderid"/>
                <button className="btn btn-sm btn-secondary btn-icon-left" 
                    style={{borderTopLeftRadius:0, borderBottomLeftRadius:0, marginLeft:-4}} 
                    type="submit"><i className="d-icon-search mr-2"></i> Search 
                </button>
            </form>

            {
                loading ? <div className={ `row product-wrapper` }>
                            {
                                [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                    <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                                )
                            }
                        </div> : ''
            }

            {
                orders?.data?.length ? <>
                    <Tabs className="tab tab-nav-simple order-history-tabs" selectedTabClassName="show" selectedTabPanelClassName="active" defaultIndex={ 0 } >
                        <TabList className="nav nav-tabs justify-content-left" role="tablist">
                            <Tab className="nav-item">
                                <span className="nav-link">All</span>
                            </Tab>
                            {/* <Tab className="nav-item">
                                <span className="nav-link">Ongoing Orders </span>
                            </Tab>
                            <Tab className="nav-item">
                                <span className="nav-link">Delivered Orders</span>
                            </Tab>
                            <Tab className="nav-item">
                                <span className="nav-link">Cancelled Orders</span>
                            </Tab>
                            <Tab className="nav-item">
                                <span className="nav-link">Refunded Orders</span>
                            </Tab> */}
                        </TabList>

                        <div className="tab-content">
                            <TabPanel className="tab-pane product-tab-description">
                                <div className="card card-bordered-custom" style={{borderRadius:5}}>
                                    <div className="card-body">
                                        <div className="table-responsive bordered-custom">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Order no.</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th>Total</th>
                                                        <th>Payment Method</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        orders.data.map((order, index) => <tr key={'first-' + index}>
                                                            <td>{order.id}</td>
                                                            <td>{dateFormate(order.created_at)}</td>
                                                            <td>
                                                                <span className={`badge ${order.payment_status == 'paid' ? 'badge-success' : 'badge-warning' } `}>{order.payment_status == 'paid' ? 'Paid' : 'Unpaid'}</span>
                                                            </td>
                                                            <td>৳{order?.order_total} for {order?.orderItem?.length} items</td>
                                                            <td>{ showOrderStatus(order.payment_method) }</td>
                                                            <td>
                                                                <ALink href={ { pathname: '/my-account', query: { content: 'track-order', orderId: order.id } } } 
                                                                    className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details
                                                                </ALink>
                                                            </td>
                                                        </tr>)
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
                                </div>
                            </TabPanel>
                            {/* <TabPanel className="tab-pane product-tab-description">
                                <div className="card card-bordered-custom" style={{borderRadius:5}}>
                                    <div className="card-body">
                                        <div className="table-responsive bordered-custom">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Order no.</th>
                                                        <th>Date</th>
                                                        <th>Items</th>
                                                        <th>Status</th>
                                                        <th>Total</th>
                                                        <th>Payment Method</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-in-progress">In Progress</span></td>
                                                        <td>৳900.00 for 5 items</td>
                                                        <td>Cash on Delivery</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-in-progress">In Progress</span></td>
                                                        <td>৳290.00 for 2 items</td>
                                                        <td>Bkash</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-in-progress">In Progress</span></td>
                                                        <td>৳480.00 for 8 items</td>
                                                        <td>SSLCommerz</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-in-progress">In Progress</span></td>
                                                        <td>৳480.00 for 8 items</td>
                                                        <td>Cash on Delivery</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <ul className="pagination mt-3 justify-content-end">
                                            <li className="page-item disabled">
                                                <a className="page-link page-link-prev" href="#" aria-label="Previous" tabIndex="-1" aria-disabled="true">
                                                    <i className="d-icon-arrow-left"></i>Prev
                                                </a>
                                            </li>
                                            <li className="page-item active" aria-current="page"><a className="page-link" href="#">1</a>
                                            </li>
                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item">
                                                <a className="page-link page-link-next" href="#" aria-label="Next">
                                                    Next<i className="d-icon-arrow-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </TabPanel> */}
                            {/* <TabPanel className="tab-pane product-tab-description">
                                <div className="card card-bordered-custom" style={{borderRadius:5}}>
                                    <div className="card-body">
                                        <div className="table-responsive bordered-custom">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Order no.</th>
                                                        <th>Date</th>
                                                        <th>Items</th>
                                                        <th>Status</th>
                                                        <th>Total</th>
                                                        <th>Payment Method</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-delivered">Delivered</span></td>
                                                        <td>৳900.00 for 5 items</td>
                                                        <td>Cash on Delivery</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-delivered">Delivered</span></td>
                                                        <td>৳290.00 for 2 items</td>
                                                        <td>Bkash</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-delivered">Delivered</span></td>
                                                        <td>৳480.00 for 8 items</td>
                                                        <td>SSLCommerz</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-delivered">Delivered</span></td>
                                                        <td>৳480.00 for 8 items</td>
                                                        <td>Cash on Delivery</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <ul className="pagination mt-3 justify-content-end">
                                            <li className="page-item disabled">
                                                <a className="page-link page-link-prev" href="#" aria-label="Previous" tabIndex="-1" aria-disabled="true">
                                                    <i className="d-icon-arrow-left"></i>Prev
                                                </a>
                                            </li>
                                            <li className="page-item active" aria-current="page"><a className="page-link" href="#">1</a>
                                            </li>
                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item">
                                                <a className="page-link page-link-next" href="#" aria-label="Next">
                                                    Next<i className="d-icon-arrow-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </TabPanel> */}
                            {/* <TabPanel className="tab-pane product-tab-description">
                                <div className="card card-bordered-custom" style={{borderRadius:5}}>
                                    <div className="card-body">
                                        <div className="table-responsive bordered-custom">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Order no.</th>
                                                        <th>Date</th>
                                                        <th>Items</th>
                                                        <th>Status</th>
                                                        <th>Total</th>
                                                        <th>Payment Method</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-cancelled">Cancelled</span></td>
                                                        <td>৳900.00 for 5 items</td>
                                                        <td>Cash on Delivery</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-cancelled">Cancelled</span></td>
                                                        <td>৳290.00 for 2 items</td>
                                                        <td>Bkash</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-cancelled">Cancelled</span></td>
                                                        <td>৳480.00 for 8 items</td>
                                                        <td>SSLCommerz</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-cancelled">Cancelled</span></td>
                                                        <td>৳480.00 for 8 items</td>
                                                        <td>Cash on Delivery</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <ul className="pagination mt-3 justify-content-end">
                                            <li className="page-item disabled">
                                                <a className="page-link page-link-prev" href="#" aria-label="Previous" tabIndex="-1" aria-disabled="true">
                                                    <i className="d-icon-arrow-left"></i>Prev
                                                </a>
                                            </li>
                                            <li className="page-item active" aria-current="page"><a className="page-link" href="#">1</a>
                                            </li>
                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item">
                                                <a className="page-link page-link-next" href="#" aria-label="Next">
                                                    Next<i className="d-icon-arrow-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </TabPanel> */}
                            {/* <TabPanel className="tab-pane product-tab-description">
                                <div className="card card-bordered-custom" style={{borderRadius:5}}>
                                    <div className="card-body">
                                        <div className="table-responsive bordered-custom">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Order no.</th>
                                                        <th>Date</th>
                                                        <th>Items</th>
                                                        <th>Status</th>
                                                        <th>Total</th>
                                                        <th>Payment Method</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-refunded">Refunded</span></td>
                                                        <td>৳900.00 for 5 items</td>
                                                        <td>Cash on Delivery</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-refunded">Refunded</span></td>
                                                        <td>৳290.00 for 2 items</td>
                                                        <td>Bkash</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-refunded">Refunded</span></td>
                                                        <td>৳480.00 for 8 items</td>
                                                        <td>SSLCommerz</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>September 24, 2021</td>
                                                        <td>
                                                            <span className="product-thumb-img-custom">	
                                                                <img src="../images/products/product1.jpg" />
                                                            </span> 
                                                            <span className="product-thumb-img-custom">   
                                                                <img src="../images/products/product2.jpg" />
                                                            </span>    
                                                            <span className="product-thumb-img-custom">
                                                                <img src="../images/products/product3.jpg" />
                                                            </span>
                                                        </td>
                                                        <td><span className="badge badge-refunded">Refunded</span></td>
                                                        <td>৳480.00 for 8 items</td>
                                                        <td>Cash on Delivery</td>
                                                        <td>
                                                            <a href="#" className="btn btn-sm btn-link btn-underline text-secondary p-0">View Details</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <ul className="pagination mt-3 justify-content-end">
                                            <li className="page-item disabled">
                                                <a className="page-link page-link-prev" href="#" aria-label="Previous" tabIndex="-1" aria-disabled="true">
                                                    <i className="d-icon-arrow-left"></i>Prev
                                                </a>
                                            </li>
                                            <li className="page-item active" aria-current="page"><a className="page-link" href="#">1</a>
                                            </li>
                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item">
                                                <a className="page-link page-link-next" href="#" aria-label="Next">
                                                    Next<i className="d-icon-arrow-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </TabPanel> */}
                        </div>
                    </Tabs >
                </> : 
                <div className="empty-cart text-center pt-5 pb-5">
                    <p>No Order found.</p>
                    <i className="cart-empty d-icon-heart"></i>
                    <p className="return-to-shop mb-0">
                        {
                            !query.orderId ? <ALink className="button wc-backward btn btn-dark btn-md" href="/s">
                                Return to shop
                            </ALink> : <ALink className="button wc-backward btn btn-dark btn-md" href="/my-account/?content=order-history">
                                Back To Order List
                            </ALink>
                        }
                    </p>
                </div>
            }
            
        </div>
    )
}
