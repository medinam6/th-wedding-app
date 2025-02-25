import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  titleOptions,
  stateOptions,
  countryOptions,
  formatPhoneNumber,
  getTotalPartySize
} from './utils/guestListUtility';

const AddGuestModal = ({ isOpen, onClose, onSubmit }) => {
  const [guestData, setGuestData] = useState({
    totalInParty: 1,
    title: '',
    firstName: '',
    lastName: '',
    suffix: '',
    partner: null,
    rsvpStatus: 'No Response',
    children: [],
    email: '',
    phoneNumber: '',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    }
  });

  const [showPartner, setShowPartner] = useState(false);
  const [showChildren, setShowChildren] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleInputChange = (field, value) => {
    setGuestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePartnerInputChange = (field, value) => {
    setGuestData(prev => ({
      ...prev,
      partner: {
        ...prev.partner,
        [field]: value
      }
    }));
  };

  const handleAddPartner = () => {
    setShowPartner(true);
    setGuestData(prev => ({
      ...prev,
      partner: {
        title: '',
        firstName: '',
        lastName: '',
        suffix: '',
        rsvpStatus: 'No Response'
      }
    }));
  };

  const handleChildInputChange = (index, field, value) => {
    setGuestData(prev => {
      const updatedChildren = [...prev.children];
      updatedChildren[index] = {
        ...updatedChildren[index],
        [field]: value
      };
      return {
        ...prev,
        children: updatedChildren
      };
    });
  };

  const handleAddChild = () => {
    if (showPartner) {
      setShowChildren(true);
      setGuestData(prev => ({
        ...prev,
        children: [
          ...(prev.children || []),
          {
            title: '',
            firstName: '',
            lastName: '',
            suffix: '',
            rsvpStatus: 'No Response'
          }
        ]
      }));
    }
  };

  const handleRemoveChild = (index) => {
    setShowChildren(false);
    setGuestData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const handleRemovePartner = () => {
    setGuestData(prev => ({
      ...prev,
      partner: null
    }))
    setShowPartner(false);
    setShowChildren(false);
  }

  const handlePhoneNumberChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    handleInputChange('phoneNumber', formattedNumber);
  };

  const resetForm = () => {
    setGuestData({
      title: '',
      firstName: '',
      lastName: '',
      suffix: '',
      rsvpStatus: 'No Response',
      partner: null,
      email: '',
      phoneNumber: '',
      address: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      }
    });
    setShowPartner(false);
    setShowChildren(false);
    setShowAddress(false);
    setShowContact(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalInParty = getTotalPartySize(guestData);

    const finalGuestData = {
      ...guestData,
      totalInParty,
      lastUpdated: new Date().toISOString(),
      isDeleted: false,
    };

    onSubmit(finalGuestData);
    resetForm();
    setShowPartner(false);
    setShowChildren(false);
    setShowAddress(false);
    setShowContact(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { handleClose() } }}>
      <DialogContent
        className="sm:max-w-2xl bg-gray-900 rounded-lg flex flex-col max-h-[90vh] w-full"
        style={{
          backgroundColor: 'rgb(238, 238, 238)',
          padding: '1.5rem'
        }}
      >
        <DialogHeader className="sticky top-0 bg-[rgb(238, 238, 238)] z-10 px-2 sm:px-6 py-2 sm:py-4">
          <DialogTitle className="font-pop text-black text-center sm:text-left">Add New Guest</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-2 sm:px-6">
          <hr style={{ borderTop: '1px solid gray', paddingBottom: '1px' }}></hr>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Primary Guest - Mobile Layout */}
            <div className="sm:hidden space-y-3 pt-2">
              {/* Title */}
              <div>
                <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>TITLE</label>
                <select
                  value={guestData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs text-black"
                >
                  {titleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>
                    FIRST NAME <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    required
                    value={guestData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>
                    LAST NAME <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    required
                    value={guestData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Suffix */}
              <div>
                <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>SUFFIX</label>
                <Input
                  id="suffix"
                  value={guestData.suffix}
                  onChange={(e) => handleInputChange('suffix', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                />
              </div>
            </div>

            {/* Primary Guest - Desktop Layout */}
            <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4">
              {/* Title */}
              <div className="col-span-2" style={{ paddingLeft: '4px' }}>
                <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>TITLE</label>
                <select
                  value={guestData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm text-black"
                  style={{ paddingBottom: '11px' }}
                >
                  {titleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* First Name */}
              <div className="col-span-4">
                <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>
                  FIRST NAME <span className="text-red-500">*</span>
                </label>
                <Input
                  id="firstName"
                  required
                  value={guestData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  placeholder="First Name"
                />
              </div>

              {/* Last Name */}
              <div className="col-span-4">
                <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>
                  LAST NAME <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lastName"
                  required
                  value={guestData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                  placeholder="Last Name"
                />
              </div>

              {/* Suffix */}
              <div className="col-span-2" style={{ paddingRight: '28px' }}>
                <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>SUFFIX</label>
                <Input
                  id="suffix"
                  value={guestData.suffix}
                  onChange={(e) => handleInputChange('suffix', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                />
              </div>
            </div>

            {/* Partner Fields */}
            {!showPartner && (
              <Button
                type="button"
                variant="link"
                className="text-black text-xs sm:text-sm font-small underline hover:no-underline flex items-center gap-1"
                onClick={handleAddPartner}
                style={{ marginTop: '0.5em', paddingLeft: '8px' }}
              >
                + Add Plus One
              </Button>
            )}

            {/* Partner Fields - Mobile Layout */}
            {showPartner && (
              <div className="sm:hidden space-y-3">
                {/* Partner Title */}
                <div>
                  <select
                    value={guestData.partner?.title}
                    onChange={(e) => handlePartnerInputChange('title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs text-black"
                  >
                    {titleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Partner First & Last Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      id="partnerFirstName"
                      required
                      value={guestData.partner?.firstName}
                      onChange={(e) => handlePartnerInputChange('firstName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <Input
                      id="partnerLastName"
                      required
                      value={guestData.partner?.lastName}
                      onChange={(e) => handlePartnerInputChange('lastName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Partner Suffix and Remove */}
                <div className="flex items-center">
                  <div className="flex-grow">
                    <Input
                      id="partnerSuffix"
                      value={guestData.partner?.suffix}
                      onChange={(e) => handlePartnerInputChange('suffix', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="Suffix"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePartner}
                    className="ml-2 flex-shrink-0 text-black"
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Partner Fields - Desktop Layout */}
            {showPartner && (
              <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4">
                {/* Partner Title */}
                <div className="col-span-2" style={{ paddingLeft: '4px' }}>
                  <select
                    value={guestData.partner?.title}
                    onChange={(e) => handlePartnerInputChange('title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm text-black"
                    style={{ paddingBottom: '11px' }}
                  >
                    {titleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Partner First Name */}
                <div className="col-span-4">
                  <Input
                    id="partnerFirstName"
                    required
                    value={guestData.partner?.firstName}
                    onChange={(e) => handlePartnerInputChange('firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    placeholder="First Name"
                  />
                </div>

                {/* Partner Last Name */}
                <div className="col-span-4">
                  <Input
                    id="partnerLastName"
                    required
                    value={guestData.partner?.lastName}
                    onChange={(e) => handlePartnerInputChange('lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    placeholder="Last Name"
                  />
                </div>

                {/* Partner Suffix and Remove Button */}
                <div className="col-span-2 flex items-center">
                  <div className="w-full">
                    <Input
                      id="partnerSuffix"
                      value={guestData.partner?.suffix}
                      onChange={(e) => handlePartnerInputChange('suffix', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePartner}
                    className="ml-2 flex-shrink-0 text-black"
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Children Fields */}
            {showPartner && (
              <Button
                type="button"
                variant="link"
                className="text-black text-xs sm:text-sm font-small underline hover:no-underline flex items-center gap-1"
                onClick={handleAddChild}
                style={{ marginTop: '0.5em', paddingLeft: '8px' }}
              >
                + Add Additional Guest
              </Button>
            )}

            {/* Children Fields - Mobile Layout */}
            {guestData?.children?.map((child, index) => (
              <div key={index} className="sm:hidden space-y-3">
                {/* Child Title */}
                <div>
                  <select
                    value={child.title}
                    onChange={(e) => handleChildInputChange(index, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs text-black"
                  >
                    {titleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Child First & Last Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      required
                      value={child.firstName}
                      onChange={(e) => handleChildInputChange(index, 'firstName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <Input
                      required
                      value={child.lastName}
                      onChange={(e) => handleChildInputChange(index, 'lastName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Child Suffix and Remove */}
                <div className="flex items-center">
                  <div className="flex-grow">
                    <Input
                      value={child.suffix}
                      onChange={(e) => handleChildInputChange(index, 'suffix', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      placeholder="Suffix"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChild(index)}
                    className="ml-2 flex-shrink-0 text-black"
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Children Fields - Desktop Layout */}
            {guestData?.children?.map((child, index) => (
              <div key={index} className="hidden sm:grid sm:grid-cols-12 sm:gap-4">
                <div className="col-span-2" style={{ paddingLeft: '4px' }}>
                  <select
                    value={child.title}
                    onChange={(e) => handleChildInputChange(index, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm text-black"
                    style={{ paddingBottom: '11px' }}
                  >
                    {titleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-4">
                  <Input
                    required
                    value={child.firstName}
                    onChange={(e) => handleChildInputChange(index, 'firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    placeholder="First Name"
                  />
                </div>

                <div className="col-span-4">
                  <Input
                    required
                    value={child.lastName}
                    onChange={(e) => handleChildInputChange(index, 'lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    placeholder="Last Name"
                  />
                </div>

                <div className="col-span-2 flex items-center">
                  <div className="w-full">
                    <Input
                      value={child.suffix}
                      onChange={(e) => handleChildInputChange(index, 'suffix', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChild(index)}
                    className="ml-2 flex-shrink-0 text-black"
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Mailing Address */}
            <div className="mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => setShowAddress(!showAddress)}
                className="w-full flex items-center justify-between py-2 text-left"
              >
                <span className="text-base sm:text-lg font-pop text-black">Mailing Address</span>
                <span className="text-2xl sm:text-3xl text-black font-pop" style={{
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {showAddress ? '-' : '+'}
                </span>
              </button>
              <hr style={{ borderTop: '1px solid gray' }}></hr>
            </div>

            {/* Collapsible Address Content */}
            <div
              className={`transition-all duration-200 overflow-hidden ${showAddress ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="space-y-4 pt-1 pl-1 py-1 pr-1">
                {/* Street 1 & 2 - Mobile */}
                <div className="sm:hidden space-y-3">
                  <div>
                    <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>STREET ADDRESS</label>
                    <Input
                      value={guestData.address.street1}
                      onChange={(e) => handleInputChange('address', {
                        ...guestData.address,
                        street1: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>UNIT / APT</label>
                    <Input
                      value={guestData.address.street2}
                      onChange={(e) => handleInputChange('address', {
                        ...guestData.address,
                        street2: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                </div>

                {/* Street 1 & 2 - Desktop */}
                <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>STREET ADDRESS</label>
                    <Input
                      value={guestData.address.street1}
                      onChange={(e) => handleInputChange('address', {
                        ...guestData.address,
                        street1: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>UNIT / APT</label>
                    <Input
                      value={guestData.address.street2}
                      onChange={(e) => handleInputChange('address', {
                        ...guestData.address,
                        street2: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                </div>

                {/* City, State, Zip - Mobile */}
                <div className="sm:hidden space-y-3">
                  <div>
                    <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>CITY</label>
                    <Input
                      value={guestData.address.city}
                      onChange={(e) => handleInputChange('address', {
                        ...guestData.address,
                        city: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>STATE</label>
                      <select
                        value={guestData.address.state}
                        onChange={(e) => handleInputChange('address', {
                          ...guestData.address,
                          state: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs text-black"
                      >
                        {stateOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>ZIP CODE</label>
                      <Input
                        value={guestData.address.zipCode}
                        onChange={(e) => handleInputChange('address', {
                          ...guestData.address,
                          zipCode: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* City, State, Zip - Desktop */}
                <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4">
                  <div className="col-span-6">
                    <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>CITY</label>
                    <Input
                      value={guestData.address.city}
                      onChange={(e) => handleInputChange('address', {
                        ...guestData.address,
                        city: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>STATE</label>
                    <select
                      value={guestData.address.state}
                      onChange={(e) => handleInputChange('address', {
                        ...guestData.address,
                        state: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm text-black"
                      style={{ paddingBottom: '11px' }}
                    >
                      {stateOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>ZIP CODE</label>
                    <Input
                      value={guestData.address.zipCode}
                      onChange={(e) => handleInputChange('address', {
                        ...guestData.address,
                        zipCode: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                </div>

                {/* Country - Mobile & Desktop */}
                <div>
                  <label className="block text-xs sm:text-sm font-pop text-black" style={{ lineHeight: '2em sm:lineHeight:2.25em', letterSpacing: '1px' }}>COUNTRY</label>
                  <select
                    value={guestData.address.country}
                    onChange={(e) => handleInputChange('address', {
                      ...guestData.address,
                      country: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded-md p-2 bg-white text-xs sm:text-sm text-black"
                  >
                    {countryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-4 sm:mt-8">
              <button
                type="button"
                onClick={() => setShowContact(!showContact)}
                className="w-full flex items-center justify-between py-2 text-left"
              >
                <span className="text-base sm:text-lg font-pop text-black">Email & Mobile</span>
                <span className="text-2xl sm:text-3xl font-pop text-black" style={{
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {showContact ? '-' : '+'}
                </span>
              </button>
              <hr style={{ borderTop: '1px solid gray' }}></hr>
            </div>

            {/* Collapsible Contact Content */}
            <div
              className={`transition-all duration-200 overflow-hidden ${showContact ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="space-y-4 pt-1 pl-1 py-1 pr-1">
                {/* Email & Phone - Mobile */}
                <div className="sm:hidden space-y-3">
                  <div>
                    <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>EMAIL</label>
                    <Input
                      value={guestData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-pop text-black" style={{ lineHeight: '2em', letterSpacing: '1px' }}>MOBILE</label>
                    <Input
                      value={guestData.phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      maxLength={14}
                    />
                  </div>
                </div>

                {/* Email & Phone - Desktop */}
                <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>EMAIL</label>
                    <Input
                      value={guestData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>MOBILE</label>
                    <Input
                      value={guestData.phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                      maxLength={14}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="sticky bottom-0 bg-[rgb(238, 238, 238)] px-2 sm:px-6 py-4 border-t" style={{ backgroundColor: 'rgb(238, 238, 238' }}>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
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
                  ADD GUEST
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestModal;
