import { Fragment, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { SEND_OTP_FORGET_PASS, CHECK_OTP, FORGET_PASSWORD } from '../../../server/queries';

import { toast } from 'react-toastify';
import { objectifyForm, resetSlideToSubmit } from "../../../utils/helpers";

export default function ForgetPassword(props) {
    const {showForgetPassword, updateSetShowForgetPassowrd} = props;

    const [mobile, setMobile] = useState();
    const [registerError, setRegisterError] = useState({});
    const [otpSended, setOtpSended] = useState(false);
    const [otpChecked, setOtpChecked] = useState(false);
    const [forgetOTP, setForgetOTP] = useState();
    const [otpPoint, setOtpPoint] = useState(1);
    const [showResendButton, setShowResendOtpButton] = useState(false);

    const [ getOTP ] = useMutation( SEND_OTP_FORGET_PASS, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                setRegisterError((prev) => ({
                    ...prev,
                    "mobile": [graphQLErrors[0].message]
                }))
            }
            setOtpPoint(1);
            resetSlideToSubmit();
        }
    } );

    const [ getCheckOtp ] = useMutation( CHECK_OTP , {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("[graphQLErrors[0].message", graphQLErrors[0].message);
                setRegisterError((prev) => ({
                    ...prev,
                    "otp": [graphQLErrors[0].message]
                }))
            }
        }
    });
    const [getForgetPassowrdSubmit] = useMutation(FORGET_PASSWORD);

    const changeMobile = (e) => {
        let value = e.target.value;
        let regex = /^(?:\+88|01)?(?:\d{11}|\d{13})$/;
        
        setMobile(value);

        if (value && !value.match(regex)) {
            setRegisterError((prev) => ({
                ...prev,
                "mobile": ["Please enter a valid mobile number"]
            }))
        } else {
            setRegisterError((prev) => ({
                ...prev,
                "mobile": ""
            }))
        }
    }

    const manageRegisterOtp = (e) => {
        let value = e.target.value;

        if (!!(value && value.length <= 6 && value.match(/^[0-9]+$/))) {
            setForgetOTP(value);
        } else if (!value) {
            setForgetOTP('');
        } else {
            setForgetOTP(forgetOTP || '');
        }
    }

    const forgetPasswordSubmit = async (e) => {
        e.preventDefault();

        let formArray = $('#form-forget-password').serializeArray();
        let formData = objectifyForm(formArray);

        formData.mobile = mobile;

        try {
            const { data } = await getForgetPassowrdSubmit({
                variables: formData
            });

            if (data?.forgetPassword?.user?.id){
                updateSetShowForgetPassowrd(false);
                toast.success( <div className="m-5">  {data?.forgetPassword?.message}  </div> );
            } 
        } catch (error) {
            console.log("error 3 =>", error);
        }
    }

    const generateOTP = async () => {
        let formData = $('#forgetpassword-otp-form').serializeArray();
        let mobileNumber = formData[0]?.value;
        setMobile(mobileNumber);
        let regex = /^(?:\+88|01)?(?:\d{11}|\d{13})$/;

        if (mobileNumber.match(regex)) {
            const res = await getOTP({ variables: { "mobile": formData[0].value } });

            if (res?.data?.sendOTPForgetPass) {
                setOtpSended(true);

                setTimeout(() => {
                    setShowResendOtpButton(true);
                }, 30 * 1000)
            } else resetSlideToSubmit();
        } else {
            resetSlideToSubmit();
        }
    }

    const resendOtp = async () => {
        setShowResendOtpButton(false);
        const res = await getOTP({ variables: { "mobile": mobile } });

        if (res?.data?.sendOTPForgetPass) {
            setOtpSended(true);

            setTimeout(() => {
                setShowResendOtpButton(true);
            }, 30 * 1000);

        }
    }

    const otpCheckSubmit = async (event) => {
        event.preventDefault();
        let formData = $('#form-check-otp').serializeArray();

        const res = await getCheckOtp({
            variables: {
                otp: formData[0].value,
                mobile: mobile
            }
        });
        if ( res?.data?.checkOtp) {
            setOtpChecked(true);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if (showForgetPassword) {
                $('.slide-submit').slideToSubmit({
                    submitDelay: 1000,
                })
            }
        }, 500);

        $("#forgetpassword-otp-form").submit(function(e) {
            e.preventDefault();

            if (showForgetPassword) {
                if (otpPoint === 1) {
                    setOtpPoint(2);
                }
            } 
        });
    }, [])

    useEffect(() => {
        if (otpPoint === 2) generateOTP();
    }, [otpPoint])

    return (
        <Fragment>
            <form action="#" id="forgetpassword-otp-form">
                <div className="form-group">
                    <input type="text" className="form-control" value={mobile}
                    onChange={changeMobile} id="register-mobile-number" disabled={ otpSended }
                        name="mobile" placeholder="Enter Mobile Number *" required />
                        {
                            registerError?.mobile ? <small className={`valid-feedback error-valid`}>
                                {registerError.mobile[0]}
                            </small> : ''
                        }
                </div>

                {
                    !otpSended ? <>
                        <div className="form-group slide-submit">
                            <div className="slide-submit-text">Slide to get SMS Code</div>
                            <div className="slide-submit-thumb">»</div>
                        </div>
                        <button className="btn btn-dark btn-block btn-rounded d-none" id="js-otp-button"
                            type="submit"> </button>
                    </> : null
                }
            </form>

            {
                otpSended && !otpChecked ? <form action="#" id="form-check-otp" onSubmit={otpCheckSubmit}>
                        <div className="form-group otp-form-group">
                            <input type="text" className="form-control" id="forget-otp" value={forgetOTP} 
                                onChange={manageRegisterOtp} name="otp" placeholder="Enter OTP *" required />

                                {
                                    showResendButton ? <span className="otp-resend-button" onClick={resendOtp}>
                                        Resend</span> : ''
                                }                                
                            {
                                registerError?.otp ? <small className={`valid-feedback error-valid`}>
                                    {registerError.otp[0]}
                                </small> : ''
                            }
                        </div>

                        <button className="btn btn-secondary btn-block btn-rounded"
                            type="submit">Verify OTP
                        </button>
                    </form> : null
            }

            <form action="#" id="form-forget-password" onSubmit={forgetPasswordSubmit} className={!otpChecked ? 'd-none' : ''}>
                <div className="form-group">
                    <input type="password" className="form-control" id="register-password"
                    name="password" placeholder="Password *" required />
                    {
                        registerError?.password ? <small className={`valid-feedback error-valid`}>
                            {registerError.password[0]}
                        </small> : ''
                    }
                </div>

                <button className="btn btn-secondary btn-block btn-rounded"
                    type="submit">Update Password
                </button>
            </form>


        </Fragment>
    )
}
