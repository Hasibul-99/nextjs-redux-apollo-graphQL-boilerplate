import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { USER_ADDRESS, UPADTE_DEFAULT_ADDRESS, GET_LOGIN_USER_INFO } from '../../server/queries';
import ALink from '../../components/features/custom-link';

import { authUserActions } from '../../store/authUser';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
    
function Ticket() {

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">Open Support Ticket</h3>
            <hr className="mb-4"></hr>
            <div className="row">
                <div className="col-sm-6">
                    <label>Support Type</label>
                    <select name="country" className="form-control">
                    <option value="fe" selected="">Return</option>
                    <option value="ma"> Refund </option>
                    <option value="other">Other</option>
                    </select>
                </div>
                <div className="col-sm-6">
                    <label>Order No. * </label>
                    <input className="form-control" type="text" placeholder="Order No. *" required="" />
                </div>
                <div className="col-sm-12">
                    <label>Reason * </label>
                    <textarea rows="3" className="form-control" required="" placeholder="Write your Issue*"></textarea>
                </div>
                <div className="col-sm-12">
                    <label for="files">Upload Image: </label>
                    <div className="upload__box mb-4">
                        <div className="upload__btn-box">
                            <label className="upload__btn d-block">
                            <p className="mb-0">
                                <i className="d-icon-plus"></i> Select Multiple Images
                            </p>
                            <input type="file" multiple="" data-max_length="20" className="upload__inputfile" />
                            </label>
                        </div>
                        <div className="upload__img-wrap"></div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <button type="submit" className="btn btn-secondary btn-rounded">Send</button>
                </div>
            </div>
        </div>
    )
}


export default Ticket;
