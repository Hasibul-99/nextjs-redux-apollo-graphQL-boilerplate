import React from 'react';
import Head from 'next/head';

import ALink from '../components/features/custom-link';

function Error404() {
    return (
        <main className="main">
            <Head>
                <title>Riode React eCommerce Template | 404</title>
            </Head>

            <h1 className="d-none">Riode React eCommerce Template - 404</h1>

            <div className="page-content">
                <section
                    className="error-section d-flex flex-column justify-content-center align-items-center text-center pl-3 pr-3" style={{marginTop: '10%', marginBottom: '10%'}}>
                    <h1 className="mb-2 ls-m">Error 404</h1>
                    <img src="./images/subpages/404.png" alt="error 404" width="609" height="131" />
                    <h4 className="mt-7 mb-0 ls-m text-uppercase">Ooopps! That page can’t be found.</h4>
                    <p className="text-grey font-primary ls-m">It looks like nothing was found at this location.</p>
                    <ALink href="/" className="btn btn-primary btn-rounded mb-4">Go home</ALink>
                </section>
            </div>
        </main >
    )
}

export default React.memo( Error404 );