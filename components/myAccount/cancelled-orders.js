export default function CancelledOrders() {
    return (
        <div>
            <h3 className="title title-simple text-left mb-3">Cancelled Orders</h3>
            <hr/>
            <div className="card card-bordered-custom" style={{borderRadius:5}}>
                <div className="card-body">
                    <div className="table-responsive bordered-custom">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Order no.</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>September 24, 2021</td>
                                    <td>
                                        <span className="product-thumb-img-custom">	
                                            <img src="../images/products/product1.jpg" />
                                            <img src="../images/products/product2.jpg" />
                                            <img src="../images/products/product3.jpg" />
                                        </span>
                                    </td>
                                    <td><span className="badge badge-delivered">Refunded</span></td>
                                    <td>৳900.00 for 5 items</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>September 24, 2021</td>
                                    <td>
                                        <span className="product-thumb-img-custom">	
                                            <img src="../images/products/product1.jpg" />
                                            <img src="../images/products/product2.jpg" />
                                            <img src="../images/products/product3.jpg" />
                                        </span>
                                    </td>
                                    <td><span className="badge badge-cancelled">Cancelled</span></td>
                                    <td>৳290.00 for 2 items</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>September 24, 2021</td>
                                    <td>
                                        <span className="product-thumb-img-custom">	
                                            <img src="../images/products/product1.jpg" />
                                            <img src="../images/products/product2.jpg" />
                                            <img src="../images/products/product3.jpg" />
                                        </span>
                                    </td>
                                    <td><span className="badge badge-cancelled">Cancelled</span></td>
                                    <td>৳480.00 for 8 items</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
