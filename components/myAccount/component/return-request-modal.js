import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { FILE_UPLOAD } from  "../../../scripts/api.js";
import { postData } from "../../../scripts/api-service.js";
// import Resizer from "react-image-file-resizer";

import { CREATE_RETURN_REQUEST } from '../../../server/queries';

export default function ReturnRequestModal(props) {
    const { returnReason, closeReturnModal, selectOrder, generateOrderInfo } = props;

    const [images, setImages] = useState([]);
    const [selectedRefundReason, setSelectedRefundReason] = useState();
    const [refundTermConfi, setRefundTermCondi] = useState(false);

    
    const [createReturnReuest] = useMutation( CREATE_RETURN_REQUEST, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                toast.error(graphQLErrors[0].message);
            }
        },
        onCompleted() {
            closeReturnModal();
            generateOrderInfo();
            toast.success("Return Request Placed Successfully!");
        }
    });


    
    const removeImage = (imageId) => {
        let newImage = images.filter(img => img.id !== imageId);
        setImages(newImage);
    }

    const imageUpload = (e) => {
        let files = e.target.files;

        if (files && files.length) {
            for(var i=0;i<files.length;i++) {
                const file = files[i];

                Resizer.imageFileResizer(
                    file,
                    400,
                    400,
                    "PNG",
                    100,
                    0,
                    async (uri) => {
                        let data = {
                            id: Math.random().toString(16).slice(2),
                            file: uri,
                            base64: await getBase64(uri)
                        }

                        setImages(prev => [...prev, data]);
                    },
                    "file",
                    400,
                    400
                );
            }
        }
    }

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const handelRefundRequest = async () => {
        if (images?.length) {
            let data = new FormData();

            images.map((img, i) => {
                data.append(`file${i}`, img.file);
            })
    
            let res = await postData(FILE_UPLOAD, data);
    
            if (res?.data?.length) {
                let images = [];

                res.data.forEach(img => {
                    images.push({ image_path: img })
                })
                addRefundRequest(images);
            }
        } else {
            addRefundRequest();
        }
    }

    const addRefundRequest = (images) => {
        let variablesData = {
            "packageId": selectOrder?.packageDetails?.id,
            "additionalInfo": $('#js-refundMeaasge').val() || '',
            "returnReason": selectedRefundReason ? selectedRefundReason.toString() : '',
            "returnImages": images ? JSON.stringify(images) : ''
        };

        console.log("variablesData", variablesData);

        createReturnReuest({
            variables: {
                "packageId": selectOrder?.packageDetails?.id,
                "additionalInfo": $('#js-refundMeaasge').val() || '',
                "returnReason": selectedRefundReason ? selectedRefundReason.toString() : '',
                "returnImages": images ? JSON.stringify(images) : ''
            }
        })
    }

    return (
        <section className="error-section d-flex flex-column justify-content-center align-items-center text-center">
            <div className="remove-btn-modal-custom" onClick={() => closeReturnModal()}>
                <i className="fas fa-times"></i>
            </div>
                <h4 className="mt-7 mb-0 ls-m">Return Request</h4>
                <p className="text-grey font-primary ls-m mb-1">Are you sure want to return this product?</p>
            <hr/>
            <div className="form-group">
                <label htmlFor="js-cancelreaons" className='text-left'>Select Reason of Return *</label>
                
                <select className="form-control" onChange={e => setSelectedRefundReason(e.target.value)}>
                    <option>Select a reason *</option>
                    {
                        returnReason?.length ? returnReason.map(res => <option key={res.id} value={res.reason}>{res.reason}</option>) : ''
                    }
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="js-cancelMeaasge" className='text-left'>Write Detail Reason (Optional) </label>
                <textarea className="form-control" id="js-refundMeaasge" placeholder="Write Detail Reason (Optional)" rows="3"></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="js-cancelMeaasge" className='text-left'> Upload Images </label>
                <div className="review-form-wrapper"> 
                    <div className="review-form-section">
                        <div className="review-medias">
                            {
                                images.map(image => <div className="file-input form-control image-input mb-2" 
                                    style={{backgroundImage: `url(${image.base64})`}} key={image.id}>
                                    <div className="file-input-wrapper">
                                    </div>
                                    <label className="btn-action btn-remove" title="Remove Image" onClick={() => {removeImage(image.id)}}>
                                    </label>
                                </div>)
                            }

                            <div className="file-input form-control image-input img-input2 mb-2 mr-0">
                                <div className="file-input-wrapper review-upload-image mr-0 re">
                                    <i className="d-icon-camera2">
                                        <input type="file" accept=".png, .jpg, .jpeg" name="riode_comment_medias_image_1" onChange={imageUpload} 
                                            style={{ padding: "40px", position: "absolute",  top: "0", left: "0" }} multiple="multiple"/>
                                    </i>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>


            <div className="form-checkbox mt-1 mb-1">
                <input type="checkbox" className="custom-checkbox" id="cancel-terms-condition" name="terms-condition" 
                    onChange={e => setRefundTermCondi(e.target.checked)} />
                <label className="form-control-label pl-5" htmlFor="cancel-terms-condition">
                    I have read and agree to the <a href="/page/return-terms-condition" target="_blank">Return terms and conditions </a>*
                </label>
            </div>

            <div className="d-flex justify-content-between mt-4 ">
                <button className="btn btn-outline btn-rounded mb-3 mr-4" onClick={() => closeReturnModal()}>Cancel</button>
                <button className={"btn btn-primary btn-md btn-rounded btn-icon-left mb-3 " + `${!refundTermConfi ? "cursur-wait" : ''}`} disabled={!refundTermConfi}
                    onClick={() => handelRefundRequest()}>Confirm</button>
            </div> 
        </section>
    )
}
