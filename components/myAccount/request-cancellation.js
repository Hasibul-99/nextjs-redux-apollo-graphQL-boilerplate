import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { USER_ADDRESS, UPADTE_DEFAULT_ADDRESS, GET_LOGIN_USER_INFO } from '../../server/queries';
import ALink from '../../components/features/custom-link';

import { authUserActions } from '../../store/authUser';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
    
function RequestCancellation() {

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">Cancellation Request</h3>
            <hr className="mb-4"></hr>
            <div className="row mb-4"> 
                <div className="col-md-12"> 
                    <div className="summary mb-3"> 
                        <form action="#">
                        <div className="col-xs-12 border-bottom">
                            <p className="mb-0" style={{fontWeight:'500'}}>  Choose the item (s) you want to cancel   </p>
                            <div className="form-checkbox mt-4 mb-4">
                                <input type="checkbox" className="custom-checkbox" id="terms-condition2" name="terms-condition" />
                                <label className="form-control-label" for="terms-condition2">
                                    <div className="row pl-3">
                                        <div className="col-5 product-thumbnail rounded d-flex align-items-center"> 
                                            <img src="../images/products/product5.jpg" />
                                            <span className="pl-5" style={{lineHeight:1.2}}>Hand Bag</span>  
                                        </div> 
                                        <div className="col-3">  
                                            Qty: 1
                                        </div>  
                                        <div className="col-4">  
                                            <select name="country" className="form-control">
                                                <option value="fe" selected="">Select a Reason</option>
                                                <option value="ma"> Duplicate Order </option>
                                                <option value="other">Delivery Time too Long</option> 
                                                <option value="other">Change Address</option> 
                                                <option value="other">Change of Mind</option> 
                                            </select> 
                                        </div>
                                    </div> 
                                </label>
                            </div>
                        </div>

                        <div className="col-xs-12 border-bottom">
                            <div className="form-checkbox mt-4 mb-4">
                                <input type="checkbox" className="custom-checkbox" id="terms-condition2" name="terms-condition" />
                                <label className="form-control-label" for="terms-condition2">
                                    <div className="row pl-3">
                                        <div className="col-5 product-thumbnail rounded d-flex align-items-center"> 
                                            <img src="images/products/product4.jpg" />
                                            <span className="pl-5" style={{lineHeight:1.2}}>Yoga Mat DPE</span>  
                                        </div> 
                                        <div className="col-3">  
                                            Qty: 1
                                        </div>  
                                        <div className="col-4">  
                                            <select name="country" className="form-control">
                                                <option value="fe" selected="">Select a Reason</option>
                                                <option value="ma"> Duplicate Order </option>
                                                <option value="other">Delivery Time too Long</option> 
                                                <option value="other">Change Address</option> 
                                                <option value="other">Change of Mind</option> 
                                            </select> 
                                        </div>
                                    </div>
                                    
                                </label>
                            </div>
                        </div>


                        <div className="review-form-wrapper mt-4">
                            <div className="title-wrapper text-left">
                                <p className="mb-0">Additional Information (Optional): </p>
                            </div> 
                                
                            <div className="review-form-section">  
                                    <textarea id="reply-message" cols="30" rows="6" className="form-control mb-4" placeholder="e.g : My address changed" required=""></textarea>

                                    <div className="review-medias">
                                        <div className="file-input form-control image-input mb-2" style={{backgroundImage: "url(../images/placeholder.png)"}}>
                                            <div className="file-input-wrapper">
                                            </div>
                                            <label className="btn-action btn-upload" title="Upload Media">
                                                <input type="file" accept=".png, .jpg, .jpeg" name="riode_comment_medias_image_1" />
                                            </label>
                                            <label className="btn-action btn-remove" title="Remove Media">
                                            </label>
                                        </div>

                                        <div className="file-input form-control image-input img-input2 mb-2"> 
                                            <div className="file-input-wrapper review-upload-image">
                                                <i className="d-icon-camera2"> </i>
                                                <p className="mb-0">  1/6 </p>
                                            </div> 
                                        </div>  
                                    </div> 

                                    <p className="font-weight-normal mb-2">Upload images and videos. Maximum count: 3, size: 2MB</p>
                            </div>  
                        </div>
                        
                    </form></div>

                    <div className="summary">
                        <div className="col-xs-12">
                            <h6 className="mb-0" style={{fontWeight:'500'}}> Cancellation Policy </h6>
                            <p className="mb-0"> Before cancelling the order, kindly read thoroughly our following terms &amp; conditions: </p>
                            <ol className="mt-1"> 
                                <li> 
                                    Once you submit this form you agree to cancel the selected item(s) in your order. We will be unable to retrieve your order once it is cancelled.
                                </li>
                                <li> 
                                    Once you confirm your item(s) cancellation, we will process your refund within 24 hours, provided the item(s) has not been handed over to the logistics partner yet. Please note that, if your item has already been handed over to the logistics partner we will be unable to proceed with your cancellation request and we will inform you accordingly.
                                </li>
                                <li> 
                                    If you are cancelling your order partially, ie. not all the items in your order, then we will be unable to refund you the shipping fee.
                                </li>  
                            </ol> 
                            
                        </div>
                    </div>

                    <div className="col-xs-12 mt-2"> 
                        <div className="form-checkbox mt-2 mb-2">
                            <input type="checkbox" className="custom-checkbox" id="terms-condition3" name="terms-condition3" />
                            <label className="form-control-label pl-5" for="terms-condition3">
                                I have read and agree to the website <a href="#">terms and conditions </a>*
                            </label>
                        </div>
                        <button type="submit" className="btn btn-secondary btn-rounded float-right">Submit<i className="d-icon-arrow-right"></i></button> 
                    </div>     
                </div>
            </div>
        </div>
    )
}


export default RequestCancellation;
