import React from 'react';
import Reveal from "react-awesome-reveal";
import { LazyLoadImage } from 'react-lazy-load-image-component';

// import Custom Components
// import ALink from '../../components/features/custom-link';
import OwlCarousel from '../../features/owl-carousel';

import { introSlider } from '../../../utils/data/carousel';
import { fadeInUpShorter, fadeInRightShorter, fadeInDownShorter, fadeInLeftShorter } from '../../../utils/data/keyframes';

function IntroSection() {
    return (
        <section className="intro-section">
            <div className="row mb-3">
                <div className="col-lg-12 col-sm-12">
                    <Reveal keyframes={fadeInRightShorter} delay={400} duration={1000} className="h-100">
                        <OwlCarousel adClass="intro-slider campaign-slider animation-slider owl-carousel owl-theme owl-dot-inner row cols-1 gutter-no" options={introSlider}>
                            <div className="intro-slide1 banner banner-fixed" style={{ backgroundColor: '#1f1f1f' }}>
                                <figure>
                                    <LazyLoadImage
                                        src="../images/campaign/campaign-slide-1.jpg"
                                        alt="Intro Slider"
                                        effect="opacity"
                                        width="100%"   //785
                                        height="auto"   //433
                                    />
                                </figure>
                            </div>
                            <div className="intro-slide2 banner banner-fixed" style={{ backgroundColor: '#f5f6f8' }}>
                                <figure>
                                    <LazyLoadImage
                                        src="../images/campaign/campaign-slide-2.jpg"
                                        alt="Intro Slider"
                                        effect="opacity"
                                        width="100%"   //785
                                        height="auto"   //433
                                    />
                                </figure>
                            </div>
                        </OwlCarousel>
                    </Reveal>
                </div>
            </div>

            <section className="campaign-section">
                <div className="container-fluid">
                    <div className="col-md-12 text-center mb-3">
                    <a href="#."> <img src="images/campaign/campaign-banner-7.png" alt /> </a> 
                    </div>  
                    <div className="row cols-2 cols-sm-5 product-wrapper">  
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="campagin-product-details.html">
                            <img src="images/campaign/camp-product.webp" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="campagin-product-details.html">5Star NOTE 1 Update Edition Smart phone -3GB RAM/ 32GB ROM</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top">3.00</span>
                            </div>
                            <a href="campagin-product-details.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="campagin-product-details.html">
                            <img src="images/campaign/camp-product-2.webp" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">10% OFF</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="campagin-product-details.html">Lenovo IdeaPad Slim 3i 15IIL 10th Gen Intel Core i5 1035G1, 8GB DDR4 Ram, 1TB HDD, 15.6 Inch FHD Antiglare Display Platinum Grey Laptop</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="campagin-product-details.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="campagin-product-details.html">
                            <img src="images/campaign/camp-product-3.webp" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">10% OFF</label>
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="campagin-product-details.html">GoPro HERO10 Black Action Camera</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top">3.00</span>
                            </div>
                            <a href="campagin-product-details.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/7.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Cosmetical Wristing Brush</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top">3.00</span>
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/8.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Men's Black Handbag</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top">3.00</span>
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/1.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">10% OFF</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Men's Black Handbag</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/6.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">10% OFF</label>
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Women’s Wide Tooth Comb</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/7.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Cosmetical Wristing Brush</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top">3.00</span>
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/8.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Men's Black Handbag</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/1.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">10% OFF</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Men's Black Handbag</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div> 
                    </div> 
                    <div className="col-md-12 text-center mb-3">
                    <a href="#.">  <img src="images/campaign/campaign-banner-8.png" alt /> </a> 
                    </div> 
                    <div className="row cols-2 cols-sm-5 product-wrapper"> 
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="campagin-product-details.html">
                            <img src="images/samsung-tv.jpeg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group"> 
                            <label className="product-label label-sale">20% OFF</label>
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div>
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="campagin-product-details.html">Samsung 50" 4K Smart UHD TV</a>
                            </h3> 
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="campagin-product-details.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/3.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Men's Black Wrist Watch</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/4.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Soft Sound Maker</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/5.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Women’s Face Cream</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/6.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">10% OFF</label>
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Women’s Wide Tooth Comb</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div> 
                    </div> 
                    <div className="col-md-12 text-center mb-3">
                    <a href="#.">  <img src="images/campaign/campaign-banner-12.png" alt /> </a> 
                    </div> 
                    <div className="row cols-2 cols-sm-5 product-wrapper"> 
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="campagin-product-details.html">
                            <img src="images/samsung-tv.jpeg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group"> 
                            <label className="product-label label-sale">20% OFF</label>
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div>
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="campagin-product-details.html">Samsung 50" 4K Smart UHD TV</a>
                            </h3> 
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="campagin-product-details.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/3.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Men's Black Wrist Watch</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/4.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Soft Sound Maker</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top">3.00</span>
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/5.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">20% OFF</label>
                            <label className="product-label label-new">new</label> 
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Women’s Face Cream</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top" />
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="product-wrap">
                        <div className="product text-center">
                        <figure className="product-media" style={{backgroundColor: '#F7F8FA'}}>
                            <a href="demo5-product.html">
                            <img src="images/demos/demo5/products/6.jpg" alt="Blue Pinafore Denim Dress" width={280} height={280} />
                            </a>
                            <div className="product-label-group">
                            <label className="product-label label-sale">10% OFF</label>
                            </div>
                            <div className="product-action-vertical">
                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart"><i className="d-icon-bag" /></a>
                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist"><i className="d-icon-heart" /></a>
                            </div> 
                        </figure>
                        <div className="product-details"> 
                            <h3 className="product-name">
                            <a href="demo5-product.html">Women’s Wide Tooth Comb</a>
                            </h3>
                            <div className="product-price">
                            <ins className="new-price mr-1">৳980.00</ins><del className="old-price">৳2100.00</del>
                            </div>
                            <div className="ratings-container">
                            <div className="ratings-full">
                                <span className="ratings" style={{width: '60%'}} />
                                <span className="tooltiptext tooltip-top">3.00</span>
                            </div>
                            <a href="demo5-product.html" className="rating-reviews">( 6 reviews )</a>
                            </div>
                        </div>
                        </div>
                    </div> 
                    </div> 
                </div>  {/* end container fluid    */} 
            </section>
        </section>
    )
}

export default React.memo(IntroSection);