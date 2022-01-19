import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import ALink from '../features/custom-link';

// Language 
import useTranslation from "next-translate/useTranslation";


function MobileMenu( props ) {
    const {categoryList, mobileMenuContent} = props;
    const content = mobileMenuContent && mobileMenuContent.cmsDetails && mobileMenuContent.cmsDetails?.cmsDetails[0]?.content ? mobileMenuContent.cmsDetails?.cmsDetails[0]?.content : '';


    let {t} = useTranslation();
    const [ search, setSearch ] = useState( "" );
    const router = useRouter();

    useEffect( () => {
        window.addEventListener( 'resize', hideMobileMenuHandler );
        document.querySelector( "body" ).addEventListener( "click", onBodyClick );

        return () => {
            window.removeEventListener( 'resize', hideMobileMenuHandler );
            document.querySelector( "body" ).removeEventListener( "click", onBodyClick );
        }
    }, [] )

    useEffect( () => {
        setSearch( "" );
    }, [ router.query.slug ] )

    const hideMobileMenuHandler = () => {
        if ( window.innerWidth > 991 ) {
            document.querySelector( 'body' ).classList.remove( 'mmenu-active' );
        }
    }

    const hideMobileMenu = () => {
        document.querySelector( 'body' ).classList.remove( 'mmenu-active' );
    }

    function onSearchChange( e ) {
        setSearch( e.target.value );
    }

    function onBodyClick( e ) {
        if ( e.target.closest( '.header-search' ) ) return e.target.closest( '.header-search' ).classList.contains( 'show-results' ) || e.target.closest( '.header-search' ).classList.add( 'show-results' );

        document.querySelector( '.header-search.show' ) && document.querySelector( '.header-search.show' ).classList.remove( 'show' );
        document.querySelector( '.header-search.show-results' ) && document.querySelector( '.header-search.show-results' ).classList.remove( 'show-results' );
    }

    function onSubmitSearchForm( e ) {
        e.preventDefault();
        router.push( {
            pathname: '/s',
            query: {
                search: search
            }
        } );
    }

    return (
        <div className="mobile-menu-wrapper">
            <div className="mobile-menu-overlay" onClick={ hideMobileMenu }>
            </div>

            <ALink className="mobile-menu-close" href="#" onClick={ hideMobileMenu }><i className="d-icon-times"></i></ALink>

            <div dangerouslySetInnerHTML={{ __html: content }} />
            
            {/* <div className="mobile-menu-container scrollable d-none">
                <form action="#" className="input-wrapper" onSubmit={ onSubmitSearchForm }>
                    <input type="text" className="form-control" name="search" autoComplete="off" value={ search } onChange={ onSearchChange }
                        placeholder="Search your keyword..." required />
                    <button className="btn btn-search" type="submit">
                        <i className="d-icon-search"></i>
                    </button>
                </form>

                <ul className="mobile-menu mmenu-anim">
                    <li><ALink href="#" className="menu-title">{t('common:categories')}</ALink></li>
                    {
                        categoryList.map( cat =>
                            <li key={ `mobile-cat-${ cat.url_key }` }>
                                <ALink className="category-lable-first" href={ { pathname: "/s", query: { category: cat.url_key } } }>
                                    {
                                        cat.icon ? <div className="mr-2">
                                            <Image
                                                src={ process.env.NEXT_PUBLIC_ASSET_URI + "/" + cat?.icon }
                                                alt="Picture of the author"
                                                placeholder="blur"
                                                width={30}
                                                height={30}
                                                quality={90}
                                                blurDataURL="/images/categories/daily-needs.svg"
                                            />
                                        </div> : <i className="d-icon-shoppingbag"></i>
                                    }
                                    { cat.label }
                                </ALink>
                            </li>
                        ) }
                    <li><ALink href="#" className="menu-title">Today Coupon Deals</ALink>
                    </li>
                    <li>
                        <ALink href={ { pathname: '/s', query: { category: 'backpacks-and-fashion-bags' } } }>
                            <i className="d-icon-card"></i>Backpacks &amp; Fashion bags
                            </ALink>
                    </li>
                    <li>
                        <ALink href="#">
                            <i className="d-icon-card"></i>Daily Deals
                            </ALink>
                    </li>
                </ul>
            </div> */}
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        categoryList: state.category.data
    }
}

export default connect( mapStateToProps, { } )( MobileMenu );