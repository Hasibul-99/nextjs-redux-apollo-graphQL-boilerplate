import { useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from "next/head"

import 'react-toastify/dist/ReactToastify.min.css';
import 'react-image-lightbox/style.css';
import 'react-input-range/lib/css/index.css';

import ALink from '../features/custom-link';

import Header from '../common/header';
import StickyFooter from '../common/sticky-footer';
import MobileMenu from '../common/mobile-menu';

import { showScrollTopHandler, scrollTopHandler, stickyHeaderHandler, 
    stickyFooterHandler, resizeHandler } from '../../utils';


function Layout( { children, closeLoginModal } ) {
    const router = useRouter();

    useLayoutEffect( () => {
        document.querySelector( 'body' ) && document.querySelector( 'body' ).classList.remove( 'loaded' );
    }, [ router.pathname ] )

    useEffect( () => {
        window.addEventListener( 'scroll', showScrollTopHandler, true );
        window.addEventListener( 'scroll', stickyHeaderHandler, true );
        window.addEventListener( 'scroll', stickyFooterHandler, true );
        window.addEventListener( 'resize', stickyHeaderHandler );
        window.addEventListener( 'resize', stickyFooterHandler );
        window.addEventListener( 'resize', resizeHandler );

        return () => {
            window.removeEventListener( 'scroll', showScrollTopHandler, true );
            window.removeEventListener( 'scroll', stickyHeaderHandler, true );
            window.removeEventListener( 'scroll', stickyFooterHandler, true );
            window.removeEventListener( 'resize', stickyHeaderHandler );
            window.removeEventListener( 'resize', stickyFooterHandler );
            window.removeEventListener( 'resize', resizeHandler );
        }
    }, [] )

    useEffect( () => {
        // closeLoginModal();

        let bodyClasses = [ ...document.querySelector( "body" ).classList ];
        for ( let i = 0; i < bodyClasses.length; i++ ) {
            document.querySelector( 'body' ).classList.remove( bodyClasses[ i ] );
        }

        setTimeout( () => {
            document.querySelector( 'body' ).classList.add( 'loaded' );
        }, 50 );
    }, [ router.pathname ] )

    return (
        <>
            <Head>
                <title> B71 - ECommerce Store </title>
                <base href="/"></base>
                <link rel="icon" href="images/icons/favicon.png" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900" />
                <link rel="stylesheet" type="text/css" href="vendor/riode-fonts/riode-fonts.css" />
                <link rel="stylesheet" type="text/css" href="vendor/fontawesome-free/css/all.min.css" />
                <link rel="stylesheet" type="text/css" href="vendor/owl-carousel/owl.carousel.min.css" />
                
                <meta charSet="UTF-8"/>
                <meta name="theme-color" content="#FF284F"/>
                <meta property="og:title" content="ঘরে বসে B71"/>
                <meta property="og:description" content="Bangladesh's best online shopping store with 17+ million products at resounding discounts in dhaka,
                        ctg & All across Bangladesh with cash on delivery (COD)"/>
                <meta property="og:image" content={process.env.NEXT_PUBLIC_CLIENT_URI + "/images/home/Group-34092.png"}/>
                <meta property="og:image:secure_url" content={process.env.NEXT_PUBLIC_CLIENT_URI + "/images/home/Group-34092.png"}/>
                <meta property="og:image:type" content="image/jpg"/>
                <meta property="og:image:width" content="1200"/>
                <meta property="og:image:height" content="627"/>
            </Head>

            <div className={"page-wrapper " + router.pathname === '/' ? bg-white : ''}>
                <Header />

                { children }

                <StickyFooter />
            </div>

            <ALink id="scroll-top" href="#" title="Top" role="button" className="scroll-top" onClick={ () => scrollTopHandler( false ) }><i className="d-icon-arrow-up"></i></ALink>

            <MobileMenu />

            <ToastContainer
                autoClose={ 3000 }
                duration={ 300 }
                newestOnTo={ true }
                className="toast-container"
                position="bottom-left"
                closeButton={ false }
                hideProgressBar={ true }
                newestOnTop={ true }
            />
        </>
    )
}

export default connect( null, {})( Layout );