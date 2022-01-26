import Head from "next/head";
import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
import Router from 'next/router';

import ALink from '../../components/features/custom-link';
import Card from '../../components/features/accordion/card';

import Dashboard from "../../components/myAccount/dashboard";
import EditProfile from "../../components/myAccount/edit-profile";
import ChangePassword from "../../components/myAccount/change-password";
import AddressBook from "../../components/myAccount/address-book";
import AddressBookAdd from "../../components/myAccount/address-book-add";
import OrderHistory from "../../components/myAccount/order-history";
import CancelledOrders from "../../components/myAccount/cancelled-orders";
import TrackOrder from "../../components/myAccount/track-order";
import Wishlist from "../../components/myAccount/wishlist";
import Reviews from "../../components/myAccount/reviews";
import ReviewAdd from "../../components/myAccount/review-add";
import RequestCancellation from "../../components/myAccount/request-cancellation";
import Ticket from "../../components/myAccount/ticket";
import AddressBookedit from "../../components/myAccount/address-book-edit";

import { connect } from 'react-redux';
import { useEffect } from "react";
import { useState } from "react";

import { authUserActions } from '../../store/authUser';

function myAccount({isUserLogin, removeUserInfo, removeUserOrder}) {
    const router = useRouter();
    const query = router.query;
    const [showMobileMenu, setShowMObileMenu] = useState(true);

    const logoutUser = () => {
        Cookies.remove('b71_access_token');
        removeUserInfo();
        removeUserOrder(null);
        Router.reload("/");
    }

    useEffect(() => {
        if (!isUserLogin) {
            router.push( {
                pathname: '/'
            });
        }
    }, [isUserLogin])

    return (
        <main className="main custom-bg-color-one">
            <Head>
                <title>B71 - ECommerce Store | My Account</title>
            </Head>
            <nav className="breadcrumb-nav">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li onClick={() => setShowMObileMenu(true)}>My Account</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content pb-10">
                <div className="container-fluid">
                    <div className="my-account-content mobile">
                        <div className={`summary ${!showMobileMenu ? 'd-none' : ''}`}>
                            <div className="widget">
                                <ul className="widget-body filter-items"> 
                                    <li className={!query.content ? "active" : ''} onClick={() => setShowMObileMenu(false)}>
                                        <ALink scroll={ false }
                                        href={ { pathname: '/my-account', query: { content: '' } } }>Dashboard</ALink>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget">
                                <ul className="widget-body filter-items"> 
                                    <li className={query.content === 'edit-profile' ? "active" : ''}  onClick={() => setShowMObileMenu(false)}>
                                        <ALink scroll={ false }
                                        href={{ pathname: '/my-account', query: { content: 'edit-profile' } }}>Edit Profile</ALink>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget">
                                <ul className="widget-body filter-items"> 
                                    <li className={query.content === 'change-passowrd' ? "active" : ''}  onClick={() => setShowMObileMenu(false)}>
                                        <ALink scroll={ false }
                                        href={ { pathname: '/my-account', query: { content: 'change-passowrd' } } }>Change Password</ALink>
                                    </li>
                                </ul>
                            </div>

                            <div className="widget">
                                <ul className="widget-body filter-items"> 
                                    <li className={query.content === 'address-book' ? "active" : ''} onClick={() => setShowMObileMenu(false)}>
                                        <ALink scroll={ false }
                                        href={ { pathname: '/my-account', query: { content: 'address-book' } } }>Address Book</ALink>
                                    </li>
                                </ul>
                            </div>

                            <div className="widget">
                                <ul className="widget-body filter-items"> 
                                    <li className={query.content === 'order-history' ? "active" : ''} onClick={() => setShowMObileMenu(false)}>
                                        <ALink scroll={ false }
                                        href={ { pathname: '/my-account', query: { content: 'order-history' } } }>My Orders</ALink>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget">
                                <ul className="widget-body filter-items"> 
                                    <li className={query.content === 'wishlist' ? "active" : ''} onClick={() => setShowMObileMenu(false)}>
                                        <ALink scroll={ false }
                                        href={ { pathname: '/my-account', query: { content: 'wishlist' } } }>My Wishlist</ALink>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget">
                                <ul className="widget-body filter-items"> 
                                    <li className={query.content === 'reviews' ? "active" : ''} onClick={() => setShowMObileMenu(false)}>
                                        <ALink scroll={ false }
                                        href={ { pathname: '/my-account', query: { content: 'reviews' } } }>My Reviews</ALink>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget">
                                <ul className="widget-body filter-items"> 
                                    <li className='' onClick={logoutUser}>
                                        <ALink href="" scroll={ false } >Logout</ALink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className={`card ${showMobileMenu ? 'd-none' : ''}`}>
                            <div className="card-body">
                                {(() => {
                                    switch (query.content) {
                                        case 'edit-profile':
                                            return <EditProfile/>;
                                        case 'change-passowrd':
                                            return <ChangePassword/>;
                                        case 'address-book':
                                            return <AddressBook/>;
                                        case 'address-book-add':
                                            return <AddressBookAdd/>;
                                        case 'address-book-edit':
                                            return <AddressBookedit/>;
                                        case 'order-history':
                                            return <OrderHistory/>
                                        case 'cancelled-orders':
                                            return <CancelledOrders/>
                                        case 'track-order':
                                            return <TrackOrder/>
                                        case 'wishlist':
                                            return <Wishlist/>
                                        case 'reviews':
                                            return <Reviews/>
                                        case 'review-add':
                                            return <ReviewAdd/>
                                        case 'request-cancellation':
                                            return <RequestCancellation/>
                                        case 'ticket':
                                            return <Ticket/>    
                                        default:
                                            return <Dashboard/>;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>

                    <div className="row flex main-content-wrap my-account-content"> 
                        <aside className="col-lg-3 sidebar-fixed sticky-sidebar-wrapper"> 
                        <div className="sidebar-content"> 
                            <div className="sticky-sidebar"> 
                                <div className="summary">
                                    <div className="widget">
                                        {/* <Card title="<h3 className='widget-title'>My Account View<span className='toggle-btn p-0 parse-content'></span></h3>" type="parse" expanded={ true }> */}
                                            <ul className="widget-body filter-items">
                                                <li className={!query.content ? "active" : ''}>
                                                    <ALink scroll={ false }  
                                                    href={ { pathname: '/my-account', query: { content: '' } } }>Dashboard </ALink>
                                                </li>    
                                                <li className={query.content === 'edit-profile' ? "active" : ''}>
                                                    <ALink scroll={ false }
                                                    href={{ pathname: '/my-account', query: { content: 'edit-profile' } }}>Edit Profile </ALink>
                                                </li>    
                                                <li className={query.content === 'change-passowrd' ? "active" : ''}>   
                                                    <ALink scroll={ false }  href={ { pathname: '/my-account', query: { content: 'change-passowrd' } } }>Change Password </ALink>
                                                </li>    
                                                <li className={query.content === 'address-book' ? "active" : ''}>
                                                    <ALink scroll={ false }  href={ { pathname: '/my-account', query: { content: 'address-book' } } }>Address Book </ALink>
                                                </li>
                                            </ul>
                                        {/* </Card> */}
                                    </div>

                                    {/* <div className="widget widget-collapsible">
                                        <Card title="<h3 className='widget-title'>My Orders<span className='toggle-btn p-0 parse-content'></span></h3>" 
                                            type="parse" expanded={ false }>
                                            <ul className="widget-body filter-items"> 
                                                <li className={query.content === 'order-history' ? "active" : ''}>
                                                    <ALink scroll={ false }
                                                    href={ { pathname: '/my-account', query: { content: 'order-history' } } }>Order History</ALink>
                                                </li>
                                                <li className={query.content === 'cancelled-orders' ? "active" : ''}>
                                                    <ALink scroll={ false }
                                                    href={ { pathname: '/my-account', query: { content: 'cancelled-orders' } } }>Cancelled Orders </ALink>
                                                </li>
                                            </ul>
                                        </Card>
                                    </div> */}

                                    <div className="widget">
                                        
                                        <ul className="widget-body filter-items"> 
                                            <li className={query.content === 'order-history' ? "active" : ''}>
                                                <ALink scroll={ false }
                                                href={ { pathname: '/my-account', query: { content: 'order-history' } } }>My Orders</ALink>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <div className="widget">
                                        <ul className="widget-body filter-items"> 
                                            <li className={query.content === 'track-order' ? "active" : ''}>
                                                <ALink scroll={ false }
                                                href={ { pathname: '/my-account', query: { content: 'track-order' } } }>Track Order</ALink>
                                            </li>
                                        </ul>
                                    </div> */}
                                    <div className="widget">
                                        <ul className="widget-body filter-items"> 
                                            <li className={query.content === 'wishlist' ? "active" : ''}>
                                                <ALink scroll={ false }
                                                href={ { pathname: '/my-account', query: { content: 'wishlist' } } }>My Wishlist</ALink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="widget">
                                        <ul className="widget-body filter-items"> 
                                            <li className={query.content === 'reviews' ? "active" : ''}>
                                                <ALink scroll={ false }
                                                href={ { pathname: '/my-account', query: { content: 'reviews' } } }>My Reviews</ALink>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <div className="widget">
                                        <ul className="widget-body filter-items"> 
                                            <li className={query.content === 'review-add' ? "active" : ''}>
                                                <ALink scroll={ false }
                                                href={ { pathname: '/my-account', query: { content: 'review-add' } } }>Write a review</ALink>
                                            </li>
                                        </ul>
                                    </div> */}
                                    {/* <div className="widget">
                                        <ul className="widget-body filter-items"> 
                                            <li className={query.content === 'request-cancellation' ? "active" : ''}>
                                                <ALink scroll={ false }
                                                href={ { pathname: '/my-account', query: { content: 'request-cancellation' } } }>Request a Cancellation</ALink>
                                            </li>
                                        </ul>
                                    </div> */}
                                    {/* <div className="widget">
                                        <ul className="widget-body filter-items"> 
                                            <li className={query.content === 'ticket' ? "active" : ''}>
                                                <ALink scroll={ false }
                                                href={ { pathname: '/my-account', query: { content: 'ticket' } } }>Ticket</ALink>
                                            </li>
                                        </ul>
                                    </div> */}
                                    {/* <div className="widget">
                                        <ul className="widget-body filter-items"> 
                                            <li className={query.content === 'logout' ? "active" : ''}>
                                                <ALink scroll={ false }
                                                href={ { pathname: '/my-account', query: { content: 'logout' } } }>Logout</ALink>
                                            </li>
                                        </ul>
                                    </div> */}
                                </div> 
                            </div>
                        </div>
                        </aside>
                        <div className="col-xl-9 col-lg-9 col-md-9">
                            <div className="card">
                                <div className="card-body">
                                    {(() => {
                                        switch (query.content) {
                                            case 'edit-profile':
                                                return <EditProfile/>;
                                            case 'change-passowrd':
                                                return <ChangePassword/>;
                                            case 'address-book':
                                                return <AddressBook/>;
                                            case 'address-book-add':
                                                return <AddressBookAdd/>;
                                            case 'address-book-edit':
                                                return <AddressBookedit/>;
                                            case 'order-history':
                                                return <OrderHistory/>
                                            case 'cancelled-orders':
                                                return <CancelledOrders/>
                                            case 'track-order':
                                                return <TrackOrder/>
                                            case 'wishlist':
                                                return <Wishlist/>
                                            case 'reviews':
                                                return <Reviews/>
                                            case 'review-add':
                                                return <ReviewAdd/>
                                            case 'request-cancellation':
                                                return <RequestCancellation/>
                                            case 'ticket':
                                                return <Ticket/>    
                                            default:
                                                return <Dashboard/>;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

function mapStateToProps( state ) {
    return {
        isUserLogin: state.user.isUserLogin
    }
}

export default myAccount;
