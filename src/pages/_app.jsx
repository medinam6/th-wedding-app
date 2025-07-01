import React from 'react'
import NavMenu from '../components/Menu'
import Header from '../components/Header'
import 'src/app/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <div className="fixed w-screen h-20 bg-black z-50">
        <Header />
        <NavMenu />
      </div>
      <div className="pt-20">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
