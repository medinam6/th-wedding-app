'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() // Get current path

  const menuList = [
    { name: 'Home Page', path: '/' },
    { name: 'THE WEDDING', path: '/the-wedding' },
    { name: 'OUR STORY', path: '/our-story' },
    { name: 'WEDDING PARTY', path: '/wedding-party' },
    { name: 'REGISTRY', path: '/registry' },
    { name: 'RSVP', path: '/rsvp' },
    { name: 'FAQ', path: '/faq' },
  ]

  return (
    <>
      <button
        className="fixed top-5 right-5 z-100 p-2 rounded-md text-white hover:text-gray-200 focus:outline-none"
        style={{ zIndex: 60 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="h-8 w-8 text-black" aria-hidden="true" />
        ) : (
          <Bars3Icon className="h-8 w-8 text-white" aria-hidden="true" />
        )}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white transform transition-transform duration-500 ease-in-out z-50
             ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <nav className="flex flex-col h-full pt-20">
          {menuList.map((item, index) => {
            const isActive = pathname === item.path // Check if the link is active

            return (
              <Link key={item.name} href={item.path} onClick={() => setIsOpen(false)}>
                <div className="px-6 py-4 group">
                  <span
                    className={`relative inline-block text-gray-700 font-pop text-sm transition-opacity duration-1000 ease-out
                      ${isOpen ? 'opacity-100' : 'opacity-0'}
                      ${isActive ? 'underline underline-offset-4 decoration-2 decoration-black' : ''}`} // Active underline
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {item.name}
                    {/* Hover underline animation */}
                    <span className="absolute left-0 bottom-0 h-0.5 bg-black w-0 transition-all duration-300 ease-out group-hover:w-full"></span>
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default NavMenu
