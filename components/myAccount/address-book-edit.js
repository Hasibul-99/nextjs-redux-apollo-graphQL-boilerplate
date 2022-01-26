
import { useEffect, useState } from 'react';
import Router from 'next/router';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { UPDATE_ADDRESS_INFO, GET_ADDRESS_INFO, ADDRESS_ECOURIER } from '../../server/queries';
import { objectifyForm } from "../../utils/helpers";
import { toast } from 'react-toastify';
import { Fragment } from 'react';
// import Select from 'react-select';

export default function AddressBookAdd() {
    const router = useRouter();
    const query = router.query;
    const [thanas, setThana] = useState([]);
    const [postcode, setPostcode] = useState([]);
    const [unions, setUnions] = useState([]);

    const [userAddress, setUserAddress] = useState({});
    const [addressInfo, setAddressInfo] = useState({});

    const { data, loading, error } = useQuery( GET_ADDRESS_INFO, { variables: { singleAddressId: query?.address_id * 1 }, fetchPolicy: 'network-only' }, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors?.length) {
                console.log("graphQLErrors", graphQLErrors);
            }
        }
    });

    const address = data && data?.single_address;

    const addressContent = useQuery(ADDRESS_ECOURIER, {
        onCompleted(data) {
            console.log("data -----------------", data);
        }
    });
    const addressMap = addressContent && addressContent.data && addressContent.data.getAddressEcourier ? addressContent.data.getAddressEcourier : '';
    const [ updateAddress ] = useMutation( UPDATE_ADDRESS_INFO, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            console.log(graphQLErrors);
            if (graphQLErrors?.length) {
                
            }
        }
    });

    
    const changeCity = (e) => {
        let value = e?.target?.value;

        setPostcode([]);
        setUnions([]);

        setUserAddress((prev) => ({
            ...prev,
            "city": value
        }))

        if (value && addressMap?.length) {
            let findThana = addressMap.find(address => address.city === value);
            setThana(findThana?.thana || []);
        } else {
            setThana([]);
        }
    }

    const chnageThana = (e) => {
        let value = e?.target?.value;
        setUnions([]);

        setUserAddress((prev) => ({
            ...prev,
            "thana": value
        }))

        if (value && thanas?.length) {
            let findThana = thanas.find(tanan => tanan.thana_name === value);

            setPostcode(findThana?.post_codes || []);
        } else {    
            setPostcode([])
        }
    }

    const changeUnion = (e) => {
        let value = e.target.value;
        
        setUserAddress((prev) => ({
            ...prev,
            "union": value
        }));

        if (value && postcode?.length) {
            let findUnion = postcode.find(union => union.post_code_name === value);
            setUnions(findUnion?.area || []);
        } else {    
            setUnions([])
        }
    } 

    const updateAddressSubmit = async (e) => {
        e.preventDefault();

        let formArray = $('#form-address-update').serializeArray();
        let formData = objectifyForm(formArray);

        formData.addressId = parseInt(query.address_id);
        formData.union = userAddress.union;
        formData.thana = userAddress.thana;
        formData.city = userAddress.city;
        formData.area = userAddress.area;

        formData.address = addressInfo.address;
        formData.email = addressInfo.email;
        formData.name = addressInfo.name;
        formData.mobile = addressInfo.mobile;

        const res = await updateAddress({
            variables: formData
        });

        if ( res?.data?.updateAddress) {
            toast.success( <div className="m-5">{res?.data?.updateAddress?.message}</div> );
            Router.push('/my-account/?content=address-book')
        }
    }

    useEffect(() => {
        if (addressMap?.length && address) {
            setAddressInfo({
                name: address.name,
                email: address.email,
                address: address.address,
                mobile: address.mobile
            });

            let findCity = addressMap.find(item => item.city === address.city);
            setThana(findCity?.thana || []);

            let findArea = findCity?.thana.find(city => city.thana_name === address.thana);
            setPostcode(findArea?.post_codes || []);

            let findUnion = findArea?.post_codes.find(item => item.post_code_name === address.union);
            setUnions(findUnion?.area || []);

            setUserAddress({
                city: address.city,
                thana: address.thana,
                union: address.union,
                area: address.area,
            });

            
        }
    }, [addressMap, address])

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">Update Address</h3>
            <hr/>

            {
                address ? <form id="form-address-update" onSubmit={updateAddressSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xs-12">
                                <label>Name *</label>
                                <input type="text" className="form-control" name="name"
                                    onChange={(e) => {
                                        setAddressInfo((prev) => ({
                                            ...prev,
                                            "name": e.target.value
                                        }))
                                    }}
                                    defaultValue={addressInfo.name} required />
                            </div>
                            <div className="col-xs-6">
                                <label>Phone *</label>
                                <input type="text" className="form-control" name="mobile" 
                                onChange={(e) => {
                                    setAddressInfo((prev) => ({
                                        ...prev,
                                        "mobile": e.target.value
                                    }))
                                }} defaultValue={addressInfo.mobile} required />
                            </div>
                            <div className="col-xs-6">
                                <label>Email Address *</label>
                                <input type="text" className="form-control" name="email" 
                                onChange={(e) => {
                                    setAddressInfo((prev) => ({
                                        ...prev,
                                        "email": e.target.value
                                    }))
                                }} defaultValue={addressInfo.email} required />
                            </div>
                            <div className="col-xs-6">
                                <label>City *</label>
                                <div className="select-box">
                                    <select name="city" className="form-control" value={userAddress.city} required onChange={changeCity}>
                                        <option value=""></option> 
                                        {
                                            addressMap?.length ? addressMap.map(data => <option key={data.city} value={data.city}>{data.city}</option>) : ''
                                        }
                                    </select>
                                </div>
                            </div>
                            
                            <div className="col-xs-6">
                                <label>Thana *</label>
                                <div className="select-box">
                                    <select name="city" className="form-control" required value={ userAddress.thana } onChange={chnageThana}>
                                        <option value=""></option>
                                        {
                                            thanas.map(thana => <option key={thana.thana_name} value={thana.thana_name}>{thana.thana_name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="col-xs-6">
                                <label>PostCode *</label>
                                <select name="Union" className="form-control" value={userAddress.union} required onChange={changeUnion}>
                                    <option value=""></option>
                                    {
                                        postcode.map(code => <option key={code.post_code_name} value={code.post_code_name}>{code.post_code_name}</option>)
                                    }
                                </select>
                            </div>

                            <div className="col-xs-6">
                                <label>Area *</label>
                                <select name="area" className="form-control" value={userAddress.area} required 
                                onChange={(e) => {
                                    setUserAddress((prev) => ({
                                        ...prev,
                                        "area": e.target.value
                                    }))
                                }}>
                                    <option value=""></option>
                                    {
                                        unions.map(union => <option key={union.name} value={union.name}>{union.name}</option>)
                                    }
                                </select>
                                {/* selected={a.name === address.area} */}
                            </div>
                        </div>
                        <label>Street Address *</label>
                        <input type="text" className="form-control" name="address" 
                            onChange={(e) => {
                                setAddressInfo((prev) => ({
                                    ...prev,
                                    "address": e.target.value
                                }))
                            }} required defaultValue={addressInfo.address}
                            placeholder="House number and street name" />

                        <p className="mb-4 mt-4 text-right"> 
                            <button className="btn btn-rounded btn-md btn-secondary" type="submit"
                                id="js-save-address">Save Address</button> 
                        </p>   
                    </div>
                </form> : <Fragment>
                    <div className="text-center">
                        <h3>Address not forund</h3>
                    </div>
                </Fragment>
            }
            
        </div>
    )
}
