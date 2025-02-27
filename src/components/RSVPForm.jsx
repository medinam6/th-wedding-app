'use client';

import React, { useState } from 'react';

const RSVPForm = () => {
    return (
        <>
            <div className="flex-col mt-0 justify-center overflow-hidden py-6 sm:py-12">
                <div className="relative px-16 pt-10 pb-8 ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-4xl sm:rounded-lg sm:px-20"
                    style={{ backgroundColor: 'rgb(238, 238, 238)' }}>
                    <div>
                        <div className="divide-y divide-gray-300/50">
                            <div className="py-4 max-w-lg mx-auto text-gray-700 font-pop text-sm text-center">
                                <p>Please enter the first and last name of one member of your party below.<br /> <br />If you're responding for you and a guest (or your family), you'll be able to RSVP for your entire group on the next page.</p>
                            </div>
                            <form>
                                <div className="space-y-12">
                                    <div className="mt-10 flex justify-center">
                                        <div className="w-full sm:max-w-md">
                                            <div className="mt-2">
                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        placeholder="First and Last name"
                                                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6" />
                                                </div>
                                                <p className="mt-2 font-pop text-sm leading-3" style={{ fontSize: '10px' }}>Ex. Sarah Fortune (not The Fortune Family or Dr. and Mr. Fortune)</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="rounded-md bg-black px-12 py-2 text-sm font-pop text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                        >
                                            CONTINUE
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RSVPForm;
