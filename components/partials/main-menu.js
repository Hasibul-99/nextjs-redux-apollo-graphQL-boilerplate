import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import ALink from '../features/custom-link';

function MainMenu(props) {
    const {isUserLogin} = props;

    const pathname = useRouter().pathname;

    return (
        <nav className="main-nav pl-5">
            <ul className="menu">
                <li id="menu-home" className={ pathname === '/' ? 'active' : 'text-black' }>
                    <ALink href='/'>Home</ALink>
                </li>
                {/* className={ pathname === '/' ? 'active' : '' } */}
                <li className={ pathname === '/campaign' ? 'active' : 'text-black' } >
                    <ALink href='/campaign'>Campaign</ALink>
                </li>
                {/* {
                    isUserLogin ? <li className="text-black" className={ pathname === '/my-account' ? 'active' : 'text-black' }>
                        <ALink href='/my-account'>My Account</ALink>
                    </li> : ''
                } */}
            </ul>
        </nav>
    )
}

function mapStateToProps( state ) {
    return {
        isUserLogin: state.user.isUserLogin
    }
}

export default connect( mapStateToProps, { } )( MainMenu );