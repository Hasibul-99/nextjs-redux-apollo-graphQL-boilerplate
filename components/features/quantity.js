import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

function Quantity( { qty = 1, ...props } ) {
    const { adClass = 'input-group' } = props;
    const {cartList, product, context} = props;
    const [ quantity, setQuantity ] = useState( parseInt( qty ) );

    // useEffect( () => {
    //     setQuantity( qty );
    // }, [ props.product ] )

    useEffect( () => {
        // props.onChangeQty && props.onChangeQty( quantity );
    }, [ quantity ] );

    useEffect(() => {
        if (product && cartList.length) {
            if (context === 'product') {
                // let cartProduct = cartList.find(cart => cart?.productVariation?.product_id === product?.id);
                // if (cartProduct?.qty) setQuantity(cartProduct.qty);
                // else 
                setQuantity(1);  
            }
            if (context === "cart") {
                let cartProduct = cartList.find(cart => cart?.variation_id === product?.variation_id);
                if (cartProduct?.qty) setQuantity(cartProduct.qty);
                else setQuantity(1);
            }
        }
    }, [cartList, product])

    function minusQuantity() {
        if ( quantity > 1 ) {
            setQuantity( parseInt( quantity ) - 1 );
            if (context === 'product') props.onChangeQty( parseInt( quantity ) - 1 )
            else props.onChangeQty( -1 )
        }
    }

    function plusQuantity() {
        if ( quantity < props.max ) {
            setQuantity( parseInt( quantity ) + 1 );
            if (context === 'product') props.onChangeQty( parseInt( quantity ) + 1 );
            else props.onChangeQty( 1 );
        }
    }

    function changeQty( e ) {
        let newQty;

        if ( e.currentTarget.value !== '' ) {
            newQty = Math.min( parseInt( e.currentTarget.value ), props.max );
            newQty = Math.max( newQty, 1 );
            // setQuantity( newQty );
        }
    }

    return (
        <div className={ adClass }>
            <button className='quantity-minus d-icon-minus' onClick={ minusQuantity }></button>
            <input className='quantity form-control' type='number' min="1" disabled
                max={ props.max } value={ quantity } onChange={ changeQty } />
            <button className='quantity-plus d-icon-plus' onClick={ plusQuantity }></button>
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        cartList: state.cart.data
    }
}

export default connect( mapStateToProps, {} )( Quantity );