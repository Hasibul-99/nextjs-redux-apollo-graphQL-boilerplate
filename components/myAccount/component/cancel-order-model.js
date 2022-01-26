import {useState } from 'react';
import { useRouter } from 'next/router';

import { ORDER_CANCEL_BY_CUSTOMER } from '../../../server/queries';
import { useMutation } from '@apollo/client';

import { toast } from 'react-toastify';

export default function CancelOrderModel(props) {
    const router = useRouter();
    const query = router.query;

    const { closeModal, reasons, generateOrderInfo, selectOrder } = props;
    const [cancelTermCon, setCanceltermCon] = useState(false);
    const [selectedCancelReason, setSelectedCancelreson] = useState();

    const [ cancelOrderByCustomer ] = useMutation( ORDER_CANCEL_BY_CUSTOMER, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                toast.error(graphQLErrors[0].message);
            }
        },
        onCompleted() {
            closeModal();
            generateOrderInfo();
            toast.success("Order Canceled Successfully");
        }
    });

    
    const cancelOrder = () => {
        if (cancelTermCon) {
            let bodyOrder = {
                "message": $('#js-cancelMeaasge').val() + '.' + selectedCancelReason,
                "orderId": parseInt(query.orderId),
                "packageId": JSON.stringify([{ id: selectOrder?.packageDetails?.id }])
            }

            cancelOrderByCustomer({ variables: bodyOrder });
        }
    }

    
    return (
        <section className="error-section d-flex flex-column justify-content-center align-items-center text-center">
            <div className="remove-btn-modal-custom" onClick={() => closeModal()}>
                <i className="fas fa-times"></i>
            </div>
                <h4 className="mt-7 mb-0 ls-m">Cancel Ordered Product?</h4>
                <p className="text-grey font-primary ls-m mb-1">Are you sure want to cancel this ordered product?</p>
            <hr/>
            <div className="form-group">
                <label htmlFor="js-cancelreaons" className='text-left'>Select Reason of Cancellation *</label>
                <select className="form-control" onChange={e => setSelectedCancelreson(e.target.value)}>
                    <option>Select a reason *</option>
                    {
                        reasons?.length ? reasons.map(res => <option key={res.reason} value={res.reason}>{res.reason}</option>) : ''
                    }
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="js-cancelMeaasge" className='text-left'>Write Detail Reason (Optional) </label>
                <textarea className="form-control" id="js-cancelMeaasge" 
                    placeholder="Write Detail Reason (Optional)" rows="3">
                </textarea>
            </div> 

            <div className="form-checkbox mt-1 mb-1">
                <input type="checkbox" className="custom-checkbox" id="cancel-terms-condition" name="terms-condition" 
                    onChange={e => setCanceltermCon(e.target.checked)}/>
                <label className="form-control-label pl-5" htmlFor="cancel-terms-condition">
                    I have read and agree to the <a href="/page/cancel-terms-condition" target="_blank">Cancel terms and conditions </a>*
                </label>
            </div>

            <div className="d-flex justify-content-between mt-2">
                <button className="btn btn-outline btn-md btn-rounded mb-3 mr-4" onClick={() => closeModal()}>Cancel</button>
                <button className={"btn btn-primary btn-md btn-rounded btn-icon-left mb-3 " + `${!cancelTermCon ? "cursur-wait" : ''}`} disabled={!cancelTermCon}
                    onClick={() => cancelOrder()}>Confirm</button>
            </div> 
        </section>
    )
}
