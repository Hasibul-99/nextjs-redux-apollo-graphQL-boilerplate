import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { useQuery } from "@apollo/client";
// Language 
import useTranslation from "next-translate/useTranslation";

import { categoryActions } from "../../store/categories";

import { GET_CATEGORY_LIST, CATEGORIES_TREE } from '../../server/queries';
import ALink from '../features/custom-link';
import moment from "moment";
import { headerBorderRemoveList, headerCategories } from '../../utils/data/menu';
import { objectifyForm } from "../../utils/helpers";

import SearchBox from '../partials/search-box';
import CartMenu from '../partials/cart-menu';
import NotificationMenu from "../partials/notification-menu";
import SidebarMenu from "../partials/sidebar-menu";
import MainMenu from "../partials/main-menu";

function Header(props) {
    const { addToCategory, isUserLogin, userOrders } = props;
    let {t} = useTranslation();
    const router = useRouter();

    const showMobileMenu = () => {
        document.querySelector( 'body' ).classList.add( 'mmenu-active' );
    }

    const { data, loading, error } = useQuery( CATEGORIES_TREE, { variables: { 
        languageId: router.locale === 'en' ? 1 : 2
    }});

    const categories = data && data?.getCategoryTree?.tree;

    const orderSearch = (e) => {
        e.preventDefault();

        let formArray = $('#form-order-Search').serializeArray();
        let formData = objectifyForm(formArray);

        if (formData && formData.orderid) {
            let orderId = formData.orderid.trim();
            
            if ( orderId.length ) {
                router.push(`/my-account/?content=order-history&orderId=${orderId}`);
            };
        }
    }

    useEffect( () => {
        let header = document.querySelector( 'header' );
        if ( header ) {
            if ( headerBorderRemoveList.includes( router.pathname ) && header.classList.contains( 'header-border' ) ) header.classList.remove( 'header-border' )
            else if ( !headerBorderRemoveList.includes( router.pathname ) ) document.querySelector( 'header' ).classList.add( 'header-border' );
        }
    }, [ router.pathname ] )

    useEffect(() => {
        if (categories) {
            addToCategory(JSON.parse(categories));
        }
    }, [categories])

    return (
        <header className="header header-border">
            <div className="header-top pt-1 pb-1">
                <div className="container-fluid">
                    <div className="header-left">
                        <ALink href="#" className="logo d-lg-none" onClick={() => { window.location = "/" }}>
                            <img src='./images/home/logo.png' alt="logo" width="40" />
                        </ALink>
                        <div className="dropdown language">
                            <ALink href="#">
                                {
                                    router.locale === 'en' ? <>
                                        <img src="/images/flag/en.png" className="mr-1"/>
                                        ENGLISH
                                    </> : <>
                                        <img src="/images/flag/bd.png" className="mr-1"/>
                                        বাংলা
                                    </>
                                }
                            </ALink>

                            <ul className="dropdown-box">
                                <li>
                                    <ALink href={router.asPath} locale="en">
                                        <img src="/images/flag/en.png" className="mr-1"/>ENGLISH</ALink>
                                </li>
                                <li>
                                    <ALink href={router.asPath} locale="bn">
                                        <img src="/images/flag/bd.png" className="mr-1"/>
                                        বাংলা
                                    </ALink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="dropdown language d-lg-none">
                            <ALink href="#">
                                {
                                    router.locale === 'en' ? <>
                                        <img src="/images/flag/en.png" className="mr-1"/>
                                        English
                                    </> : <>
                                        <img src="/images/flag/bd.png" className="mr-1"/>
                                        বাংলা
                                    </>
                                }
                            </ALink>

                            <ul className="dropdown-box">
                                <li>
                                    <ALink href={router.asPath} locale="en">
                                        <img src="/images/flag/en.png" className="mr-1"/>English</ALink>
                                </li>
                                <li>
                                    <ALink href={router.asPath} locale="bn">
                                        <img src="/images/flag/bd.png" className="mr-1"/>
                                        বাংলা
                                    </ALink>
                                </li>
                            </ul>
                        </div>
                        <ALink href="/p/contact-us" className="contact d-lg-show"><span className="mr-1"><img src="../images/email.svg"></img></span>info@b71bd.com</ALink>
                        <ALink href="/p/contact-us" className="contact d-lg-show"><span className="mr-1"><img src="../images/help.svg"></img></span>{t('common:help')} </ALink>
                        {/* <ALink href="#" className="tracker-menu d-lg-show"><i className="d-icon-map"></i> {t('common:track_order')} </ALink> */}
                        
                        {
                            isUserLogin && userOrders?.data?.length ? <div className="dropdown d-lg-show">
                                    <ALink href="#"><span className="mr-1"><img src="../images/track-order.svg"></img></span>{t('common:track_order')}</ALink>
                                    <ul className="dropdown-box tracker-dropdown w-350 border-rounded">
                                        <li> 
                                            <h4 className="title mt-0 mb-2">Track my Order</h4>
                                            {/* onKeyDown={handleKeyDownOrder}  */}
                                            <form action="#" id="form-order-Search" onSubmit={orderSearch} 
                                                className="form input-wrapper input-wrapper-inline track-order-input">
                                                <input type="text" className="form-control text-body bg-white" name="orderid" id="orderid"
                                                    />
                                                <button className="btn btn-sm btn-secondary btn-icon-left" type="submit" 
                                                    style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -4, paddingLeft:10, paddingRight:0}}>
                                                        <i className="d-icon-search mr-2"></i>
                                                </button>
                                            </form>

                                        </li>
                                        <li>
                                            <h4 className="title mt-3 mb-2">My Last Orders</h4>
                                            <ul className="last-orders">
                                                {
                                                    userOrders?.data?.map(order => <li key={'head-order-'+ order.id}>
                                                        <ALink href={`/my-account/?content=track-order&orderId=${order.id}`}>{moment(order.created_at).format('DD-MM-YYYY')} - Order {order.id}</ALink>
                                                    </li>)
                                                }
                                                
                                                <li className="view-all mt-3"> 
                                                    <ALink href="/my-account/?content=order-history" 
                                                        className="text-center font-14 text-primary p-0 mb-0 font-weight-normal float-right">View all
                                                    </ALink>
                                                </li> 
                                            </ul>
                                        </li>
                                    </ul>
                                </div> : ''
                        }
                        
                        {/* <LoginModal /> */}
                    </div>
                </div>
            </div>

            <div className="header-middle sticky-header fix-top sticky-content pt-2 pb-2">
                <div className="container-fluid">
                    <div className="header-left">
                        <ALink href="#" className="mobile-menu-toggle" onClick={ showMobileMenu }>
                            <img style={{width:'24px'}} src="../images/menu.svg" />
                        </ALink>

                        <ALink href="#" className="logo" onClick={() => { window.location = "/" }}>
                            <img src='./images/home/logo.png' alt="logo" width="50" height="44" />
                        </ALink>

                        <SearchBox />
                    </div>

                    <div className="header-right">
                        <ALink href="tel:#" className="icon-box icon-box-side">
                            <div className="icon-box-icon mr-0 mr-lg-2">
                                <i className="d-icon-phone"></i>
                            </div>
                            <div className="icon-box-content d-lg-show">
                                <h4 className="icon-box-title">{t('common:call_us_now')}:</h4>
                                <p>{t('common:contact_number')}</p>
                            </div>
                        </ALink>
                        <span className="divider"></span>
                        <ALink href={process.env.NEXT_PUBLIC_SELLER_URI} className="wishlist">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="27.571" height="24" viewBox="0 0 28.571 25" 
                                >
                                    <g id="store" transform="translate(0 -32)">
                                    <g id="Group_28" data-name="Group 28" transform="translate(0 32)">
                                        <path id="Path_51" data-name="Path 51" d="M28.545,39.82l-1.786-7.143A.892.892,0,0,0,25.893,32H2.679a.892.892,0,0,0-.866.677L.027,39.82A.874.874,0,0,0,0,40.036a4.528,4.528,0,0,0,1.786,3.627V56.107A.893.893,0,0,0,2.679,57h8.929a.893.893,0,0,0,.893-.893v-6.25h3.571v6.25a.893.893,0,0,0,.893.893h8.929a.893.893,0,0,0,.893-.893V43.662a4.528,4.528,0,0,0,1.786-3.627A.873.873,0,0,0,28.545,39.82ZM25,55.214H17.857v-6.25a.893.893,0,0,0-.893-.893H11.607a.893.893,0,0,0-.893.893v6.25H3.571V44.429a3.961,3.961,0,0,0,.67.071,4.164,4.164,0,0,0,3.348-1.727,4.109,4.109,0,0,0,6.7,0,4.109,4.109,0,0,0,6.7,0A4.164,4.164,0,0,0,24.33,44.5a3.961,3.961,0,0,0,.67-.071Zm-.67-12.5a2.578,2.578,0,0,1-2.455-2.679.893.893,0,0,0-1.786,0,2.578,2.578,0,0,1-2.455,2.679,2.578,2.578,0,0,1-2.455-2.679.893.893,0,0,0-1.786,0,2.578,2.578,0,0,1-2.455,2.679,2.578,2.578,0,0,1-2.455-2.679.893.893,0,0,0-1.786,0,2.578,2.578,0,0,1-2.455,2.679,2.568,2.568,0,0,1-2.454-2.575l1.589-6.354H25.2l1.589,6.354A2.571,2.571,0,0,1,24.33,42.714Z" transform="translate(0 -32)"></path>
                                    </g>
                                    </g>
                                </svg>
                            </span>
                            <span className="ml-2">{t('common:be_a_seller')}</span>
                        </ALink>
                        <span className="divider"></span>
                        
                        {
                            isUserLogin ? <>
                                <ALink href="/my-account/?content=wishlist" className="wishlist">
                                    <i className="d-icon-heart"></i>
                                    <span className="ml-2">{t('common:wishlist')}</span>
                                </ALink>
                                <span className="divider"></span>
                            </> : ''
                        }
                        
                        <CartMenu />
                        <span className="divider ml-2 mr-0"></span>
                        <NotificationMenu />
                    </div>
                </div>
            </div>

            <div className="header-bottom has-dropdown pb-0 mb-0 pt-0">
                <div className="container-fluid d-block">
                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className={`dropdown category-dropdown has-border ${router.pathname == '/' ? 'fixed' : 'content-category-dropdown'}`}>
                                <ALink href="#" className={`text-white font-weight-semi-bold category-toggle
                                     ${router.pathname !== '/' ? 'show-category-toggle' : ''}`}>
                                    <i className="d-icon-bars2"></i>
                                    <span>{t('common:categories')}</span>
                                </ALink>

                                {
                                    router.pathname !== '/' ?  <div className="dropdown-box">
                                        <SidebarMenu/>
                                    </div> : null
                                }
                            </div>
                        </div>
                        <div className="col-xl-9 col-lg-9 col-md-9">
                            <MainMenu categories={categories} />
                        </div>
                    </div>
                </div>
            </div>
        </header >
    )
}

function mapStateToProps( state ) {
    return {
        isUserLogin: state.user.isUserLogin,
        userOrders: state.user.userOrders,
    }
}

export default connect(mapStateToProps, {addToCategory: categoryActions.addToCategory})(Header)
