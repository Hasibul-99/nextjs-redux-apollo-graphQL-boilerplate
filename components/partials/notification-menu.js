import { useState } from 'react';
import { connect } from 'react-redux';
import moment from "moment";

import { authUserActions } from '../../store/authUser';
import ALink from '../features/custom-link';
import { useQuery, useMutation } from '@apollo/client';
import { UNREAD_NOTIFICATION_COUNT, MARK_ALL_NOTIFICETION_READ, 
    MARK_NOTIFICATION_READ, DELETE_ALL_NOTIFICATION } from '../../server/queries';

function NotificationMenu( props ) {
    const { notifications, removeUserNotifications } = props;
    const [unreadNotificationCount, setUnReadNotificationCount] = useState(0);

    const countNoti = useQuery( UNREAD_NOTIFICATION_COUNT, {
        fetchPolicy: 'network-only',
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        },
        onCompleted(data) {
            setUnReadNotificationCount(data?.customerNotifications?.unreadNotificationCount);
        }
     });

    const [readAllNotifications] = useMutation(MARK_ALL_NOTIFICETION_READ, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        },
        onCompleted(data) {
            console.log("data", data);
        }
    });

    const [readNotification] = useMutation(MARK_NOTIFICATION_READ, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        },
        onCompleted(data) {
            console.log("data", data);
        }
    });

    const [deleteAllNotifications] = useMutation(DELETE_ALL_NOTIFICATION, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        },
        onCompleted(data) {
            removeUserNotifications();
            setUnReadNotificationCount(0);
        }
    });

    const showTitle = (noti, type) => {
        let message = JSON.parse(noti.message);
        return message[type]
    }

    const showNotiCount = (count) => {
        if (count) {
            if (count > 100) return "99+";
            else return count;
        } else return "0"
    }

    const handelReadAllNotification = () => {
        readAllNotifications()
    }

    const notiMarkRead = (notiId) => {
        readNotification({
            variables: {
                markNotificationReadId: notiId
            }
        });
    }

    const handelNotifiactionClear = () => {
        deleteAllNotifications();
    }

    return (
        <div className="dropdown cart-dropdown type2 notification-dropdown mr-0 ml-3">
            {/* <a href="#" className="cart-toggle label-block link">
                <i className="far fa-bell"><span className="cart-count">6</span></i>
            </a> */}

            <ALink href="#" className="cart-toggle label-block link" onClick={() => handelReadAllNotification()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25.963" height="34.43" viewBox="0 0 25.963 34.43">
                    <g id="Group_6" data-name="Group 6" transform="translate(983.5 589.11)">
                        <g id="Group_5" data-name="Group 5">
                        <path id="Path_3" data-name="Path 3" d="M11.4,5V1" transform="translate(-981.919 -589.11)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <path id="Path_4" data-name="Path 4" d="M13.681,27.579c7.949,0,11.626-2.253,11.981-6.382,0-4.122-2.564-3.859-2.564-8.921,0-3.954-3.716-8.452-9.418-8.452s-9.418,4.5-9.418,8.452c0,5.059-2.564,4.8-2.564,8.921C2.056,25.339,5.735,27.579,13.681,27.579Zm3.365,3.052a4.437,4.437,0,0,1-6.862,0" transform="translate(-984.2 -587.934)" fill="none" stroke="#000" strokeLinecap="round" 
                            strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></path>
                        </g>
                    </g>
                </svg>
                <span className="cart-count">{ showNotiCount(unreadNotificationCount) }</span>
            </ALink>

            
            <ul className="dropdown-box w-200 border-rounded" style={ !notifications?.data?.length ? {height: "auto"} : {}}>
                {
                    notifications?.data?.length ? notifications.data.map(noti => <li className="mb-3 pb-2" key={"notification-" + noti.id}>
                        <div className="d-flex align-items-start" onClick={() => notiMarkRead(noti.id)}>
                            <img src="../images/notification-list.svg" className="mr-2" /> 
                            <div>
                                <p className="mb-1 font-weight-medium font-13"> {showTitle(noti, 'title')} </p>
                                <p className="mb-2 font-14 text-muted font-weight-normal"> {moment(noti.updated_at).format("DD MMM, YYYY")} </p>   
                                <ul className="list-unstyled pl-0">
                                    <li>
                                        <div className="d-flex align-items-center">
                                            {/* <img src="images/products/product3.jpg" className="border-rounded mr-2" style={{width:30}} />  */}
                                            <div className="noti-order-table"> 
                                                <p className="mb-0 font-14 font-weight-medium">
                                                   {showTitle(noti, 'body')}</p>
                                            </div> 
                                        </div>  
                                    </li>
                                </ul>  
                                    <a href={noti.redirect_url} className="text-underline font-14 text-muted pl-0 font-weight-normal">See Order Details</a>   
                            </div>  
                        </div> 
                    </li>) : <div className="text-center">No Recent Update</div>
                }
                {
                    notifications?.data?.length ? <ALink href="#" 
                        className="text-center font-13 text-primary p-0 mb-0 font-weight-normal float-right"
                        onClick={() => handelNotifiactionClear()}
                        >Clear All</ALink> : ''
                } 
            </ul>
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        notifications: state.user.notifications
    }
}

export default connect(mapStateToProps, { removeUserNotifications: authUserActions.removeUserNotifications })(NotificationMenu);