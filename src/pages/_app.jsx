import React from 'react'
import NavMenu from "../components/Menu"
import Header from "../components/Header"
import 'src/app/globals.css'

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Header /> 
			<NavMenu />
			<Component {...pageProps} />
		</>
    )
}

export default MyApp;
