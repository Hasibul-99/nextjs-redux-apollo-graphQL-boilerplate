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