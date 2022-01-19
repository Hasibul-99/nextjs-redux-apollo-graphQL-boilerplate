import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import ALink from '../features/custom-link';
import { modalActions } from "../../store/modal";

function StickyFooter ({isUserLogin, openLoginModal}) {
    const router = useRouter();
    let tmp = 0;

    useEffect( () => {
        window.addEventListener( 'scroll', stickyFooterHandler );

        return () => {
            window.removeEventListener( 'scroll', stickyFooterHandler );
        }
    }, [] )

    const stickyFooterHandler = ( e ) => {
        let top = document.querySelector( '.page-content' ) ? document.querySelector( '.page-content' ).offsetTop + document.querySelector( 'header' ).offsetHeight + 100 : 600;
        let stickyFooter = document.querySelector( '.sticky-footer.sticky-content' );
        let height = 0;

        if ( stickyFooter ) {
            height = stickyFooter.offsetHeight;
        }

        if ( window.pageYOffset >= top && window.innerWidth < 768 && e.currentTarget.scrollY >= tmp ) {
            if ( stickyFooter ) {
                stickyFooter.classList.add( 'fixed' );
                stickyFooter.setAttribute( 'style', "margin-bottom: 0" )
                if ( !document.querySelector( '.sticky-content-wrapper' ) ) {
                    let newNode = document.createElement( "div" );
                    newNode.className = "sticky-content-wrapper";
                    stickyFooter.parentNode.insertBefore( newNode, stickyFooter );
                    document.querySelector( '.sticky-content-wrapper' ).insertAdjacentElement( 'beforeend', stickyFooter );
                    document.querySelector( '.sticky-content-wrapper' ).setAttribute( "style", "height: " + height + "px" );
                }

                if ( !document.querySelector( '.sticky-content-wrapper' ).getAttribute( "style" ) ) {
                    document.querySelector( '.sticky-content-wrapper' ).setAttribute( "style", "height: " + height + "px" );
                }
            }
        } else {
            if ( stickyFooter ) {
                stickyFooter.classList.remove( 'fixed' );
                stickyFooter.setAttribute( 'style', `margin-bottom: -${ height }px` )
            }

            if ( document.querySelector( '.sticky-content-wrapper' ) ) {
                document.querySelector( '.sticky-content-wrapper' ).removeAttribute( "style" );
            }
        }

        if ( window.innerWidth > 767 && document.querySelector( '.sticky-content-wrapper' ) ) {
            document.querySelector( '.sticky-content-wrapper' ).style.height = 'auto';
        }

        tmp = e.currentTarget.scrollY;
    }

    const manageRouteControler = (path) => {
        if (isUserLogin) {
            router.push( { pathname: path});
        } else {
            openLoginModal();
        }
    }


    return (
        // <div className="sticky-footer sticky-content fix-bottom">
        <div className="sticky-footer fixed-footer-menu-custom">
            <ALink href="/" className={`sticky-link ${router.pathname == '/' ? "active" : ""}`}>
                {/* <i style={{height:27}} className="d-icon-home"></i> */}
                <svg width="26" height="27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.617 24.38v-3.97a1.843 1.843 0 0 1 1.848-1.839h3.733a1.856 1.856 0 0 1 1.708 1.133c.093.223.141.462.141.704v3.971a1.576 1.576 0 0 0 .982 1.473c.194.08.402.121.612.12h2.547a4.494 4.494 0 0 0 3.173-1.298 4.428 4.428 0 0 0 1.315-3.144V10.216a3.211 3.211 0 0 0-1.169-2.467L14.85.877A4.026 4.026 0 0 0 9.72.97L1.256 7.746A3.213 3.213 0 0 0 0 10.216v11.3a4.473 4.473 0 0 0 4.488 4.458h2.489a1.599 1.599 0 0 0 1.605-1.582l.035-.011z" fill={router.pathname == '/' ? "#E62E04" : "#3D454D"}/>
                </svg>
                <span>Home</span>
            </ALink>
            <ALink href="/campaign" className={`sticky-link ${router.pathname == '/campaign' ? "active" : ""}`}>
                {/* <img style={{height:'24px'}} src="../images/ticket_star.svg" /> */}
                <svg width="31" height="27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.607 21.735a4.629 4.629 0 0 0 4.628-4.625v-2.683a3.056 3.056 0 0 1-3.054-3.055 3.056 3.056 0 0 1 3.054-3.054v-2.68A4.626 4.626 0 0 0 21.614 1H5.63A4.63 4.63 0 0 0 1 5.627v2.806a2.95 2.95 0 0 1 3.051 2.847v.09a3.051 3.051 0 0 1-3.043 3.054H1v2.683a4.627 4.627 0 0 0 4.626 4.628h15.981z" stroke={router.pathname == '/campaign' ? "#E62E04" : "#3D454D"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m14.048 7.075.916 1.828a.608.608 0 0 0 .462.332l2.045.294a.62.62 0 0 1 .499.413.599.599 0 0 1-.157.623l-1.485 1.421a.61.61 0 0 0-.179.538l.35 2.008a.598.598 0 0 1-.245.593.62.62 0 0 1-.647.047l-1.82-.947a.618.618 0 0 0-.574 0l-1.827.948a.625.625 0 0 1-.646-.048.61.61 0 0 1-.246-.592l.35-2.008a.598.598 0 0 0-.179-.537l-1.478-1.422a.605.605 0 0 1-.157-.622.606.606 0 0 1 .497-.414l2.046-.293a.623.623 0 0 0 .464-.333l.91-1.829a.611.611 0 0 1 .55-.334.623.623 0 0 1 .551.334v0z" stroke={router.pathname == '/campaign' ? "#E62E04" : "#3D454D"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Campaign</span>
            </ALink>
            <ALink href="/category/menu" className={`sticky-link ${router.pathname == '/category/menu' ? "active" : ""}`}>
                {/* <img style={{height:'24px'}} src="../images/category.svg" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 22.006 22.006">
                    <g id="Group_55" data-name="Group 55" transform="translate(2004.563 9998.649)">
                        <rect id="Rectangle_21" data-name="Rectangle 21" width="4.891" height="4.891" rx="2.445" transform="translate(-2004.563 -9998.649)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                        <rect id="Rectangle_22" data-name="Rectangle 22" width="4.891" height="4.891" rx="2.445" transform="translate(-2004.563 -9990.092)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                        <rect id="Rectangle_23" data-name="Rectangle 23" width="4.891" height="4.891" rx="2.445" transform="translate(-2004.563 -9981.534)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                        <rect id="Rectangle_24" data-name="Rectangle 24" width="4.891" height="4.891" rx="2.445" transform="translate(-1996.006 -9998.649)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                        <rect id="Rectangle_25" data-name="Rectangle 25" width="4.891" height="4.891" rx="2.445" transform="translate(-1996.006 -9990.092)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                        <rect id="Rectangle_26" data-name="Rectangle 26" width="4.891" height="4.891" rx="2.445" transform="translate(-1996.006 -9981.534)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                        <rect id="Rectangle_27" data-name="Rectangle 27" width="4.891" height="4.891" rx="2.445" transform="translate(-1987.448 -9998.649)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                        <rect id="Rectangle_28" data-name="Rectangle 28" width="4.891" height="4.891" rx="2.445" transform="translate(-1987.448 -9990.092)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                        <rect id="Rectangle_29" data-name="Rectangle 29" width="4.891" height="4.891" rx="2.445" transform="translate(-1987.448 -9981.534)" fill={router.pathname == '/category/menu' ? "#E62E04" : "#3D454D"}/>
                    </g>
                </svg>
                <span style={{marginTop:11}}>Categories</span>
            </ALink>
            <span onClick={() => manageRouteControler('/p/cart')} >
                <ALink href="" className={`sticky-link ${router.pathname == '/p/cart' ? "active" : ""}`}>
                    {/* <img style={{height:'24px'}} src="../images/cart.svg" /> */}
                    <svg width="25" height="27" viewBox="0 0 33 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L4.48544 1.66736L6.09914 22.9357C6.16112 23.7726 6.50607 24.5529 7.06516 25.121C7.62424 25.6889 8.35634 26.0028 9.11539 26H27.3955C28.1226 26.0013 28.8257 25.7121 29.3753 25.1855C29.9249 24.6589 30.2841 23.9304 30.3867 23.134L31.9769 10.977C32.0621 10.3246 31.9097 9.66146 31.5531 9.13339C31.1963 8.60534 30.6648 8.25562 30.075 8.16113C29.9678 8.14446 5.04513 8.13519 5.04513 8.13519" stroke={router.pathname == '/p/cart' ? "#E62E04" : "#3D454D"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.8034 15.6224H21.9355" stroke={router.pathname == '/p/cart' ? "#E62E04" : "#3D454D"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.36771 31.36C8.54818 31.3597 8.7247 31.4129 8.87489 31.5129C9.02508 31.613 9.1422 31.7554 9.21142 31.922C9.28064 32.0887 9.29883 32.2722 9.2637 32.4491C9.22858 32.6262 9.14171 32.7889 9.0141 32.9164C8.88648 33.0441 8.72387 33.1309 8.54686 33.1661C8.36983 33.2012 8.18637 33.183 8.0197 33.1138C7.85303 33.0446 7.71065 32.9275 7.61059 32.7772C7.51053 32.6271 7.45729 32.4505 7.45763 32.2701C7.45763 32.0287 7.55351 31.7972 7.72419 31.6266C7.89486 31.4559 8.12635 31.36 8.36771 31.36Z" fill={router.pathname == '/p/cart' ? "#E62E04" : "#3D454D"} stroke={router.pathname == '/p/cart' ? "#E62E04" : "#3D454D"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M27.2402 31.36C27.4208 31.3597 27.5972 31.4129 27.7475 31.5129C27.8976 31.613 28.0147 31.7554 28.084 31.922C28.1532 32.0887 28.1713 32.2722 28.1363 32.4491C28.1012 32.6262 28.0142 32.7889 27.8867 32.9164C27.759 33.0441 27.5964 33.1309 27.4194 33.1661C27.2424 33.2012 27.059 33.183 26.8923 33.1138C26.7256 33.0446 26.5832 32.9275 26.4831 32.7772C26.3831 32.6271 26.3298 32.4505 26.3302 32.2701C26.3306 32.0289 26.4266 31.7977 26.5972 31.6271C26.7678 31.4565 26.999 31.3604 27.2402 31.36Z" fill={router.pathname == '/p/cart' ? "#E62E04" : "#3D454D"} stroke={router.pathname == '/p/cart' ? "#E62E04" : "#3D454D"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Cart</span>
                </ALink>
            </span>
            
            <span onClick={() => manageRouteControler('/my-account')}>
                <ALink href="" className={`sticky-link ${router.pathname == '/my-account' ? "active" : ""}`}>
                    {/* <img style={{height:'24px'}} src="../images/iconly_light_profile.svg" /> */}
                    <svg width="22" height="27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.78 18.052c-5.279 0-9.78.798-9.78 3.993s4.477 4.02 9.78 4.02c5.277 0 9.78-.8 9.78-3.993 0-3.193-4.475-4.02-9.78-4.02z" stroke={router.pathname == '/my-account' ? "#E62E04" : "#3D454D"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.786 13.495a6.248 6.248 0 1 0-.044 0h.044z" stroke={router.pathname == '/my-account' ? "#E62E04" : "#3D454D"} strokeWidth="1.429" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Account</span>
                </ALink>
            </span>
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        isUserLogin: state.user.isUserLogin
    }
}

export default connect(mapStateToProps, { openLoginModal: modalActions.openLoginModal })( StickyFooter );
