import React from 'react'
import NavMenu from "../components/Menu"
import Header from "../components/Header"
import 'src/app/globals.css'

function MyApp({ Component, pageProps }) {
	return (
		<>
		<div className='bg-black fixed w-screen'>
			<Header /> 
			<NavMenu />
		</div>
		<div className='pt-20'>
			<Component {...pageProps} />
			</div>
</>
    )
}

export default MyApp;
