import React, { Fragment, useEffect, useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Modal from 'react-modal';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
// Language 
import useTranslation from "next-translate/useTranslation";

import { useMutation, useQuery } from '@apollo/client';
import { SENT_OTP, CHECK_OTP, REGISTER_CUSTOMER, LOGIN_CUSTOMER, USER_ALL_INFO, LOGOUT, GET_CUSTOMER_CART } from '../../../server/queries';
import Cookies from 'js-cookie';

import ALink from '../custom-link';
import { objectifyForm, resetSlideToSubmit } from "../../../utils/helpers";

import { authUserActions } from '../../../store/authUser';
import { wishlistActions } from '../../../store/wishlist';
import { cartActions } from '../../../store/cart';
import { modalActions } from "../../../store/modal";

import ForgetPassword from "./forget-password";

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: "flex"
    }
};

let index = 0;

Modal.setAppElement( "#__next" );

function LoginModal(props) {
    let {t} = useTranslation();

    const { setUserInfo, removeUserInfo, setWishList, userInfo, setUserOrder, removeUserOrder, loginModalOpen,
        closeLoginModal, openLoginModal, setUserNotifications, removeUserNotifications, addMultipleCarts } = props;

    const [ open, setOpen ] = useState( false );
    const [mobile, setMobile] = useState()
    const [otpSended, setOtpSended] = useState(false);
    const [otpChecked, setOtpChecked] = useState(false);
    const [registerError, setRegisterError] = useState({});
    const [loginError, setLoginError] = useState({});
    const [loginErrorText, setLoginErrorText] = useState();
    const [showForgetPassword, setShowForgetPassowrd] = useState(false);
    const [registerOtp, setRegisterOtp] = useState();
    const [termsConditionDisabled, setTermsConditionDisabled] = useState(false);
    const [cRegisterOtp, setCRegisterOtp] = useState(1);
    const [showResendButton, setShowResendOtpButton] = useState(false);

    const router = useRouter();

    const [ getOTP ] = useMutation( SENT_OTP, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                setRegisterError((prev) => ({
                    ...prev,
                    "mobile": [graphQLErrors[0].message]
                }))
            }
            resetSlideToSubmit();
            setCRegisterOtp(1);
        }
    });
    
    const [ getCheckOtp ] = useMutation( CHECK_OTP, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                setRegisterError((prev) => ({
                    ...prev,
                    "otp": [graphQLErrors[0].message]
                }))
            }
            resetSlideToSubmit();
        }
    });

    const [ getRegisterCustomer ] = useMutation( REGISTER_CUSTOMER, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                let validation = graphQLErrors[0]?.extensions?.validation || {};
                setRegisterError(validation);
            }
        }
    });

    const [ getLoginCustomer ] = useMutation( LOGIN_CUSTOMER, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            
            if (graphQLErrors?.length) {
                setLoginErrorText(graphQLErrors[0].message);
            }
            if (networkError) {
                setLoginErrorText('Something went wrong. Please try again later');
            }
        }
    });

    const { data, loading, error } = useQuery(USER_ALL_INFO, {variables: {
            first: 3,
            languageId: router.locale === 'en' ? 1 : 2,
            NotiFirst: 100,
            NotiPage: 1
        },
            onError: ({graphQLErrors, networkError, operation, forward}) => {
                Cookies.remove('b71_access_token');
                removeUserInfo();
                removeUserOrder(null);
                removeUserNotifications(null);
                addMultipleCarts([]);
                setWishList([]);
            },
            onCompleted(data) {
            }
        });

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
    });

    const cartInfo = useQuery(GET_CUSTOMER_CART, { fetchPolicy: 'network-only',
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                addMultipleCarts([]);
            }
        },
        onCompleted(data) {
            addMultipleCarts(data.getCustomercartItems?.cartItems || []);
        }
    });


    function closeModal() {
        document.querySelector( ".ReactModal__Overlay" ).classList.add( 'removed' );
        document.querySelector( ".login-popup.ReactModal__Content" ).classList.remove( "ReactModal__Content--after-open" );
        document.querySelector( ".login-popup-overlay.ReactModal__Overlay" ).classList.remove( "ReactModal__Overlay--after-open" );
        setTimeout( () => {
            // setOpen( false );
            closeLoginModal();
        }, 330 );
        Router.reload(window.location.pathname);
    }

    const resendOtp = async () => {
        setShowResendOtpButton(false);
        const res = await getOTP({ variables: {
            "mobile": mobile
        }});

        if (res?.data?.sendOTP) {
            setCRegisterOtp(cRegisterOtp + 1);
            setOtpSended(true);

            setTimeout(() => {
                setShowResendOtpButton(true);
            }, 30 * 1000);
        }
    }

    const generateOTP = async () => {
        let formData = $('#form1').serializeArray();
        let mobileNumber = formData[0].value;
        setMobile(mobileNumber);
        let regex = /^(?:\+88|01)?(?:\d{11}|\d{13})$/;

        if (mobileNumber.match(regex)) {
            const res = await getOTP({ variables: {
                    "mobile": formData[0].value
                }
            });
            if (res?.data?.sendOTP) {
                setCRegisterOtp(cRegisterOtp + 1);
                setOtpSended(true);

                setTimeout(() => {
                    setShowResendOtpButton(true);
                }, 30 * 1000)
            }
        } else {
            resetSlideToSubmit();
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

    const registerSubmit = async (e) => {
        e.preventDefault();

        let formArray = $('#form-register').serializeArray();
        let formData = objectifyForm(formArray);

        formData.mobile = mobile;

        try {
            const { data } = await getRegisterCustomer({
                variables: formData
            });

            if (data?.registerCustomer?.access_token){
                Cookies.set('b71_access_token', data?.registerCustomer?.access_token);
                closeModal();
            } 
        } catch (error) {
            console.log("error 3 =>", error);
        }
    }

    const loginSubmit = async (e) => {
        e.preventDefault();

        let formArray = $('#form-login').serializeArray();
        let formData = objectifyForm(formArray);

        try {
            const { data } = await getLoginCustomer({
                variables: formData
            });
  
            if (data?.login?.access_token) {
                console.log("data?.login?.access_token", data?.login?.access_token);
                Cookies.set('b71_access_token', data?.login?.access_token);
                closeModal();
            }
        } catch (error) {
            console.log("error 4 =>", error);
        }
    }

    const manageRegisterOtp = (e) => {
        let value = e.target.value;

        if (!!(value && value.length <= 6 && value.match(/^[0-9]+$/))) {
            setRegisterOtp(value);
        } else if (!value) {
            setRegisterOtp('');
        } else {
            setRegisterOtp(registerOtp || '');
        }
    }

    function openModal( e, loginIndex = 0 ) {
        e.preventDefault();
        index = loginIndex;
        // setOpen( true );
        openLoginModal();

        chackOTPScoroler();
    }

    const chackOTPScoroler = () => {
        setTimeout(() => {
            if (!showForgetPassword) {
                $('.slide-submit').slideToSubmit({
                    submitDelay: 1000,
                });
            }

            let point = 1;

            $("#form1").submit(function(e) {
                e.preventDefault();
                if (!showForgetPassword) {
                    if (cRegisterOtp == 1 ) {
                        point = 2;
                        setCRegisterOtp( cRegisterOtp + 1);
                        // generateOTP();
                    } 
                }
            });
        }, 500)
    }

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

    const changeLoginMobile = (e) => {
        let value = e.target.value;
        let regex = /^(?:\+88|01)?(?:\d{11}|\d{13})$/;

        if (value && !value.match(regex)) {
            setLoginError((prev) => ({
                ...prev,
                "mobile": ["Please enter a valid mobile number"]
            }))
        } else {
            setLoginError((prev) => ({
                ...prev,
                "mobile": ""
            }))
        }
    } 

    const logoutUser = () => {
        logout();
        // Cookies.remove('b71_access_token');
        // removeUserInfo();
        // removeUserOrder(null);
        // Router.reload("/");
    }

    const updateSetShowForgetPassowrd = (value) => {
        setShowForgetPassowrd(value);
    }

    useEffect(() => {
        if (data) {
            if (data?.getUserFromToken && !error) {
                setUserInfo(data?.getUserFromToken);
                setWishList(data?.wishlist?.wishlistItems || []);
                setUserOrder(data?.getCustomerOrder);
                setUserNotifications(data?.customerNotifications?.notification);
            } else {
                Cookies.remove('b71_access_token');
                removeUserInfo(null);
                setWishList([]);
                setUserOrder(null);
                setUserNotifications(null);
            }
        }
    }, [data, error])

    useEffect(() => {
        if (cRegisterOtp === 2 ) generateOTP();
    }, [cRegisterOtp])

    return (
        <>
            { //d-lg-show
                userInfo?.customer?.name ? <div className="dropdown"><ALink href="#">
                    <span className="mr-1"><img src="../images/profile.svg"></img></span> 
                    {userInfo.customer.name}</ALink>
                    <ul className="dropdown-box w-150 border-rounded">
                        <li>
                            <ALink href='/my-account'><i className="d-icon-user mr-2"> </i> Dashboard</ALink>
                        </li>
                        <li>
                            <ALink href='/my-account/?content=order-history'><i className="d-icon-bag mr-2"> </i> My Orders</ALink>
                        </li>
                        <li onClick={() => logoutUser()} className="cursor-pointer">
                            <a> <i className="d-icon-lock mr-2"> </i> Logout</a>
                        </li>
                    </ul>
                    </div> : <>
                    <a className="login-link" href="#" onClick={ openModal }>
                    <i className="d-icon-user mr-1"></i>{t('common:login')}</a>
                    <span className="delimiter">/</span>
                    <a className="register-link ml-0" onClick={ ( e ) => openModal( e, 1 ) } href="#">{t('common:register')}</a>
                </>
            }

            {
                loginModalOpen ?
                    <Modal
                        isOpen={ loginModalOpen }
                        onRequestClose={ closeModal }
                        style={ customStyles }
                        contentLabel="Login Modal"
                        className="login-popup"
                        overlayClassName="login-popup-overlay"
                        shouldReturnFocusAfterClose={ false }
                        id="login-modal"
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="form-box">
                            <div className="tab tab-nav-simple tab-nav-boxed form-tab">
                                {
                                    showForgetPassword ? <Fragment>
                                        <Tabs selectedTabClassName="active" selectedTabPanelClassName="active" defaultIndex={ index }>
                                            <TabList className="nav nav-tabs nav-fill align-items-center border-no justify-content-center mb-5">
                                                <Tab className="nav-item">
                                                    <span className="nav-link border-no lh-1 ls-normal">Forget Password</span>
                                                </Tab>
                                            </TabList>

                                            <div className="tab-content">
                                                <TabPanel className="tab-pane">
                                                    <ForgetPassword showForgetPassword={showForgetPassword}
                                                     updateSetShowForgetPassowrd={updateSetShowForgetPassowrd}/>
                                                </TabPanel>
                                            </div>
                                        </Tabs>
                                    </Fragment> : <Fragment>
                                        <Tabs selectedTabClassName="active" selectedTabPanelClassName="active" defaultIndex={ index }>
                                            <TabList className="nav nav-tabs nav-fill align-items-center border-no justify-content-center mb-5">
                                                <Tab className="nav-item">
                                                    <span className="nav-link border-no lh-1 ls-normal">{t('common:login')}</span>
                                                </Tab>
                                                <li className="delimiter">or</li>
                                                <Tab className="nav-item" onClick={chackOTPScoroler}>
                                                    <span className="nav-link border-no lh-1 ls-normal">{t('common:register')}</span>
                                                </Tab>
                                            </TabList>

                                            <div className="tab-content">
                                                <TabPanel className="tab-pane">
                                                    <form action="#" id="form-login" onSubmit={loginSubmit}>
                                                        <div className="form-group mb-3">
                                                            <input type="text" className="form-control" id="singin-number" autoComplete="off"
                                                                onChange={(e) => {setLoginError({}), setLoginErrorText();  changeLoginMobile(e)}}
                                                                name="mobile" placeholder="Enter Mobile Number*" required />
                                                            {
                                                                loginError?.mobile ? <small className={`valid-feedback error-valid`}>
                                                                    {loginError.mobile[0]}
                                                                </small> : ''
                                                            }
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="password" className="form-control"  autoComplete="new-password"
                                                                id="singin-password" onChange={() => {setLoginError({}), setLoginErrorText()}}
                                                                placeholder="Password *" name="password" required />
                                                            {
                                                                loginError?.password ? <small className={`valid-feedback error-valid`}>
                                                                    {loginError?.password[0]}
                                                                </small> : ''
                                                            }
                                                        </div>
                                                        {
                                                            loginErrorText ? <small className="valid-feedback error-valid text-center">
                                                                {loginErrorText}</small> : ''
                                                        }
                                                        <button className="btn btn-secondary btn-block btn-rounded" type="submit">Login</button>
                                                        <div className="form-footer justify-content-center mt-2">
                                                            {/* <div className="form-checkbox">
                                                                <input type="checkbox" className="custom-checkbox" id="signin-remember" name="signin-remember" />
                                                                <label className="form-control-label" htmlFor="signin-remember">Remember me</label>
                                                            </div> */}
                                                            <ALink href="#" className="lost-link font-14" 
                                                            onClick={() => setShowForgetPassowrd(true) }>Forget password</ALink>
                                                        </div>
                                                    </form>
                                                    {/* <div className="form-choice text-center">
                                                        <label className="ls-m">or Login With</label>
                                                        <div className="social-links">
                                                            <ALink href="#" className="social-link social-google fab fa-google border-no"></ALink>
                                                            <ALink href="#" className="social-link social-facebook fab fa-facebook-f border-no"></ALink>
                                                            <ALink href="#" className="social-link social-twitter fab fa-twitter border-no"></ALink>
                                                        </div>
                                                    </div> */}
                                                </TabPanel>

                                                <TabPanel className="tab-pane">
                                                    <form action="#" id="form1">
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
                                                                    type="submit">Register
                                                                </button>
                                                            </> : null
                                                        }
                                                    </form>
                                                
                                                    {
                                                        otpSended && !otpChecked ? <Fragment>
                                                            <form action="#" id="form-check-otp" onSubmit={otpCheckSubmit}>
                                                                <div className="form-group otp-form-group">
                                                                    <input type="text" className="form-control" value={registerOtp} 
                                                                        id="register-otp" onChange={(e) => manageRegisterOtp(e)}
                                                                        name="otp" placeholder="Enter OTP *" required />

                                                                        {
                                                                            showResendButton ? <span className="otp-resend-button"
                                                                            onClick={resendOtp}>Resend</span> : ''
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
                                                            </form>
                                                        </Fragment> : null
                                                    }

                                                    <form action="#" id="form-register" onSubmit={registerSubmit} className={!otpChecked ? 'd-none' : ''}>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" id="register-name" autoComplete="off"
                                                                name="name" placeholder="Enter Full Name *" required />
                                                            {
                                                                registerError?.name ? <small className={`valid-feedback error-valid`}>
                                                                    {registerError.name[0]}
                                                                </small> : ''
                                                            }
                                                        </div>

                                                        <div className="form-group">
                                                            <input type="email" className="form-control" id="register-email" autoComplete="off"
                                                                name="email" placeholder="Enter Email"/>
                                                            {
                                                                registerError?.email ? <small className={`valid-feedback error-valid`}>
                                                                    {registerError.email[0]}
                                                                </small> : ''
                                                            }
                                                        </div>

                                                        <div className="form-group">
                                                            <input type="password" className="form-control" id="register-password" autoComplete="new-password"
                                                            name="password" placeholder="Password *" required />
                                                            {
                                                                registerError?.password ? <small className={`valid-feedback error-valid`}>
                                                                    {registerError.password[0]}
                                                                </small> : ''
                                                            }
                                                        </div>

                                                        <div className="form-footer">
                                                            <div className="form-checkbox">
                                                                <input type="checkbox" className="custom-checkbox" id="register-agree" name="register-agree"
                                                                    onClick={(e) => { setTermsConditionDisabled(e.target.checked) }}
                                                                    required />
                                                                <label className="form-control-label" htmlFor="register-agree">
                                                                    I agree to the <a href="/page/privacy-policy/" target="_blank">privacy policy</a></label>
                                                            </div>
                                                        </div>
                                                        <button className={`btn btn-secondary btn-block btn-rounded ${!termsConditionDisabled ? 'cursur-wait' : ''}`}
                                                             disabled={!termsConditionDisabled}
                                                            type="submit">Register
                                                        </button>
                                                    </form>
                                                    
                                                    {/* <div className="form-choice text-center">
                                                        <label className="ls-m">or Register With</label>
                                                        <div className="social-links">
                                                            <ALink href="#" className="social-link social-google fab fa-google border-no"></ALink>
                                                            <ALink href="#" className="social-link social-facebook fab fa-facebook-f border-no"></ALink>
                                                        </div>
                                                    </div> */}
                                                </TabPanel>
                                            </div>
                                        </Tabs>
                                    </Fragment>
                                }
                            </div>
                        </div>

                        <button title="Close (Esc)" type="button" className="mfp-close" onClick={ closeModal }><span>×</span></button>
                    </Modal> : ''
            }
        </>
    )
}

function mapStateToProps( state ) {
    return {
        userInfo: state.user.userInfo,
        loginModalOpen: state.modal.loginModalOpen
    }
}

export default connect( mapStateToProps, { setUserInfo: authUserActions.setUserInfo, removeUserInfo: authUserActions.removeUserInfo,
    setWishList: wishlistActions.setWishList, setUserOrder: authUserActions.setUserOrder, removeUserOrder: authUserActions.removeUserOrder, 
    openLoginModal: modalActions.openLoginModal, closeLoginModal: modalActions.closeLoginModal, 
    setUserNotifications: authUserActions.setUserNotifications, removeUserNotifications: authUserActions.removeUserNotifications,
    addMultipleCarts: cartActions.addMultipleCarts } )( LoginModal );