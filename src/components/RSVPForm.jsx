'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X } from 'lucide-react'
import {
  extractGuestsIntoArray,
  reconstructGuestData,
  formatGuestNamesInTable,
  sortGuestList,
  weddingDetails,
} from './utils/guestListUtility'

const RSVPForm = () => {
  const [guests, setGuests] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [selectedParty, setSelectedParty] = useState(null)
  const [selectedPartyData, setSelectedPartyData] = useState(null)
  const [guestArray, setGuestArray] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const resultsRef = useRef(null)

  const handleSelectGuest = guest => {
    setSelectedParty(guest)
    setSelectedPartyData(guest)
    setGuestArray(extractGuestsIntoArray(guest))
  }

  function needsToRSVP(guests) {
    const extractedGuests = extractGuestsIntoArray(guests)
    return extractedGuests.some(guest => guest.rsvpStatus === 'No Response')
  }

  const handleInputChange = (field, value) => {
    setSelectedPartyData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Need to move to utlity file
  const getRSVPStatuses = guest => {
    const statuses = []

    if (guest.rsvpStatus) {
      statuses.push(guest.rsvpStatus)
    }

    if (guest.partner?.rsvpStatus) {
      statuses.push(guest.partner.rsvpStatus)
    }

    if (Array.isArray(guest.children)) {
      guest.children.forEach(child => {
        if (child.rsvpStatus) {
          statuses.push(child.rsvpStatus)
        }
      })
    }

    return statuses
  }

  const handleSubmitRsvp = async selectedPartyData => {
    setIsSubmitting(true)
    try {
      const updatedGuestData = reconstructGuestData(selectedPartyData, guestArray)
      const dataToSubmit = {
        ...updatedGuestData,
        lastUpdated: new Date().toISOString(),
      }

      const response = await fetch('/api/guestList', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPartyData._id,
          ...dataToSubmit,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update guest')
      }
      setIsSubmitting(false)
      setSubmitted(true)
      setIsEditing(false)
      console.log('Guest updated successfully')
    } catch (error) {
      console.error('Error updating guest:', error)
    }
  }

  const handleSearch = e => {
    e.preventDefault()
    setSearchTerm(searchTerm)
    setIsSearchSubmitted(true)
    const filteredGuests = guests.filter(
      guest =>
        `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${guest.partner?.firstName || ''} ${guest.partner?.lastName || ''}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    setSearchResults(sortGuestList(filteredGuests))
  }

  useEffect(() => {
    if (searchResults.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [searchResults])

  const handleRSVPChange = (index, value) => {
    setGuestArray(prevGuests =>
      prevGuests.map((guest, i) => {
        if (i === index) {
          if (value === 'Declined') {
            return { ...guest, rsvpStatus: value, entree: '' }
          }
          return { ...guest, rsvpStatus: value }
        }
        return guest
      })
    )
  }

  const handleEntreeChange = (index, value) => {
    setGuestArray(prevGuests =>
      prevGuests.map((guest, i) => (i === index ? { ...guest, entree: value } : guest))
    )
  }

  useEffect(() => {
    const fetchGuestList = async () => {
      try {
        const response = await fetch('/api/guestList')
        console.log('API Response:', response)

        if (!response.ok) {
          // Try to read the error details
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }

        const data = await response.json()
        const activeGuests = Array.isArray(data) ? data.filter(guest => !guest.isDeleted) : []
        setGuests(activeGuests)
      } catch (error) {
        console.error('Detailed fetch error:', error)
        setGuests([])
      }
    }

    fetchGuestList()
  }, [])

  const renderSearchForm = () => (
    <>
      <div className="flex-col mt-0 justify-center overflow-hidden py-6 sm:py-12">
        <div
          className="px-16 pt-10 pb-8 ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-20"
          style={{ backgroundColor: 'rgb(238, 238, 238)' }}
        >
          <div>
            <div className="divide-y divide-gray-300/50">
              <div className="py-4 max-w-lg mx-auto text-gray-700 font-pop text-sm text-center">
                <p>Kindly Reply by Monday</p>
                <p>March 9, 2026</p>
              </div>
              <form onSubmit={handleSearch}>
                <div className="space-y-12">
                  <div className="mt-10 flex justify-center">
                    <div className="w-full sm:max-w-md">
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                          <input
                            type="text"
                            value={searchTerm}
                            required
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="First and Last name"
                            className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                          />
                        </div>
                        {isSearchSubmitted && searchResults.length < 1 ? (
                          <span className="text-xs text-center-aligned text-gray-500">
                            Hm... we can't find your name. Make sure you enter your name exactly as
                            it appears on your invitation.
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="rounded-md bg-black px-12 py-2 text-sm font-pop text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ letterSpacing: '1px' }}
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

  const renderSearchResults = () => (
    <div className="dpx-16 pt-10 pb-8 ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-4xl sm:rounded-lg sm:px-20">
      <p className="font-pop text-white pb-3 max-w-prose mx-auto">
        Select your info below or try searching again.
      </p>
      <hr style={{ borderTop: '1px solid gray' }}></hr>
      {searchResults.map(guest => (
        <div key={guest._id}>
          <div className="flex p-2 pb-4 justify-between items-center">
            <div className="p-2 divide-white font-pop text-white">
              {formatGuestNamesInTable(guest)}
            </div>
            <Button
              onClick={() => handleSelectGuest(guest)}
              className="rounded-md bg-white px-12 py-2 text-sm font-pop text-black font-heavy shadow-sm hover:bg-black hover:text-white hover:border hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Select
            </Button>
          </div>
          <hr style={{ borderTop: '1px solid gray' }}></hr>
        </div>
      ))}
    </div>
  )

  const renderRSVPForm = () => (
    <div className="mt-8 space-y-6 max-w-5xl mx-auto">
      {weddingDetails()}
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSubmitRsvp(selectedPartyData)
        }}
      >
        <h2 className="text-xl text-white font-pop font-heavy text-center pb-5">
          RSVP for Your Party
        </h2>
        <hr style={{ borderTop: '1px solid gray' }}></hr>
        <div className="space-y-4">
          {guestArray.map((guest, index) => (
            <div key={`${guest._id}-${index}`} className="pb-4 pt-4">
              <div className="flex justify-between items-center">
                {/* Guest Name */}
                <div className="pt-4">
                  <span className="font-pop text-white">
                    {guest.firstName} {guest.lastName}{' '}
                  </span>
                  <span className="text-red-500">*</span>
                </div>

                {/* Radio Buttons for RSVP */}
                <div className="pt-4 flex items-center gap-4">
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="radio"
                      name={`rsvp-${index}`}
                      value="Attending"
                      required
                      checked={guest.rsvpStatus === 'Attending'}
                      onChange={e => handleRSVPChange(index, e.target.value)}
                      className="h-6 w-6 accent-black hover:accent-gray-500"
                    />
                    <span className="font-pop text-white">Will Attend</span>
                  </label>

                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="radio"
                      name={`rsvp-${index}`}
                      value="Declined"
                      required
                      checked={guest.rsvpStatus === 'Declined'}
                      onChange={e => handleRSVPChange(index, e.target.value)}
                      className="h-6 w-6 accent-black hover:accent-gray-500"
                    />
                    <span className="font-pop text-white">Will Not Attend</span>
                  </label>
                </div>
              </div>

              {/* Entrée Selection - Only show if attending */}
              {guest.rsvpStatus === 'Attending' && (
                <div className="mt-4">
                  <p
                    className="font-pop text-white text-center"
                    style={{
                      lineHeight: '2.25em',
                      letterSpacing: '1px',
                    }}
                  >
                    Please indicate your choice of Entrée:<span className="text-red-500"> *</span>
                  </p>
                  <div className="flex justify-center gap-16 mt-2">
                    <label className="flex items-center space-x-2 text-white">
                      <input
                        type="radio"
                        name={`entree-${index}`}
                        value="Beef"
                        required
                        checked={guest.entree === 'Beef'}
                        onChange={e => handleEntreeChange(index, e.target.value)}
                        className="h-4 w-4 accent-black hover:accent-gray-500"
                      />
                      <span className="font-pop text-white">Beef</span>
                    </label>

                    <label className="flex items-center space-x-2 text-white">
                      <input
                        type="radio"
                        name={`entree-${index}`}
                        value="Fish"
                        required
                        checked={guest.entree === 'Fish'}
                        onChange={e => handleEntreeChange(index, e.target.value)}
                        className="h-4 w-4 accent-black hover:accent-gray-500"
                      />
                      <span className="font-pop text-white">Fish</span>
                    </label>

                    <label className="flex items-center space-x-2 text-white">
                      <input
                        type="radio"
                        name={`entree-${index}`}
                        value="Vegetarian"
                        required
                        checked={guest.entree === 'Vegetarian'}
                        onChange={e => handleEntreeChange(index, e.target.value)}
                        className="h-4 w-4 accent-black hover:accent-gray-500"
                      />
                      <span className="font-pop text-white">Vegetarian</span>
                    </label>
                  </div>
                </div>
              )}
              <hr className="mt-4" style={{ borderTop: '1px solid gray' }}></hr>
            </div>
          ))}
        </div>
        <div className="flex-col mt-0 justify-center overflow-hidden py-5 sm:py-12">
          <div
            className="px-16 pt-10 pb-16 ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-4xl sm:rounded-lg sm:px-20"
            style={{ backgroundColor: 'rgb(238, 238, 238)' }}
          >
            <div>
              <div className="divide-y divide-gray-300/50">
                <div className="py-4 max-w-lg mx-auto text-black font-pop text-lg text-center">
                  <h2>The couple would like to know...</h2>
                </div>
                <div className="col-span-12 pt-4">
                  <label
                    className="block text-sm font-pop text-black"
                    style={{
                      lineHeight: '2.25em',
                      letterSpacing: '1px',
                    }}
                  >
                    Any song requests for the wedding reception? (Optional)
                  </label>
                  <Input
                    value={selectedPartyData?.song || ''}
                    onChange={e => handleInputChange('song', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="rounded-md bg-white px-12 py-2 text-sm font-pop text-black font-heavy shadow-sm hover:bg-black hover:text-white hover:border hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
          </Button>
        </div>
      </form>
    </div>
  )

  const renderConfirmation = () => (
    <div className="mt-8 space-y-6">
      {weddingDetails()}
      <h2 className="text-xl text-white font-pop font-heavy text-center pb-5">
        Your RSVP Has Been Submitted Successfully!
      </h2>
      <div className="space-y-4 w-2/3 mx-auto">
        {guestArray.map((guest, index) => (
          <div className="flex justify-between items-center pb-4" key={`${index}-${guest._id}`}>
            <div className="pt-4">
              <span className="font-pop text-white">
                {guest.firstName} {guest.lastName}{' '}
              </span>
            </div>
            <div className="pt-4 flex items-center gap-4">
              <div className="flex flex-col items-start">
                {getRSVPStatuses(guest).map((status, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {status === 'Attending' && (
                      <>
                        <Check className="w-6 h-6 text-green-500" />
                        <span className="text-white">Will Attend</span>
                      </>
                    )}
                    {status === 'Declined' && (
                      <>
                        <X className="w-6 h-6 text-red-500" />
                        <span className="text-white">Will Not Attend</span>
                      </>
                    )}
                    {status === ('No Response' || '') && (
                      <>
                        <Minus className="w-6 h-6 text-white" />
                        <span className="text-gray-400">No Response</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <hr style={{ borderTop: '1px solid gray' }}></hr>
      </div>
      <div className="flex justify-center pt-10">
        <Button
          className="rounded-md bg-white px-12 py-2 text-sm font-pop text-black font-heavy shadow-sm hover:bg-black hover:text-white hover:border hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => {
            setIsEditing(true)
            setSubmitted(false)
          }}
        >
          Edit RSVP
        </Button>
      </div>
    </div>
  )
  return (
    <div className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto p-6">
      {!selectedParty && !submitted && (
        <>
          {renderSearchForm()}
          {searchResults.length > 0 && renderSearchResults()}
        </>
      )}
      {selectedParty &&
        !submitted &&
        (isEditing || needsToRSVP(selectedParty) ? renderRSVPForm() : renderConfirmation())}

      {submitted && renderConfirmation()}
    </div>
  )
}

export default RSVPForm
