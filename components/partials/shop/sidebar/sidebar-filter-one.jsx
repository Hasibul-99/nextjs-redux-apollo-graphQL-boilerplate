import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import InputRange from 'react-input-range';

import ALink from '../../../features/custom-link';
import Card from '../../../features/accordion/card';
import OwlCarousel from '../../../features/owl-carousel';

// import filterData from '../../../../utils/data/shop';
import { scrollTopHandler } from '../../../../utils';

function SidebarFilterOne( props ) {
    const { type = "left", isFeatured = false, layered_data, priceRange, reviewRange } = props;
    const router = useRouter();
    const query = router.query;

    const [ filterPrice, setPrice ] = useState();
    const [ isFirst, setFirst ] = useState( true );
    let timerId;

    const filterByPrice = ( e ) => {
        e.preventDefault();
        let url = router.pathname.replace( '[grid]', query.grid );
        let arr = [ `min_price=${ filterPrice.min }`, `max_price=${ filterPrice.max }`, 'page=1' ];
        for ( let key in query ) {
            if ( key !== 'min_price' && key !== 'max_price' && key !== 'page' && key !== 'grid' ) arr.push( key + '=' + query[ key ] );
        }
        url = url + '?' + arr.join( '&' );
        router.push( url );
    }

    const containsAttrInUrl = ( type, value ) => {
        const currentQueries = query[ type ] ? query[ type ].split( ',' ) : [];
        return currentQueries && currentQueries.includes( value );
    }

    const getUrlForAttrs = ( type, value ) => {
        let currentQueries = query[ type ] ? query[ type ].split( ',' ) : [];
        currentQueries = containsAttrInUrl( type, value ) ? currentQueries.filter( item => item !== value ) : [ ...currentQueries, value ];
        return currentQueries.join( ',' );
    }

    const onChangePrice = value => {
        setPrice( value );
    }

    const toggleSidebar = e => {
        e.preventDefault();
        document.querySelector( 'body' ).classList.remove( `${ type === "left" || type === "off-canvas" ? "sidebar-active" : "right-sidebar-active" }` );

        let stickyWraper = e.currentTarget.closest( '.sticky-sidebar-wrapper' );

        let mainContent = e.currentTarget.closest( '.main-content-wrap' );
        if ( mainContent && type !== "off-canvas" && query.grid !== '4cols' )
            mainContent.querySelector( '.row.product-wrapper' ) && mainContent.querySelector( '.row.product-wrapper' ).classList.toggle( 'cols-md-4' );

        if ( mainContent && stickyWraper ) {
            stickyWraper.classList.toggle( 'closed' );

            if ( stickyWraper.classList.contains( 'closed' ) ) {
                mainContent.classList.add( 'overflow-hidden' );
                clearTimeout( timerId );
            } else {
                timerId = setTimeout( () => {
                    mainContent.classList.remove( 'overflow-hidden' );
                }, 500 );
            }
        }
    }

    const showSidebar = ( e ) => {
        e.preventDefault();
        document.querySelector( 'body' ).classList.add( "sidebar-active" );
    }

    const filterReviewRange = (minRange) => {
        console.log("minRange", minRange);
        
        let url = router.pathname.replace( '[grid]', query.grid );
        let arr = [ `min_range=${ minRange }`, `max_range=${ 5 }`, 'page=1' ];
        for ( let key in query ) {
            if ( key !== 'min_range' && key !== 'max_range' && key !== 'page' && key !== 'grid' ) arr.push( key + '=' + query[ key ] );
        }
        url = url + '?' + arr.join( '&' );
        router.push( url );
    }

    const hideSidebar = () => {
        document.querySelector( 'body' ).classList.remove( `${ type === "left" || type === "off-canvas" || type === "boxed" || type === "banner" ? "sidebar-active" : "right-sidebar-active" }` );
    }

    useEffect(() => {
        let tmpPrice = { max: priceRange.max_price ? Math.ceil( priceRange.max_price ) : 1000, min: priceRange.min_price ? Math.ceil( priceRange.min_price ) : 0 };
        setPrice(tmpPrice);
    }, [priceRange])
    
    useEffect( () => {
        window.addEventListener( 'resize', hideSidebar );

        return () => {
            window.removeEventListener( 'resize', hideSidebar );
        }
    }, [] )

    useEffect( () => {
        setPrice( { 
            max: query.max_price ? parseInt( query.max_price ) : priceRange?.max_price,
            min: query.min_price ? parseInt( query.min_price ) : priceRange?.min_price 
        } );
        
        if ( isFirst ) {
            setFirst( false );
        } else {
            scrollTopHandler();
        }
    }, [ query, priceRange ] )

    return (
        <aside className={ `col-lg-3 shop-sidebar skeleton-body ${ type === "off-canvas" ? '' : "sidebar-fixed sticky-sidebar-wrapper" } ${ type === "off-canvas" || type === "boxed" ? '' : "sidebar-toggle-remain" } ${ type === "left" || type === "off-canvas" || type === "boxed" || type === "banner" ? "sidebar" : "right-sidebar" }` }>
            <div className="sidebar-overlay" onClick={ hideSidebar }></div>
            {
                type === "boxed" || type === "banner" ? <a href="#" className="sidebar-toggle" onClick={ showSidebar }><i className="fas fa-chevron-right"></i></a> : ''
            }
            <ALink className="sidebar-close" href="#" onClick={ hideSidebar }><i className="d-icon-times"></i></ALink>

            <div className="sidebar-content px-5">
                {
                    layered_data ?
                        <div className="sticky-sidebar">
                            {
                                type === "boxed" || type === "banner" ? '' :
                                    <div className="filter-actions mb-4">
                                        <a href="#" className="sidebar-toggle-btn toggle-remain btn btn-outline btn-primary btn-icon-right btn-rounded" onClick={ toggleSidebar }>
                                            Filter
                                            {
                                                type === "left" || type === "off-canvas" ?
                                                    <i className="d-icon-arrow-left"></i> : <i className="d-icon-arrow-right"></i>
                                            }
                                        </a>
                                        <ALink href={ { pathname: router.pathname, query: { grid: query.grid, type: router.query.type ? router.query.type : null } } } scroll={ false } className="filter-clean">Clean All</ALink>
                                    </div>
                            }

                            {
                                priceRange?.max_price ? <div className="widget widget-collapsible">
                                    <Card title="<h3 class='widget-title'>Filter by Price<span class='toggle-btn p-0 parse-content'></span></h3>" type="parse" expanded={ true }>
                                        <div className="widget-body">
                                            <form action="#">
                                                <div className="filter-price-slider noUi-target noUi-ltr noUi-horizontal shop-input-range">
                                                    <InputRange
                                                        formatLabel={ value => `$${ value }` }
                                                        maxValue={ Math.ceil(priceRange.max_price) }
                                                        minValue={ Math.ceil(priceRange.min_price) }
                                                        step={ 50 }
                                                        value={ filterPrice }
                                                        onChange={ onChangePrice }
                                                    />
                                                </div>

                                                <div className="filter-actions">
                                                    <div className="filter-price-text mb-4">Price: ৳{ priceRange.min_price } - ৳{ priceRange.max_price }
                                                        <span className="filter-price-range"></span>
                                                    </div>
                                                    <div className="row justify-content-between mb-0">
                                                        <div className="col-xs-4"> 
                                                            <input type="text" className="form-control" name="min-price" 
                                                                onChange={e => {
                                                                    setPrice((prev) => ({
                                                                        ...prev,
                                                                        "min": e.target.value
                                                                    }))
                                                                }}
                                                                value={ filterPrice?.min } placeholder="Min" />
                                                        </div>
                                                        <div className="col-xs-4"> 
                                                            <input type="text" className="form-control" name="max-price" 
                                                                onChange={e => {
                                                                    setPrice((prev) => ({
                                                                        ...prev,
                                                                        "max": e.target.value
                                                                    }))
                                                                }}
                                                                value={ filterPrice?.max } placeholder="Max" />
                                                        </div> 
                                                    </div>

                                                    <button className="btn btn-dark btn-filter btn-rounded" onClick={ filterByPrice }>Filter</button>
                                                </div>
                                            </form>
                                        </div>
                                    </Card>
                                </div> : ''
                            }

                            {
                                layered_data?.length ? <Fragment>
                                    {
                                        layered_data.map(layer => <Fragment key={'filter1-' + layer.label}>
                                            {
                                                layer?.values?.length ? <div className="widget widget-collapsible" >
                                                        <Card title={`<h3 class='widget-title'>${layer.label}<span class='toggle-btn p-0 parse-content'></span></h3>`}
                                                            type="parse" expanded={ true }>
                                                            <ul className="widget-body filter-items">
                                                                {
                                                                    layer.values.map( ( item, index ) =>
                                                                        <li
                                                                            className={ containsAttrInUrl( layer.label, item.value ) ? 'active' : '' }
                                                                            key={ "firts-" + layer.label + ' - ' + index }
                                                                        >
                                                                            <ALink scroll={ false } 
                                                                                href={ { pathname: router.pathname, query: { ...query, page: 1, 
                                                                                        [layer.label]: getUrlForAttrs( layer.label, item.value ), 
                                                                                        type: router.query.type ? router.query.type : null } } }>
                                                                                    { item.value }
                                                                            </ALink>
                                                                        </li>
                                                                    )
                                                                }
                                                            </ul>
                                                        </Card>
                                                    </div> : ''
                                            }
                                        </Fragment> )
                                    }
                                </Fragment> : ''
                            }
                            

                            {/* <div className="widget widget-collapsible">
                                <Card title="<h3 class='widget-title'>Color<span class='toggle-btn p-0 parse-content'></span></h3>" type="parse" expanded={ true }>
                                    <ul className="widget-body filter-items colors">
                                        {
                                            filterData.colors.map( ( item, index ) =>
                                                <li id={item.name ==="White" ? "alternate" :""} style = {{backgroundColor: item.name}}
                                                    className={ containsAttrInUrl( 'colors', item.slug ) ? 'active' : '' }
                                                    key={ item + ' - ' + index }
                                                >
                                                    <ALink scroll={ false } href={ { pathname: router.pathname, query: { ...query, page: 1, colors: getUrlForAttrs( 'colors', item.slug ), type: router.query.type ? router.query.type : null } } }>
                                                    </ALink>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </Card>
                            </div> */}

                            <div className="widget widget-collapsible">
                                <Card title="<h3 class='widget-title'>Ratings<span class='toggle-btn p-0 parse-content'></span></h3>" type="parse" expanded={ true }>
                                    <ul className="widget-body filter-items">
                                        {(() => {
                                            const rows = [];
                                            for (let i = reviewRange?.max_review; i >= reviewRange?.min_review; i--) {
                                                rows.push(<div className="ratings-container mb-0 font-15 pb-2" onClick={() => filterReviewRange(i)}>
                                                    <div className="ratings-full" style={{color:'orange'}}>
                                                        <span className="ratings" style={{width: `${(i * 100) / 5}%`}}></span>
                                                        <span className="tooltiptext tooltip-top">5.00</span> 
                                                    </div> 
                                                    {
                                                        i !== 5 ? <small className="font-13 and-up ml-1">And Up</small> : ''
                                                    }
                                                </div>);
                                            }
                                            return rows;
                                        })()}     
                                    </ul>
                                </Card>
                            </div>

                            {/* {
                                isFeatured ?
                                    <div className="widget widget-products widget-collapsible">
                                        <Card title="<h4 className='widget-title'>Our Featured</h4>" type="parse" expanded={ true }>
                                            <div className="widget-body">
                                                <OwlCarousel adclassName="owl-nav-top">
                                                    <div className="products-col">
                                                        {
                                                            featuredProducts.slice( 0, 3 ).map( ( item, index ) =>
                                                                <SmallProduct
                                                                    product={ item }
                                                                    key={ "third3-" + item.name + ' - ' + index }
                                                                />
                                                            ) }
                                                    </div>
                                                    <div className="products-col">
                                                        {
                                                            featuredProducts.slice( 3, 6 ).map( ( item, index ) =>
                                                                <SmallProduct
                                                                    product={ item }
                                                                    key={ "sec2-" + item.name + ' - ' + index }
                                                                />
                                                            ) }
                                                    </div>
                                                </OwlCarousel>
                                            </div>
                                        </Card>
                                    </div>
                                    : ''
                            } */}
                        </div>
                        : <div className="widget-2 mt-10 pt-5"></div>
                }
            </div>
        </aside >
    )
}

export default SidebarFilterOne;
