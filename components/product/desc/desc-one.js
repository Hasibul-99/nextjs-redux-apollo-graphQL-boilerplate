import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import ALink from '../../features/custom-link';

import { modalActions } from '../../../store/modal';

import { toDecimal } from '../../../utils';
import { dateFormate } from '../../../utils/helpers';

function DescOne( props ) {
    const { product, isGuide = true, isDivider = true, openModal } = props;

    console.log(product);

    let colors = [], sizes = [];

    // if ( product.variants.length > 0 ) {
    //     if ( product.variants[ 0 ].size )
    //         product.variants.forEach( item => {
    //             if ( sizes.findIndex( size => size.name === item.size.name ) === -1 ) {
    //                 sizes.push( { name: item.size.name, value: item.size.size } );
    //             }
    //         } );

    //     if ( product.variants[ 0 ].color ) {
    //         product.variants.forEach( item => {
    //             if ( colors.findIndex( color => color.name === item.color.name ) === -1 )
    //                 colors.push( { name: item.color.name, value: item.color.color } );
    //         } );
    //     }
    // }

    const setRating = ( e ) => {
        e.preventDefault();

        if ( e.currentTarget.parentNode.querySelector( '.active' ) ) {
            e.currentTarget.parentNode.querySelector( '.active' ).classList.remove( 'active' );
        }

        e.currentTarget.classList.add( 'active' );
    }

    const showVideoModalHandler = ( e ) => {
        e.preventDefault();
        let link = e.currentTarget.closest( '.btn-play' ).getAttribute( 'data' );
        openModal( link );
    }

    return (
        <Tabs className="tab tab-nav-simple product-tabs mb-5" selectedTabClassName="show" selectedTabPanelClassName="active" defaultIndex={ 0 } >
            <TabList className="nav nav-tabs justify-content-center" role="tablist">
                <Tab className="nav-item">
                    <span className="nav-link">Overview</span>
                </Tab>
                {
                    product?.attributeValues?.length ? <Tab className="nav-item">
                        <span className="nav-link">Specifications</span>
                    </Tab> : '' 
                }
                
                {
                    product?.video_url ? <Tab className="nav-item">
                        <span className="nav-link">Video</span>
                    </Tab> : ''
                }
                
                <Tab className="nav-item">
                    <span className="nav-link">Reviews 
                    ({ product?.reviews?.data?.length })
                    </span>
                </Tab>
                <Tab className="nav-item">
                    <span className="nav-link">Return & Warrenty Policy</span>
                </Tab>
            </TabList>

            <div className="tab-content">
                <TabPanel className="tab-pane product-tab-description">
                    <div className="row mt-6">
                        <div className="col-md-12">
                            <h5 className="description-title mb-4 font-weight-semi-bold ls-m">
                                Description
                            </h5>
                            <p className="mb-10">
                                {product?.productDetail[0]?.long_description}
							</p>
                            {/* <ul className="mb-10">
                                <li>Praesent id enim sit amet.Tdio vulputate</li>
                                <li>Eleifend in in tortor. ellus massa.Dristique sitii</li>
                                <li>Massa ristique sit amet condim vel</li>
                                <li>Dilisis Facilisis quis sapien. Praesent id enim sit amet</li>
                            </ul> */}
                            {/* <h5 className="description-title mb-3 font-weight-semi-bold ls-m">Specifications</h5>
                            <table className="table mb-10">
                                <tbody>
                                    <tr>
                                        <th className="font-weight-semi-bold text-dark pl-0">Material</th>
                                        <td className="pl-4">Praesent id enim sit amet.Tdio</td>
                                    </tr>
                                    <tr>
                                        <th className="font-weight-semi-bold text-dark pl-0">Claimed Size</th>
                                        <td className="pl-4">Praesent id enim sit</td>
                                    </tr>
                                    <tr>
                                        <th className="font-weight-semi-bold text-dark pl-0">Recommended Use
													</th>
                                        <td className="pl-4">Praesent id enim sit amet.Tdio vulputate eleifend
														in in tortor. ellus massa. siti</td>
                                    </tr>
                                    <tr>
                                        <th className="font-weight-semi-bold text-dark border-no pl-0">
                                            Manufacturer</th>
                                        <td className="border-no pl-4">Praesent id enim</td>
                                    </tr>
                                </tbody>
                            </table> */}
                        </div>
                    </div>
                </TabPanel>
            
                {
                    product?.attributeValues?.length ? <TabPanel className="tab-pane product-tab-specifications">
                            <div className="row" style={{"padding": "0 1.5rem"}}>
                                <table className="table border table-striped">
                                    <tbody>
                                        {
                                            product?.attributeValues.map((attribute, index) => <tr key={'att-' + index}>
                                                <th className="font-weight-semi-bold text-dark">
                                                    {attribute?.attributeDetails?.attributeLabel[0]?.label}
                                                </th>
                                                <td className="pl-4">	
                                                    {attribute.value}
                                                </td>
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel> : ''
                }
                {/* https://www.youtube.com/embed/CKmcrjyGN2o */}
                {
                    product?.video_url ? <TabPanel className="tab-pane product-tab-video">
                        <div className="row" style={{padding: "0 1rem"}}> 
                            <div className="col-md-12 pl-md-12"> 
                                <iframe width="100%" height="400" src={product?.video_url}
                                    title="YouTube video player" frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen="">
                                </iframe>                                                 
                            </div>
                        </div>
                    </TabPanel> : ''
                }

                <TabPanel className="tab-pane product-tab-reviews">
                    {
                        product?.reviews?.data.length === 0 ?
                            <div className="comments mb-2 pt-2 pb-2 border-no">
                                There are no reviews yet.
                            </div> :
                            <div className="comments mb-8 pt-2 pb-2 border-no">
                                <ul>
                                    {
                                        product?.reviews?.data.map(review => <li key={review.id}>
                                            <div className="comment">
                                                <div className="comment-body">
                                                    <div className="comment-rating ratings-container mb-0">
                                                        <div className="ratings-full">
                                                            <span className="ratings" style={ { width: review.rating * 20 + '%' } }></span>
                                                            <span className="tooltiptext tooltip-top">{ toDecimal( review.rating ) }</span>
                                                        </div>
                                                    </div>
                                                    <div className="comment-user">
                                                        <span className="comment-date text-body"> 
                                                            {dateFormate(review.created_at)}
                                                        </span>
                                                        <h4><ALink href="#">{review?.customerDetails?.name}</ALink></h4>
                                                    </div>
    
                                                    <div className="comment-content">
                                                        <p>{review?.customer_comment}</p>
                                                    </div>

                                                    {
                                                        review?.reviewImages?.length ? <div className='review-images'>
                                                            {
                                                                review.reviewImages.map((image, i) => <img src={process.env.NEXT_PUBLIC_ASSET_URI + "/" + image.file_path} alt="avatar" 
                                                                        width="100" height="100" className='mr-3' key={i + '-' + image.file_path} />
                                                                )
                                                            }
                                                        </div> : ''
                                                    }

                                                </div>
                                            </div>
                                        </li>)
                                    }
                                </ul>
                            </div>
                    }

                    {/* <div className="reply">
                        <div className="title-wrapper text-left">
                            <h3 className="title title-simple text-left text-normal">
                                {
                                    product.reviews.length > 0 ? "Add a Review" :
                                        "Be The First To Review “" + product.name + "”"
                                }
                            </h3>
                            <p>Your email address will not be published. Required fields are marked *</p>
                        </div>
                        <div className="rating-form">
                            <label htmlFor="rating" className="text-dark">Your rating * </label>
                            <span className="rating-stars selected">
                                { [ 1, 2, 3, 4, 5 ].map( ( num, index ) =>
                                    <a className={ `star-${ num }` } href="#" onClick={ setRating } key={ 'star-' + index }>{ num }</a>
                                ) }
                            </span>

                            <select name="rating" id="rating" required="" style={ { display: 'none' } }>
                                <option value="">Rate…</option>
                                <option value="5">Perfect</option>
                                <option value="4">Good</option>
                                <option value="3">Average</option>
                                <option value="2">Not that bad</option>
                                <option value="1">Very poor</option>
                            </select>
                        </div>
                        <form action="#">
                            <textarea id="reply-message" cols="30" rows="6" className="form-control mb-4"
                                placeholder="Comment *" required></textarea>
                            <div className="row">
                                <div className="col-md-6 mb-5">
                                    <input type="text" className="form-control" id="reply-name"
                                        name="reply-name" placeholder="Name *" required />
                                </div>
                                <div className="col-md-6 mb-5">
                                    <input type="email" className="form-control" id="reply-email"
                                        name="reply-email" placeholder="Email *" required />
                                </div>
                            </div>
                            <div className="form-checkbox mb-4">
                                <input type="checkbox" className="custom-checkbox" id="signin-remember"
                                    name="signin-remember" />
                                <label className="form-control-label" htmlFor="signin-remember">
                                    Save my name, email, and website in this browser for the next time I
                                    comment.
											</label>
                            </div>
                            <button type="submit" className="btn btn-primary btn-rounded">Submit<i
                                className="d-icon-arrow-right"></i></button>
                        </form>
                    </div> */}

                </TabPanel>

                <TabPanel className="tab-pane product-tab-return-warrenty-policy">
                    <div className="clearfix"></div>
                    <div className="icon-box-wrap d-flex flex-wrap">
                        <div className="icon-box icon-box-side icon-border pt-2 pb-2 mb-4 mr-10">
                            <div className="icon-box-icon">
                                <i className="d-icon-lock"></i>
                            </div>
                            <div className="icon-box-content">
                                <h4 className="icon-box-title lh-1 pt-1 ls-s text-normal">2 year
                                                warranty</h4>
                                <p>Guarantee with no doubt</p>
                            </div>
                        </div>
                        {
                            isDivider ?
                                <div className="divider d-xl-show mr-10"></div> : ''
                        }
                        <div className="icon-box icon-box-side icon-border pt-2 pb-2 mb-4">
                            <div className="icon-box-icon">
                                <i className="d-icon-truck"></i>
                            </div>
                            <div className="icon-box-content">
                                <h4 className="icon-box-title lh-1 pt-1 ls-s text-normal">Shipping Charge</h4>
                                <p>Inside Dhaka ৳ {product?.shippingCharge.inside_dhaka}, Outside Dhaka Sadar ৳ {product?.shippingCharge.outside_dhaka_sadar}, Outside Dhaka Thana ৳ {product?.shippingCharge.outside_dhaka_thana}</p>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </div>
        </Tabs >
    )
}

export default connect( '', { openModal: modalActions.openModal } )( DescOne )