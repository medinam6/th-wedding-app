import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  titleOptions,
  stateOptions,
  countryOptions,
  formatPhoneNumber,
  rsvpStatuses,
  entreeOptions,
  getRsvpStyling,
  getTotalPartySize,
  extractGuestsIntoArray,
  reconstructGuestData,
} from './utils/guestListUtility'

const EditGuestModal = ({ isOpen, onClose, onSubmit, guest }) => {
  const [guestData, setGuestData] = useState({
    totalInParty: 1,
    title: '',
    firstName: '',
    lastName: '',
    suffix: '',
    partner: null,
    rsvpStatus: 'No Response',
    children: [],
    diet: '',
    song: '',
    phoneNumber: '',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  })

  const [showPartner, setShowPartner] = useState(false)
  const [guestArray, setGuestArray] = useState([])

  useEffect(() => {
    if (guest) {
      setGuestData({
        ...guest,
        address: guest.address || {
          street1: '',
          street2: '',
          city: '',
          state: '',
          zipCode: '',
        },
        partner: guest.partner || null,
        children: guest.children || [],
      })
      setShowPartner(!!guest.partner)
    }
  }, [guest])

  useEffect(() => {
    setGuestArray(extractGuestsIntoArray(guestData))
  }, [guestData])

  const handleInputChange = (field, value) => {
    setGuestData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePartnerInputChange = (field, value) => {
    setGuestData(prev => ({
      ...prev,
      partner: {
        ...prev.partner,
        [field]: value,
      },
    }))
  }

  const handleChildInputChange = (index, field, value) => {
    setGuestData(prev => {
      const updatedChildren = [...prev.children]
      updatedChildren[index] = {
        ...updatedChildren[index],
        [field]: value,
      }

      return {
        ...prev,
        children: updatedChildren,
      }
    })
  }

  const handleAddPartner = () => {
    setShowPartner(true)
    setGuestData(prev => ({
      ...prev,
      partner: {
        title: '',
        firstName: '',
        lastName: '',
        suffix: '',
        rsvpStatus: 'No Response',
        diet: '',
      },
    }))
  }

  const handleAddChild = () => {
    if (showPartner) {
      setGuestData(prev => ({
        ...prev,
        children: [
          ...(prev.children || []),
          {
            title: '',
            firstName: '',
            lastName: '',
            suffix: '',
            rsvpStatus: 'No Response',
            diet: '',
          },
        ],
      }))
    }
  }

  const handleRemoveChild = index => {
    setGuestData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }))
  }

  const handleRemovePartner = () => {
    setGuestData(prev => ({
      ...prev,
      partner: null,
    }))
    setShowPartner(false)
  }

  const handlePhoneNumberChange = e => {
    const formattedNumber = formatPhoneNumber(e.target.value)
    handleInputChange('phoneNumber', formattedNumber)
  }

  const handleRSVPChange = (index, value) => {
    setGuestArray(prevGuests =>
      prevGuests.map((guest, i) => {
        if (i === index) {
          if (value !== 'Attending') {
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

  const handleSubmit = e => {
    e.preventDefault()
    const updatedGuestData = reconstructGuestData(guestData, guestArray)
    const totalPartySize = getTotalPartySize(updatedGuestData)
    const updatedData = {
      ...updatedGuestData,
      totalInParty: totalPartySize,
      lastUpdated: new Date().toISOString(),
    }
    console.log('Submitting guest data:', updatedData)
    onSubmit(updatedData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2xl rounded-lg mx-auto transform-none w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'rgb(238, 238, 238)',
          padding: '1.5rem',
          position: 'fixed',
          left: '0',
          right: '0',
          top: '5vh',
          bottom: 'auto',
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-pop text-black text-center sm:text-left">
            Edit Guest Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="guest-info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 text-black">
              <TabsTrigger value="guest-info" className="text-xs sm:text-sm">
                Guest Info
              </TabsTrigger>
              <TabsTrigger value="contact-info" className="text-xs sm:text-sm">
                Contact Info
              </TabsTrigger>
              <TabsTrigger value="rsvp-status" className="text-xs sm:text-sm">
                RSVP Status
              </TabsTrigger>
            </TabsList>
            <hr
              style={{ borderTop: '1px solid gray', paddingBottom: '1px', paddingTop: '3px' }}
            ></hr>

            {/* Guest Info Tab */}
            <TabsContent value="guest-info" className="space-y-4">
              {/* Primary Guest */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-4">
                {/* Title */}
                <div className="col-span-2">
                  <label
                    className="block text-xs sm:text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    TITLE
                  </label>
                  <Select
                    value={guestData.title}
                    onValueChange={value => handleInputChange('title', value)}
                  >
                    <SelectTrigger className="w-full border border-gray-300 h-10 rounded-md p-2 bg-white text-black">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-md">
                      {titleOptions.map(option => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="hover:bg-gray-200 focus:bg-gray-300"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* First Name */}
                <div className="col-span-4">
                  <label
                    className="block text-xs sm:text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    FIRST NAME <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={guestData.firstName}
                    onChange={e => handleInputChange('firstName', e.target.value)}
                    required
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>

                {/* Last Name and Suffix groups for mobile - rearranged layout */}
                <div className="col-span-6 sm:hidden grid grid-cols-6 gap-2">
                  <div className="col-span-4">
                    <label
                      className="block text-xs font-pop text-black"
                      style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                    >
                      LAST NAME <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={guestData.lastName}
                      onChange={e => handleInputChange('lastName', e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      className="block text-xs font-pop text-black"
                      style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                    >
                      SUFFIX
                    </label>
                    <Input
                      id="suffix"
                      name="suffix"
                      value={guestData.suffix}
                      onChange={e => handleInputChange('suffix', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                </div>

                {/* Desktop layout for Last Name */}
                <div className="hidden sm:block col-span-4">
                  <label
                    className="block text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    LAST NAME <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={guestData.lastName}
                    onChange={e => handleInputChange('lastName', e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    placeholder="Last Name"
                  />
                </div>

                {/* Desktop layout for Suffix */}
                <div className="hidden sm:block col-span-2" style={{ paddingRight: '28px' }}>
                  <label
                    className="block text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    SUFFIX
                  </label>
                  <Input
                    id="suffix"
                    name="suffix"
                    value={guestData.suffix}
                    onChange={e => handleInputChange('suffix', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>
              </div>

              {/* Add Plus One Button */}
              {!showPartner && (
                <Button
                  type="button"
                  variant="link"
                  className="text-black text-xs sm:text-sm font-small underline hover:no-underline flex items-center gap-1"
                  onClick={handleAddPartner}
                  style={{ marginTop: '0em', paddingLeft: '8px' }}
                >
                  + Add Plus One
                </Button>
              )}

              {/* Partner Fields */}
              {showPartner && (
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-4">
                  {/* Partner Title */}
                  <div className="col-span-2">
                    <Select
                      value={guestData.partner?.title || ''}
                      onValueChange={value => handlePartnerInputChange('title', value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs sm:text-sm text-black"
                    >
                      <SelectTrigger className="w-full border border-gray-300 h-10 rounded-md p-2 bg-white sm:text-sm text-black">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-md">
                        {titleOptions.map(option => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="hover:bg-gray-200 focus:bg-gray-300"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Partner First Name */}
                  <div className="col-span-4">
                    <Input
                      id="partnerFirstName"
                      required
                      value={guestData.partner?.firstName || ''}
                      onChange={e => handlePartnerInputChange('firstName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="First Name"
                    />
                  </div>

                  {/* Partner Last Name and Suffix - Mobile layout */}
                  <div className="col-span-6 sm:hidden grid grid-cols-6 gap-2">
                    <div className="col-span-4">
                      <Input
                        id="partnerLastName"
                        required
                        value={guestData.partner?.lastName || ''}
                        onChange={e => handlePartnerInputChange('lastName', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="col-span-2 flex">
                      <Input
                        id="partnerSuffix"
                        value={guestData.partner?.suffix || ''}
                        onChange={e => handlePartnerInputChange('suffix', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                        placeholder="Suffix"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePartner}
                        className="ml-1 flex-shrink-0 text-black"
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Partner Last Name - Desktop */}
                  <div className="hidden sm:block col-span-4">
                    <Input
                      id="partnerLastName"
                      required
                      value={guestData.partner?.lastName || ''}
                      onChange={e => handlePartnerInputChange('lastName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="Last Name"
                    />
                  </div>

                  {/* Partner Suffix and Remove Button - Desktop */}
                  <div className="hidden sm:flex col-span-2 items-center">
                    <div className="w-full">
                      <Input
                        id="partnerSuffix"
                        value={guestData.partner?.suffix || ''}
                        onChange={e => handlePartnerInputChange('suffix', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePartner}
                      className="ml-2 flex-shrink-0 text-black"
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Add Additional Guest Button */}
              {showPartner && (
                <Button
                  type="button"
                  variant="link"
                  className="text-black text-xs sm:text-sm font-small underline hover:no-underline flex items-center gap-1"
                  onClick={handleAddChild}
                  style={{ marginTop: '0em', paddingLeft: '8px' }}
                >
                  + Add Additional Guest
                </Button>
              )}

              {/* Additional Guests Fields */}
              {guestData.children?.map((child, index) => (
                <div key={index} className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-4">
                  {/* Child Title */}
                  <div className="col-span-2">
                    <Select
                      value={child.title}
                      onValueChange={value => handleChildInputChange(index, 'title', value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs sm:text-sm text-black"
                      style={{ paddingBottom: '11px' }}
                    >
                      <SelectTrigger className="w-full border border-gray-300 h-10 rounded-md p-2 bg-white sm:text-sm text-black">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-md">
                        {titleOptions.map(option => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="hover:bg-gray-200 focus:bg-gray-300"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Child First Name */}
                  <div className="col-span-4">
                    <Input
                      required
                      value={child.firstName}
                      onChange={e => handleChildInputChange(index, 'firstName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="First Name"
                    />
                  </div>

                  {/* Child Last Name and Suffix - Mobile */}
                  <div className="col-span-6 sm:hidden grid grid-cols-6 gap-2">
                    <div className="col-span-4">
                      <Input
                        required
                        value={child.lastName}
                        onChange={e => handleChildInputChange(index, 'lastName', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="col-span-2 flex">
                      <Input
                        value={child.suffix}
                        onChange={e => handleChildInputChange(index, 'suffix', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                        placeholder="Suffix"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveChild(index)}
                        className="ml-1 flex-shrink-0 text-black"
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Child Last Name - Desktop */}
                  <div className="hidden sm:block col-span-4">
                    <Input
                      required
                      value={child.lastName}
                      onChange={e => handleChildInputChange(index, 'lastName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="Last Name"
                    />
                  </div>

                  {/* Child Suffix and Remove Button - Desktop */}
                  <div className="hidden sm:flex col-span-2 items-center">
                    <div className="w-full">
                      <Input
                        value={child.suffix}
                        onChange={e => handleChildInputChange(index, 'suffix', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(index)}
                      className="ml-2 flex-shrink-0 text-black"
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Contact Info Tab */}
            <TabsContent value="contact-info" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs sm:text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    STREET ADDRESS
                  </label>
                  <Input
                    value={guestData.address.street1}
                    onChange={e =>
                      handleInputChange('address', {
                        ...guestData.address,
                        street1: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>
                {/* Street 2 */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    UNIT / APT
                  </label>
                  <Input
                    value={guestData.address.street2}
                    onChange={e =>
                      handleInputChange('address', {
                        ...guestData.address,
                        street2: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>
              </div>

              {/* City, State, Zip - Mobile */}
              <div className="sm:hidden space-y-4">
                {/* City */}
                <div>
                  <label
                    className="block text-xs font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    CITY
                  </label>
                  <Input
                    value={guestData.address.city}
                    onChange={e =>
                      handleInputChange('address', {
                        ...guestData.address,
                        city: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>
                {/* State and Zip in same row */}
                <div className="grid grid-cols-2 gap-2">
                  {/* State */}
                  <div>
                    <label
                      className="block text-xs font-pop text-black"
                      style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                    >
                      STATE
                    </label>
                    <Select
                      value={guestData.address.state}
                      onValueChange={value =>
                        handleInputChange('address', {
                          ...guestData.address,
                          state: value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 bg-white sm:text-sm text-black"
                    >
                      <SelectTrigger className="w-full border border-gray-300 h-10 rounded-md p-2 bg-white sm:text-sm text-black">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-md">
                        {stateOptions.map(option => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="hover:bg-gray-200 focus:bg-gray-300"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Zip Code */}
                  <div>
                    <label
                      className="block text-xs font-pop text-black"
                      style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                    >
                      ZIP CODE
                    </label>
                    <Input
                      value={guestData.address.zipCode}
                      onChange={e =>
                        handleInputChange('address', {
                          ...guestData.address,
                          zipCode: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                </div>
              </div>

              {/* City, State, Zip - Desktop */}
              <div className="hidden sm:grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <label
                    className="block text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    CITY
                  </label>
                  <Input
                    value={guestData.address.city}
                    onChange={e =>
                      handleInputChange('address', {
                        ...guestData.address,
                        city: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>
                {/* State */}
                <div className="col-span-3">
                  <label
                    className="block text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    STATE
                  </label>
                  <Select
                    value={guestData.address.state}
                    onValueChange={value =>
                      handleInputChange('address', {
                        ...guestData.address,
                        state: value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 bg-white sm:text-sm text-black"
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md p-2 bg-white sm:text-sm text-black">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-md">
                      {stateOptions.map(option => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="hover:bg-gray-200 focus:bg-gray-300"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Zip Code */}
                <div className="col-span-3">
                  <label
                    className="block text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    ZIP CODE
                  </label>
                  <Input
                    value={guestData.address.zipCode}
                    onChange={e =>
                      handleInputChange('address', {
                        ...guestData.address,
                        zipCode: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  className="block text-xs sm:text-sm font-pop text-black"
                  style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                >
                  COUNTRY
                </label>
                <Select
                  value={guestData.address.country}
                  onValueChange={value =>
                    handleInputChange('address', {
                      ...guestData.address,
                      country: value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 bg-white sm:text-sm text-black"
                  style={{ paddingBottom: '11px' }}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-md p-2 bg-white sm:text-sm text-black">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md">
                    {countryOptions.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-gray-200 focus:bg-gray-300"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-pop text-black"
                    style={{ lineHeight: '2.25em', letterSpacing: '1px' }}
                  >
                    MOBILE
                  </label>
                  <Input
                    value={guestData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    maxLength={14}
                  />
                </div>
              </div>
            </TabsContent>

            {/* RSVP Status Tab */}
            <TabsContent value="rsvp-status" className="space-y-4">
              <div className="space-y-4 pt-1 px-2 sm:px-8 py-1">
                {/* Mobile-friendly headers */}
                <div className="grid grid-cols-6 gap-2 sm:hidden">
                  <label
                    className="block text-xs font-pop text-black col-span-2"
                    style={{ letterSpacing: '1px' }}
                  >
                    GUESTS
                  </label>
                  <label
                    className="block text-xs font-pop text-black col-span-2"
                    style={{ letterSpacing: '1px' }}
                  >
                    RSVP
                  </label>
                  <label
                    className="block text-xs font-pop text-black col-span-2"
                    style={{ letterSpacing: '1px' }}
                  >
                    ENTRÉE
                  </label>
                </div>

                {/* Desktop headers */}
                <div className="hidden sm:grid grid-cols-6 gap-4">
                  <label
                    className="block text-sm font-pop text-black col-span-2"
                    style={{ letterSpacing: '1px' }}
                  >
                    GUESTS
                  </label>
                  <label
                    className="block text-sm font-pop text-black col-span-2"
                    style={{ letterSpacing: '1px' }}
                  >
                    RSVP
                  </label>
                  <label
                    className="block text-sm font-pop text-black col-span-2"
                    style={{ letterSpacing: '1px' }}
                  >
                    ENTRÉE CHOICE
                  </label>
                </div>

                {/* RSVP entries for all guests */}
                <div className="space-y-4">
                  {guestArray.map((guest, index) => (
                    <div key={index} className="grid grid-cols-6 gap-2 sm:gap-4 items-center">
                      {/* Guest Name */}
                      <div className="col-span-2 pt-2">
                        <span className="text-xs sm:text-sm font-pop text-gray-500">
                          {index + 1}.{' '}
                        </span>
                        <span className="text-xs sm:text-sm font-pop text-gray-500 break-words">
                          {guest.firstName} {guest.lastName}
                        </span>
                      </div>

                      {/* RSVP Status Dropdown */}
                      <div className="col-span-2">
                        <Select
                          value={guest.rsvpStatus}
                          onValueChange={value => handleRSVPChange(index, value)}
                          className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs sm:text-sm text-black"
                        >
                          <SelectTrigger
                            className={`w-full sm:w-32 border rounded-md p-2 bg-white text-xs sm:text-sm ${getRsvpStyling(guest.rsvpStatus).textColor}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-md">
                            {rsvpStatuses.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="hover:bg-gray-200 focus:bg-gray-300"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Entrée Choice Dropdown - Only visible if attending */}
                      <div className="col-span-2">
                        {guest.rsvpStatus === 'Attending' ? (
                          <Select
                            value={guest.entree || ''}
                            onValueChange={value => handleEntreeChange(index, value)}
                            className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs sm:text-sm text-black"
                          >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs sm:text-sm text-black">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-300 shadow-md">
                              {entreeOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="hover:bg-gray-200 focus:bg-gray-300"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="w-full p-2 text-gray-400 text-xs sm:text-sm">
                            {guest.rsvpStatus === 'Declined' ? 'Not Attending' : 'Awaiting RSVP'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <label
                    className="block text-xs sm:text-sm font-pop text-black"
                    style={{
                      lineHeight: '2.25em',
                      letterSpacing: '1px',
                    }}
                  >
                    Any song requests for the wedding reception?
                  </label>
                  <Input
                    value={guestData.song}
                    onChange={e => handleInputChange('song', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <div
              className="sticky bottom-0 bg-[rgb(238, 238, 238)] px-2 sm:px-6 py-4 border-t w-full"
              style={{ backgroundColor: 'rgb(238, 238, 238' }}
            >
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-md border border-black bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-pop text-black shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ letterSpacing: '1px' }}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  className="rounded-md border border-black bg-black px-3 sm:px-4 py-2 text-xs sm:text-sm font-pop text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ letterSpacing: '1px' }}
                >
                  SAVE CHANGES
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditGuestModal
