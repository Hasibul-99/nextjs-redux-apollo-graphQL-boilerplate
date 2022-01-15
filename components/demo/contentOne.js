import { connect } from 'react-redux';

function contentOne({current}) {
    return (
        <div>
            Count: {current}         
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        current: state.cart.current
    }
}

export default connect( mapStateToProps, { } )( contentOne ); 