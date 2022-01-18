import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useMutation } from "@apollo/client";
import ALink from '../features/custom-link';
import { toDecimal } from '../../utils';
import { SEARCH_SUGGESTION } from "../../server/queries";


export default function SearchForm() {
    const router = useRouter();
    const [searchResult, setSearchResult] = useState();
    const [ search, setSearch ] = useState( "" );
    const [ searchProducts ] = useMutation( SEARCH_SUGGESTION, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                
            }
            setSearchResult(null);
        }
    });

    const [ timer, setTimer ] = useState( 'null' );

    useEffect( () => {
        document.querySelector( "body" ).addEventListener( "click", onBodyClick );

        return ( () => {
            document.querySelector( "body" ).removeEventListener( "click", onBodyClick );
        } )
    }, [] )

    useEffect( () => {
        setSearch( "" );
        setSearchResult(null);
    }, [ router.query ] )

    useEffect( () => {
        if ( search.length > 2 ) {
            if ( timer ) clearTimeout( timer );
            let timerId = setTimeout( () => {
                getSearchData()
            }, 500 );

            setTimer( timerId );
        } else {
            setSearchResult(null);
        }
    }, [ search ] )

    useEffect( () => {
        document.querySelector( '.header-search.show-results' ) && document.querySelector( '.header-search.show-results' ).classList.remove( 'show-results' );
    }, [ router.pathname ])

    const getSearchData = async () => {
        let res = await searchProducts( { variables: { searchQuery: search } } );

        if (res) {
            let masterData = res?.data?.suggestion;
            let content = {
                category: masterData?.category ? JSON.parse(masterData.category) : [],
                product: masterData?.product ? JSON.parse(masterData.product) : [],
                suggestion: masterData?.suggestion ? JSON.parse(masterData.suggestion) : [],
            }

            setSearchResult(content);

            setTimer( null );
        }
    }

    function onSearchClick( e ) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.parentNode.classList.toggle( 'show' );
    }

    function onBodyClick( e ) {
        if ( e.target.closest( '.header-search' ) ) return e.target.closest( '.header-search' ).classList.contains( 'show-results' ) || e.target.closest( '.header-search' ).classList.add( 'show-results' );

        document.querySelector( '.header-search.show' ) && document.querySelector( '.header-search.show' ).classList.remove( 'show' );
        document.querySelector( '.header-search.show-results' ) && document.querySelector( '.header-search.show-results' ).classList.remove( 'show-results' );
    }

    function onSearchChange( e ) {
        setSearch( e.target.value );
    }

    const handleKeyDownSearch = (event) => {
        if (event.key === 'Enter' ) {
            let value = event.target.value;
            if (value?.length > 2 ) {
                router.push(`/s/?search=${value}`);

                setTimeout(() => {
                    setSearchResult(null);
                }, 1000)
            }
        }
    }

    function onSubmitSearchForm( e ) {
        e.preventDefault();
        // router.push( {
        //     pathname: '/s',
        //     query: {
        //         search: search
        //     }
        // } );

        getSearchData()
    }

    return (
        <div className="header-search hs-simple">
            <a href="#" className="search-toggle" role="button" onClick={ onSearchClick }><i className="icon-search-3"></i></a>
            
            <form action="#" method="get" onSubmit={ onSubmitSearchForm } className="input-wrapper">
                <input type="text" className="form-control" name="search" autoComplete="off" value={ search } 
                    onChange={ onSearchChange } onKeyDown={handleKeyDownSearch}
                    placeholder="Search for products ..." />

                <button className="btn btn-search" type="submit">
                    <i className="d-icon-search"></i>
                </button>
            </form>

            {
                searchResult ? <div className="snize-ac-results">
                
                    <div className="snize-dropdown-arrow" style={{right: "auto", left: "30px"}}>
                        <div className="snize-arrow-outer"></div>
                        <div className="snize-arrow-inner snize-arrow-inner-label"></div>
                    </div>
                    
                    <ul>

                    {
                        searchResult?.suggestion?.length ? <>
                            <li className="snize-label snize-removable">Popular suggestions</li>
                                {
                                    searchResult?.suggestion.map(data => <li 
                                        className="snize-suggestion snize-ac-odd snize-removable" 
                                        key={"suggestion-"+ data.suggestion}>
                                            <ALink href={`/s/?search=${data.suggestion}`} className="snize-view-link" 
                                                data-no-instant="true">
                                                {data.suggestion}
                                            </ALink>
                                    </li>)
                                }
                            </>  : ''
                    }

                    {
                        searchResult?.category?.length ? <Fragment>
                            <li className="snize-label snize-removable">Categories</li>
                            {
                                searchResult?.category.map(cat => <li className="snize-category snize-ac-odd snize-removable" 
                                    key={"cater--"+cat.id}>
                                    <ALink href={`/s/?category=${cat.url_key}`} className="snize-view-link" data-no-instant="true">
                                        {cat.name}
                                    </ALink>
                                </li>)
                            }
                        </Fragment> : ''
                    }

                    {
                        searchResult?.product?.length ? <Fragment>
                            <li className="snize-label snize-removable">Products</li>
                            {
                                searchResult?.product.map((pro, index) =>  <li className="snize-ac-odd snize-product snize-removable" 
                                id="snize-ac-product-812" key={'sea-product-'+ index }>
                                <a href={`/product/${pro.url_key}`} className="snize-item clearfix" draggable="false">
                                    <span className="snize-thumbnail">
                                        <Image 
                                            src={ pro.image_path ? process.env.NEXT_PUBLIC_ASSET_URI + "/" +
                                                pro.image_path : "/images/b71.png" }
                                            className="snize-item-image" 
                                            height={70} 
                                            width={70}
                                            quality={10}
                                            alt="" 
                                            border="0"/>
                                    </span>
                                    <span className="snize-overhidden">
                                        <span className="snize-title">{pro.name}</span>
                                        <span className="snize-description" >
                                            {pro.short_description}
                                        </span>
                                        <div className="snize-price-list">
                                            <span className="snize-price  money ">BDT {pro.price}</span>
                                        </div>
                                        <span className="snize-in-stock" style={ pro.qty < 1 ? { color: 'red'} : {}}>
                                            {pro.qty > 1 ? "In Stock" : 'Out of Stock' }
                                        </span>
                                    </span>
                                </a>
                            </li>)
                            }
                        </Fragment> : ''
                    }

                        {/* <li className="snize-view-all-link snize-ac-even snize-removable">
                            <span>View all 241 items</span>
                            <i className="snize-ac-results-arrow"></i>
                        </li> */}
                    </ul>
                    
                </div> : ''
            }
        </div>
    )
}
