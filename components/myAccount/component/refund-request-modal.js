import React, { Fragment, useState } from 'react'

import { toast } from 'react-toastify';
import { CREATE_REFUND_REQUEST } from '../../../server/queries';
import { useMutation } from '@apollo/client';

export default function RefundRequestModal({closeRefundModal, generateOrderInfo, selectOrder}) {
    const [refundType, setRefundType] = useState();
    const [refTermCondition, setRefTermCondition] = useState();
    const [fieldsValues, setFieldsValues] = useState();

    const [ refundRequestByCustomer ] = useMutation( CREATE_REFUND_REQUEST, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                toast.error(graphQLErrors[0].message);
            }
        },
        onCompleted() {
            closeRefundModal();
            generateOrderInfo();
            toast.success("Refund Request Submitted Successfully");
        }
    });

    const confirmRefund = () => {
        if (refundType) {
            let data = {
                medium: refundType === 'bank' ? 'bank' : "mfs",
                packageId: selectOrder?.packageDetails?.id
            };
    
            if (fieldsValues.account_name) data.accountName = fieldsValues.account_name;
            if (fieldsValues.account_number) data.accountNumber = fieldsValues.account_number;
            if (fieldsValues.bank_name) data.bankName = fieldsValues.bank_name;
            if (fieldsValues.branch_name) data.branchName = fieldsValues.branch_name;
            if (fieldsValues.mfs_number) data.mfsNumber = fieldsValues.mfs_number;

            refundRequestByCustomer({
                variables: data
            })
        }
    }

    return (
        <section className="error-section d-flex flex-column justify-content-center align-items-center text-center">
            <div className="remove-btn-modal-custom" onClick={() => closeRefundModal()}>
                <i className="fas fa-times"></i>
            </div>
                <h4 className="mt-7 mb-0 ls-m">Want to Refund?</h4>
            <hr/>
            <div className="form-group">
                <label htmlFor="js-cancelreaons" className='text-left'>Select Preferrable Payment Method *</label>
                <select className="form-control" onChange={e => setRefundType(e.target.value)}>
                    <option>Select Type *</option>
                    <option value="bank">Bank</option>
                    <option value="bkash">bkash</option>
                    <option value="nagad">Nagad</option>
                </select>
            </div>
            {
                refundType ? <Fragment>
                    {
                        refundType === 'bank' ? <Fragment>
                            <div className="form-group">
                                <label htmlFor="exampleInputName" className='text-left'>Account Name</label>
                                <input type="text" className="form-control" id="exampleInputName" name="account_name" value={fieldsValues?.account_name || ''}
                                    onChange={e => {
                                        setFieldsValues((prev) => ({
                                            ...prev,
                                            "account_name": e.target.value
                                        }))
                                    }} placeholder="Enter Account Name" required/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleInputNumber" className='text-left'>Account Number</label>
                                <input type="text" className="form-control" id="exampleInputNumber" 
                                    onChange={e => {
                                        setFieldsValues((prev) => ({
                                            ...prev,
                                            "account_number": e.target.value
                                        }))
                                    }} name="account_number" placeholder="Enter Account Number" required/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleInputBankName" className='text-left'>Bank Name</label>
                                <input type="text" className="form-control" id="exampleInputBankName" name="bank_name" 
                                    onChange={e => {
                                        setFieldsValues((prev) => ({
                                            ...prev,
                                            "bank_name": e.target.value
                                        }))
                                    }} placeholder="Enter Bank Name" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleInputBranchName" className='text-left'>Branch Name</label>
                                <input type="text" className="form-control" id="exampleInputBranchName" name="branch_name" 
                                    onChange={e => {
                                        setFieldsValues((prev) => ({
                                            ...prev,
                                            "branch_name": e.target.value
                                        }))
                                    }} placeholder="Enter Branch Name" />
                            </div>
                        </Fragment> : <Fragment>
                            <div className="form-group">
                                <label htmlFor="exampleInputmfsNumber" className='text-left'>Mobile Number</label>
                                <input type="text" className="form-control" id="exampleInputmfsNumber" name="mfs_number" value={fieldsValues?.mfs_number || ''}
                                    onChange={e => {
                                        setFieldsValues((prev) => ({
                                            ...prev,
                                            "mfs_number": e.target.value
                                        }))
                                    }} placeholder="Enter Mobile Number" />
                            </div>
                        </Fragment>
                    }
                </Fragment> : ''
            }
            <div className="form-checkbox mt-1 mb-1">
                <input type="checkbox" className="custom-checkbox" id="cancel-terms-condition" name="terms-condition" 
                    onChange={e => setRefTermCondition(e.target.checked)}/>
                <label className="form-control-label pl-5" htmlFor="cancel-terms-condition">
                    I have read and agree to the 
                    <a href="/page/refund-terms-condition" target="_blank"> Refund terms and conditions </a>*
                </label>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline btn-md btn-rounded mb-3 mr-4" onClick={() => closeRefundModal()}>Cancel</button>
                <button className={"btn btn-primary btn-md btn-rounded btn-icon-left mb-3 " + `${!refTermCondition ? "cursur-wait" : ''}`} disabled={!refTermCondition}
                    onClick={() => confirmRefund()}>Confirm</button>
            </div> 
        </section>
    )
}
