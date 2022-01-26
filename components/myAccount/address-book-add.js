import Router from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ADDRESS, ADDRESS_MAP, ADDRESS_ECOURIER } from '../../server/queries';
import { objectifyForm } from "../../utils/helpers";
import { toast } from 'react-toastify';
import { useState } from 'react';
// import Select from 'react-select';

export default function AddressBookAdd({context, setModelOpen, addressType}) {
    const { data, loading, error } = useQuery(ADDRESS_ECOURIER);
    const addressMap = data && data.getAddressEcourier;

    const [thanas, setThana] = useState([]);
    const [postcode, setPostcode] = useState([]);
    const [unions, setUnions] = useState([]);
    const [addressData, setAddressData] = useState();

    const [ createAddress ] = useMutation( CREATE_ADDRESS, {
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            console.log(graphQLErrors);
            if (graphQLErrors?.length) {
                
            }
        }
    });

    const chnageCity = (e) => {
        let value = e.target.value;

        setPostcode([]);
        setUnions([]);

        setAddressData((prev) => ({
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
        let value = e.target.value;

        setUnions([]);

        setAddressData((prev) => ({
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
        
        setAddressData((prev) => ({
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

    const addressSubmit = async (e) => {
        e.preventDefault();

        let formArray = $('#form-address-save').serializeArray();
        let formData = objectifyForm(formArray);
        let dataAddress = addressData;

        if (addressType === 'shipping') {
            dataAddress.shipping = 1;
        }

        if (addressType === 'billing') {
            dataAddress.billing = 1;
        }


        const res = await createAddress({
            variables: dataAddress
        });

        if ( res?.data?.createAddress) {
            toast.success( <div className="m-5">Address added successfully</div> );
            if (context === 'checkout' && setModelOpen) {
                setModelOpen(false);
                Router.reload(window.location.pathname);
            } else Router.push('/my-account/?content=address-book')
        }
    }

    return (
        <div>
            <h3 className="title title-simple text-left mb-3">Add an Address</h3>
            <hr/>

            <form id="form-address-save" onSubmit={addressSubmit}>
                <div className="card-body">
                    <div className="row modal-address-row">
                        <div className="col-xs-12">
                            <label>Name *</label>
                            <input type="text" className="form-control" name="name" required 
                                onChange={(e) => {
                                    setAddressData((prev) => ({
                                        ...prev,
                                        "name": e.target.value
                                    }))
                                }}/>
                        </div>
                        <div className="col-xs-6">
                            <label>Phone *</label>
                            <input type="text" className="form-control" name="mobile" required 
                                onChange={(e) => {
                                    setAddressData((prev) => ({
                                        ...prev,
                                        "mobile": e.target.value
                                    }))
                                }}/>
                        </div>
                        <div className="col-xs-6">
                            <label>Email Address *</label>
                            <input type="text" className="form-control" name="email" required 
                                onChange={(e) => {
                                    setAddressData((prev) => ({
                                        ...prev,
                                        "email": e.target.value
                                    }))
                                }}/>
                        </div>
                        <div className="col-xs-6">
                            <label>City *</label>
                            <div className="select-box">
                                <select name="city" className="form-control" required onChange={chnageCity}>
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
                                <select name="thana" className="form-control" required onChange={chnageThana}>
                                    <option value=""></option>
                                    {
                                        thanas.map(thana => <option key={thana.thana_name} value={thana.thana_name}>{thana.thana_name}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <label>PostCode *</label>
                            <select name="union" className="form-control" required 
                                onChange={changeUnion}>
                                <option value=""></option>
                                {
                                    postcode.map(code => <option key={code.post_code_name} value={code.post_code_name}>{code.post_code_name}</option>)
                                }
                            </select>
                        </div>
                        <div className="col-xs-6">
                            <label>Area *</label>
                            <select name="area" className="form-control" required 
                                onChange={(e) => {
                                    setAddressData((prev) => ({
                                        ...prev,
                                        "area": e.target.value
                                    }))
                                }}>
                                <option value=""></option>
                                {
                                    unions.map(union => <option key={union.name} value={union.name}>{union.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <label>Street Address *</label>
                    <input type="text" className="form-control" name="address" required
                    onChange={(e) => {
                        setAddressData((prev) => ({
                            ...prev,
                            "address": e.target.value
                        }))
                    }}
                        placeholder="House number and street name" />

                    <p className="mb-4 mt-4 text-right"> 
                        <button className="btn btn-rounded btn-md btn-secondary" type="submit"
                            id="js-save-address">Save Address</button> 
                    </p>   
                </div>
            </form>
        </div>
    )
}
