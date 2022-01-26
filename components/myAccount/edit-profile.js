
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import moment from "moment";
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

import { authUserActions } from '../../store/authUser';
import { GET_LOGIN_USER_INFO, UPDATE_USER_INFO } from '../../server/queries';
import {objectifyForm, months, yearsList} from "../../utils/helpers";

function EditProfile({setUserInfo}) {
    const [dates, setDates] = useState([]);
    const [yearMonths, setYearMonths] = useState();
    const [gender, setGender] = useState('male');
    const [nameEmail, setNameEmail] = useState();

    const { data, loading, error } = useQuery(GET_LOGIN_USER_INFO, {});
    const userInfo = data?.getUserFromToken;
    
    console.log("setUserInfo =======>", userInfo);

    const [ customerUpdate ] = useMutation( UPDATE_USER_INFO, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                toast.error( <div className="m-5 px-5"> &nbsp; &nbsp; {graphQLErrors[0].message} &nbsp; &nbsp; </div> );
            }
        }
    });


    const editUser = async (e) => {
        e.preventDefault();

        let formArray = $('#js-edit-user').serializeArray();
        let formData = objectifyForm(formArray);

        let userData = {
            "dob": yearMonths && moment(`${yearMonths?.year}-${yearMonths?.month}-${yearMonths?.date}`, 'YYYY-MMMM-D').format("YYYY-MM-DD") !== 'Invalid date' ? 
                moment(`${yearMonths?.year}-${yearMonths?.month}-${yearMonths?.date}`, 'YYYY-MMMM-D').format("YYYY-MM-DD") : null,//"2018-04-12",
            "email": nameEmail.email || '',
            "gender": gender,
            "name": nameEmail.name || ''
        }

        const res = await customerUpdate({
            variables: userData
        });

        if (res?.data?.updateCustomer?.user) {
            setUserInfo(res?.data?.updateCustomer?.user);
            toast.success( <div className="m-5">User updated successfully</div> );
        }
    };

    useEffect(() => {
        if (data) {
            if (data?.getUserFromToken && !error) {
                if (data?.getUserFromToken?.customer?.dob) {
                    generateDate({
                        year: moment(data?.getUserFromToken?.customer?.dob).format("YYYY"),
                        month: moment(data?.getUserFromToken?.customer?.dob).format("MM")
                    });

                    setYearMonths({
                        year: moment(data?.getUserFromToken?.customer?.dob).format("YYYY"),
                        month: moment(data?.getUserFromToken?.customer?.dob).format("MMMM"),
                        date: moment(data?.getUserFromToken?.customer?.dob).format("D")
                    });
                }

                setGender(data?.getUserFromToken?.customer.gender || 'male');
                setNameEmail({
                    name: data?.getUserFromToken?.customer?.name,
                    email: data?.getUserFromToken?.email
                })
            }
        }
    }, [data, error]);

    const generateDate = (yearMonths) => {
        if (yearMonths && yearMonths.year && yearMonths.month) {
            let dates = [];
            let totalsDates = moment(`${yearMonths.year}-${yearMonths.month}`, 'YYYY-M').daysInMonth();

            for(var i = 1; i <= totalsDates; i++) {
                dates.push(i);   
            }
            setDates(dates)
        }
    } 

    useEffect(() => {
        generateDate(yearMonths);
    }, [yearMonths])

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">Edit Profile</h3>
            <hr/>
            
            {/* <div className="row mb-5">  
                <div className="col-xs-6">
                    <label>Mobile</label>
                    <strong><div className="mt-3">{userInfo?.mobile}</div></strong>
                </div>
            </div> */}

            <form action="#" id="js-edit-user" onSubmit={editUser}>
                <div className="row">  
                    <div className="col-xs-6">
                        <label>Full name *</label>
                        <input type="text" className="form-control" defaultValue={userInfo?.customer?.name} 
                            onChange={(e) => {
                                setNameEmail((prev) => ({
                                    ...prev,
                                    "name": e.target.value
                                }))
                            }}  name="name" required />
                    </div> 
                    <div className="col-xs-6">
                        <label>Email Address *</label>
                        <input type="text" className="form-control" defaultValue={userInfo?.email} 
                            onChange={(e) => {
                                setNameEmail((prev) => ({
                                    ...prev,
                                    "email": e.target.value
                                }))
                            }} name="email" required />
                    </div>
                    <div className="col-xs-6">
                        <label>Gender *</label>
                        <div className="select-box">
                            <select name="gender" className="form-control" value={gender} 
                                onChange={e => {setGender(e.target.value)}}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-xs-6">
                        <label>Birthday</label>
                        
                        <div className="d-flex">
                            <select name="year" className="form-control mr-2" value={yearMonths?.year}
                            onChange={(e) => {
                                setYearMonths((prev) => ({
                                    ...prev,
                                    "year": e.target.value
                                }))
                            }}>
                                <option value="">Year</option>
                                {
                                    yearsList().map(year => <option key={'year-' + year}>{year}</option>)
                                }
                            </select>
                            <select name="month" className="form-control mr-2" value={yearMonths?.month}
                            onChange={(e) => {
                                setYearMonths((prev) => ({
                                    ...prev,
                                    "month": e.target.value
                                }))
                            }}>
                                <option value="">Month</option> 
                                {
                                    months.map(month => <option key={'month-'+ month.value} >{month.name} </option>)
                                }
                            </select>
                            <select name="date" className="form-control" value={yearMonths?.date}
                            onChange={(e) => {
                                setYearMonths((prev) => ({
                                    ...prev,
                                    "date": e.target.value
                                }))
                            }}>
                                <option value="">Date</option>
                                {
                                    dates.map(date => <option key={"date-" + date}>{date}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>

                <button className="btn btn-rounded btn-md btn-secondary" type="submit">Save Changes</button>
            </form>
        </div>
    )
}

export default connect( '', { setUserInfo: authUserActions.setUserInfo } )( EditProfile );