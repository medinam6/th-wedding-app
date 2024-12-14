import React from 'react';
import NavMenu from "../components/Menu";
import 'src/app/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <NavMenu />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
