import React from 'react'
import {cartActions} from "../../store/cart";
import { connect } from 'react-redux';

function userOne({refreshStore, current}) {
    return (
        <div>
            <button type='button' onClick={() => {refreshStore(current + 1)}}>Add</button>
        </div>
    )
};

function mapStateToProps( state ) {
    return {
        current: state.cart.current
    }
}

export default connect( mapStateToProps, { refreshStore: cartActions.refreshStore } )( userOne ); 
