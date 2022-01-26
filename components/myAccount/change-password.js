import { useState } from "react";
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
// import Cookies from 'js-cookie';
import Router from 'next/router';
import { connect } from 'react-redux';

import {objectifyForm} from "../../utils/helpers";
import { CHANGE_PASSWORD, LOGOUT } from '../../server/queries';
import { authUserActions } from '../../store/authUser';


function ChangePassword({ removeUserInfo, removeUserOrder }) {
    const [showCP, setShowCP] = useState(false);
    const [showNP, setShowNP] = useState(false);
    const [showCfP, setShowCfP] = useState(false);
    const [errorContent, setErrorContent] = useState();
    const [passwords, setPasswords] = useState();


    const [ customerPasswordChange ] = useMutation( CHANGE_PASSWORD, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                setErrorContent((prev) => ({
                    ...prev,
                    "server_error": "Something went wrong, Please try again later."
                }))
            }
        }
    } );

    const [logout] = useMutation( LOGOUT, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {

            }
        },
        onCompleted(data) {
            Cookies.remove('b71_access_token');
            removeUserInfo();
            removeUserOrder(null);
            Router.reload("/");
        }
    })

    const changePassowrd = async (e) => {
        e.preventDefault();

        let formArray = $('#js-change-password').serializeArray();
        let formData = objectifyForm(formArray);

        if (!passwords?.currentPassword) {
            setErrorContent((prev) => ({
                ...prev,
                "currentPassword": "Please enter a password."
            }))
        }

        if (passwords?.password && passwords?.confirmPassword && passwords?.password !== passwords?.confirmPassword) {
            setErrorContent((prev) => ({
                ...prev,
                "password": "Password not match."
            }));
            setErrorContent((prev) => ({
                ...prev,
                "confirmPassword": "Confirm password not match."
            }))
        }

        const res = await customerPasswordChange({
            variables: passwords
        });

        if (res?.data?.updateCustomer?.user) {
            toast.success( <div className="m-5">&nbsp; &nbsp; {res.data.updateCustomer.message} &nbsp; &nbsp;</div> );
            logout();
        } else {
            toast.error( <div className="m-5">&nbsp; &nbsp; {res?.data?.updateCustomer?.message} &nbsp; &nbsp;</div> );
        }
    }

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">Change Password</h3>
            <hr/>
            <form action="#" id="js-change-password" onSubmit={changePassowrd}>
                <div className="row">
                    <div className="col-xs-8 password-custom">
                        <label>Current Password (Leave blank to leave unchanged)</label>
                        <input type={showCP ? "text" : "password"} onChange={(e) => { setErrorContent(null);
                            setPasswords((prev) => ({
                                ...prev,
                                "currentPassword": e.target.value
                            }))
                        }}
                            className="form-control" name="currentPassword" required />
                        
                        {
                            errorContent?.currentPassword ? <small className={`valid-feedback error-valid error-show`}>
                                {errorContent.currentPassword} </small> : ''
                        }
                        
                        <div className="input-group-addon cursor-pointer" onClick={() => setShowCP(!showCP)}>
                            {
                                showCP ? <i className="fa fa-eye" aria-hidden="true"></i> 
                                : <i className="fa fa-eye-slash" aria-hidden="true"></i>
                            }
                        </div>
                    </div>

                    <div className="col-xs-8 password-custom">
                        <label>New Password (Leave blank to leave unchanged)</label>
                        <input type={showNP ? "text" : "password"} onChange={(e) => {
                            setPasswords((prev) => ({
                                ...prev,
                                "password": e.target.value
                            })); setErrorContent(null)
                        }}
                            className="form-control" name="password" required />
                        {
                            errorContent?.password ? <small className={`valid-feedback error-valid error-show`}>
                                {errorContent.password} </small> : ''
                        }
                        <div className="input-group-addon cursor-pointer" onClick={() => setShowNP(!showNP)}>
                            {
                                showNP ? <i className="fa fa-eye" aria-hidden="true"></i> 
                                : <i className="fa fa-eye-slash" aria-hidden="true"></i>
                            }
                        </div>
                    </div>

                    <div className="col-xs-8 password-custom">
                        <label>Confirm Password</label>
                        <input type={showCfP ? "text" : "password"} onChange={(e) => {
                            setPasswords((prev) => ({
                                ...prev,
                                "confirmPassword": e.target.value
                            }));  setErrorContent(null)
                        }}
                            className="form-control" name="confirmPassword" required />
                        {
                            errorContent?.confirmPassword ? <small className={`valid-feedback error-valid error-show`}>
                                {errorContent.confirmPassword} </small> : ''
                        }
                        <div className="input-group-addon cursor-pointer" onClick={() => setShowCfP(!showCfP)}>
                            {
                                showCfP ? <i className="fa fa-eye" aria-hidden="true"></i> 
                                : <i className="fa fa-eye-slash" aria-hidden="true"></i>
                            }
                        </div>
                    </div>
                </div>
                {
                    errorContent?.server_error ? <small className={`valid-feedback error-valid `}>
                        {errorContent.server_error}</small> : ''
                }

                <button className="btn btn-rounded btn-md btn-secondary" type="submit">Save Changes</button>
            </form>
        </div>
    )
}

export default connect( '', { removeUserInfo: authUserActions.removeUserInfo, 
        removeUserOrder: authUserActions.removeUserOrder, 
    })( ChangePassword );
