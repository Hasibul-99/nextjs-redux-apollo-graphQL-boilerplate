import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { REVIEW_ORDERED_PRODUCT } from '../../server/queries';
import ALink from '../../components/features/custom-link';

import { useRouter } from 'next/router';
import { authUserActions } from '../../store/authUser';
import { connect } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';
// import Resizer from "react-image-file-resizer";
import { FILE_UPLOAD } from  "../../scripts/api.js";
import { postData } from "../../scripts/api-service.js";
    
function ReviewAdd() {
    const router = useRouter();
    const query = router.query;

    const [reviewStart, setReviewStart] = useState(0);
    const [images, setImages] = useState([]);
    const [commet, setComment] = useState('');
    const {productId, pr_n, orderId, orderItemId, shop_name} = query;

    const [addCustomerReview] = useMutation(REVIEW_ORDERED_PRODUCT, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        },
        onCompleted(data) {
            toast.success('Review Added Successfully!');
            router.push("/my-account/?content=reviews&show=1");
            setComment('')
        }
    });

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

    const removeImage = (imageId) => {
        let newImage = images.filter(img => img.id !== imageId);
        setImages(newImage);
    }

    const submitReview = async () => {
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
                addUserReview(images);
            }
        } else {
            addUserReview();
        }
    }

    const addUserReview = (images) => {
        addCustomerReview({
            variables: {
                "productId": parseInt(productId),
                "customerComment": commet || '',
                "orderId": parseInt(orderId),
                "orderItemId": parseInt(orderItemId),
                "rating": reviewStart,
                "reviewImages": images ? JSON.stringify(images) : ''
            }
        });
    }

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">Write a Review</h3>
            <hr className="mb-4"></hr>
            <div className="row mb-4"> 
                <div className="col-md-12"> 
                    <div className="summary mb-3">
                        
                        <div className="d-flex align-items-center justify-content-between border-bottom mb-2 pb-2">
                            <div className="d-flex align-items-center"> 
                                {/* <img src="./images/products/product1.jpg" width="40" className="product-thumbnail border-rounded mr-3" />
                                 */}
                                <h6 className="m-0 font-weight-medium"> 
                                    {pr_n}
                                </h6>
                            </div>

                            <div>
                                <p className="mb-0 font-13"> Sold By: <a href="#."> {shop_name || 'N/A'}  </a> </p>  
                            </div>    
                        </div> 

                        <div className="review-form-wrapper">
                            <div className="title-wrapper text-left">
                                <p className="mb-0">Your mobile number will not be published. Required fields are marked * </p>
                            </div> 
                            <div className="ratings-container mt-2 mb-2">
                                <div className="rating-start">
                                    <div className="star-rating">
                                        {[1,2,3,4,5].map((n, i) =>
                                            <div key={'start-key-' + n} className={ reviewStart >= n ? "star selected" : "star"} 
                                            onClick={() => { setReviewStart(n) }}></div>
                                        )}
                                    </div>
                                </div>
                            </div> 
                            <div className="review-form-section">  
                                <form action="#">
                                    <textarea id="js-reply-message" cols="30" rows="6" className="form-control mb-4" 
                                        onChange={(e) => {setComment(e.target.value)} }
                                        placeholder="Please share your feedback about the product: Was the product as described? What is the quality like? *"
                                    ></textarea>

                                    <div className="review-medias" style={{ justifyContent: "left" }}>
                                        {
                                            images.map(image => <div className="file-input form-control image-input mb-2" 
                                                style={{backgroundImage: `url(${image.base64})`}} key={image.id}>
                                                <div className="file-input-wrapper">
                                                </div>
                                                <label className="btn-action btn-remove" title="Remove Image" onClick={() => {removeImage(image.id)}}>
                                                </label>
                                            </div>)
                                        }
                                        

                                        <div className="file-input form-control image-input img-input2 mb-2"> 
                                            <div className="file-input-wrapper review-upload-image">
                                                <i className="d-icon-camera2">
                                                    <input type="file" accept=".png, .jpg, .jpeg" className="file-upload"
                                                        name="riode_comment_medias_image_1" multiple="multiple"
                                                        onChange={imageUpload}/>
                                                </i>
                                                {/* <p className="mb-0"> 1/6 </p> */}
                                            </div> 
                                        </div>  
                                    </div> 

                                    <p className="font-weight-normal mb-2">Upload images.</p>
                                    {/* Maximum count: 3, size: 2MB */}
                                    <button type="button" className="btn btn-secondary btn-rounded mt-4" onClick={submitReview}>
                                        Submit<i className="d-icon-arrow-right"></i>
                                    </button>
                                </form>
                            </div> 
                            
                        </div> 
                    </div> 
                    
                </div> 
            </div>
        </div>
    )
}


export default ReviewAdd;


// [{
//     image_path: 484897
// },
// {

// }]

