import ALink from '../features/custom-link';

function ProductsSidebar( props ) {
    const { adClass = '', type = "right", shippingCharge } = props;

    const toggleSidebarHandler = ( e ) => {
        if ( type === "right" )
            document.querySelector( 'body' ).classList.toggle( 'right-sidebar-active' );
        else
            document.querySelector( 'body' ).classList.toggle( 'sidebar-active' );
    }

    const hideSidebarhandler = ( e ) => {
        if ( type === "right" )
            document.querySelector( 'body' ).classList.remove( 'right-sidebar-active' );
        else
            document.querySelector( 'body' ).classList.remove( 'sidebar-active' );
    }

    return (
        <aside className={ `col-lg-3 sidebar-fixed sticky-sidebar-wrapper ${ adClass } ${ type === 'left' ? 'sidebar' : 'right-sidebar' }` }>
            <div className="sidebar-overlay" onClick={ hideSidebarhandler }>
                <ALink className="sidebar-close" href="#">
                    <i className="d-icon-times"></i>
                </ALink>
            </div>

            <div className="sidebar-toggle" onClick={ toggleSidebarHandler }>
                {
                    type === "right" ?
                        <i className="fas fa-chevron-left"></i>
                        :
                        <i className="fas fa-chevron-right"></i>
                }
            </div>

            <div className="sidebar-content">
                {
                    !shippingCharge ? <div className="widget-2"></div> :
                        <div className="sticky-sidebar">
                            <div className="service-list mb-4">
                                <div className="icon-box icon-box-side icon-box3">
                                    <span className="icon-box-icon">
                                        <i className="d-icon-secure"></i>
                                    </span>
                                    <div className="icon-box-content">
                                        <h4 className="icon-box-title text-capitalize">Secured Payment</h4>
                                        <p>We secure payment!</p>
                                    </div>
                                </div>
                                <div className="icon-box icon-box-side icon-box1">
                                    <span className="icon-box-icon">
                                        <i className="d-icon-truck"></i>
                                    </span>
                                    <div className="icon-box-content">
                                        <h4 className="icon-box-title text-capitalize">Shipping Charge</h4>
                                        <p className='mb-1 mt-1'>Inside Dhaka ৳ {shippingCharge?.inside_dhaka}</p>
                                        <p className='mb-1'>Outside Dhaka Sadar ৳ {shippingCharge?.outside_dhaka_sadar}</p>
                                        <p>Outside Dhaka Thana ৳ {shippingCharge?.outside_dhaka_thana}</p>
                                    </div>
                                </div>
                                <div className="icon-box icon-box-side icon-box2">
                                    <span className="icon-box-icon">
                                        <i className="d-icon-money"></i>
                                    </span>
                                    <div className="icon-box-content">
                                        <h4 className="icon-box-title text-capitalize">Money Back</h4>
                                        <p>Any back within 30 days</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                }
            </div>
        </aside>
    );
}

export default ProductsSidebar;