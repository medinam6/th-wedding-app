import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    titleOptions,
    stateOptions,
    countryOptions,
    formatPhoneNumber,
    rsvpStatuses,
    getTotalPartySize
} from './guestListUtility';

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
    const [guestArray, setGuestArray] = useState([]);

    useEffect(() => {
        if (guest) {
            setGuestData({
                ...guest,
                address: guest.address || {
                    street1: '',
                    street2: '',
                    city: '',
                    state: '',
                    zipCode: ''
                },
                partner: guest.partner || null,
                children: guest.children || []
            });
            setShowPartner(!!guest.partner);
            setShowChildren(guest.children?.length > 0);
        }
    }, [guest]);

    useEffect(() => {
        setGuestArray(extractGuestsIntoArray(guestData));
    }, [guestData]);

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

    const handleChildInputChange = (index, field, value) => {
        setGuestData(prev => {
            const updatedChildren = [...prev.children];
            updatedChildren[index] = {
                ...updatedChildren[index],
                [field]: value,
            };
            return {
                ...prev,
                children: updatedChildren
            };
        });
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

    const extractGuestsIntoArray = (guestData) => {
        const guests = [
            {
                firstName: guestData.firstName,
                lastName: guestData.lastName,
                rsvpStatus: guestData.rsvpStatus
            }
        ]
        if (guestData.partner) {
            guests.push({
                firstName: guestData.partner.firstName,
                lastName: guestData.partner.lastName,
                rsvpStatus: guestData.partner.rsvpStatus
            })
        }
        if (guestData.children?.length) {
            guestData.children.forEach(child => {
                guests.push({
                    firstName: child.firstName,
                    lastName: child.lastName,
                    rsvpStatus: child.rsvpStatus
                })
            })
        }
        return guests;
    }

    console.log('Guest Array', guestArray);

    const handleRSVPChange = (index, value) => {
        setGuestArray((prevGuests) =>
            prevGuests.map((guest, i) =>
                i === index ? { ...guest, rsvpStatus: value } : guest
            )
        );
    };

    const reconstructGuestData = (originalGuestData, updatedGuestArray) => {
        const updatedGuestData = { ...originalGuestData };

        // Update main guest
        updatedGuestData.rsvpStatus = updatedGuestArray[0].rsvpStatus;

        // Update partner if exists
        if (updatedGuestData.partner) {
            updatedGuestData.partner.rsvpStatus = updatedGuestArray[1]?.rsvpStatus;
        }

        // Update children if exist
        if (updatedGuestData.children?.length) {
            updatedGuestData.children = updatedGuestData.children.map((child, index) => ({
                ...child,
                rsvpStatus: updatedGuestArray[index + (updatedGuestData.partner ? 2 : 1)]?.rsvpStatus
            }));
        }

        return updatedGuestData;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedGuestData = reconstructGuestData(guestData, guestArray);
        const totalPartySize = getTotalPartySize(updatedGuestData);
        const updatedData = {
            ...updatedGuestData,
            totalInParty: totalPartySize,
            lastUpdated: new Date().toISOString()
        };
        console.log("Submitting guest data:", updatedData);
        onSubmit(updatedData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-2xl rounded-lg fixed left-0 right-0 top-[70px] mx-auto transform-none"
                style={{
                    backgroundColor: 'rgb(238, 238, 238)',
                    padding: '1.5rem'
                }}
            >
                <DialogHeader>
                    <DialogTitle className="font-pop text-black">Edit Guest Details</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="guest-info" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="guest-info">Guest Info</TabsTrigger>
                            <TabsTrigger value="contact-info">Contact Info</TabsTrigger>
                            <TabsTrigger value="rsvp-status">RSVP Status</TabsTrigger>
                        </TabsList>
                        <br></br>
                        <hr style={{ borderTop: '1px solid gray', paddingBottom: '1px', paddingTop: '3px' }}></hr>
                        {/* Guest Info Tab */}
                        <TabsContent value="guest-info" className="space-y-4">
                            {/* Primary Guest */}
                            <div className="grid grid-cols-12 gap-4">
                                {/* Title */}
                                <div className="col-span-2" style={{ paddingLeft: '4px' }}>
                                    <label className="block text-sm font-pop text-black"
                                        style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>TITLE</label>
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
                                    <label className="block text-sm font-pop text-black"
                                        style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>
                                        FIRST NAME <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={guestData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        required
                                        placeholder="First Name"
                                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="col-span-4">
                                    <label className="block text-sm font-pop text-black"
                                        style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>
                                        LAST NAME <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={guestData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                                        placeholder="Last Name"
                                    />
                                </div>

                                {/* Suffix */}
                                <div className="col-span-2" style={{ paddingRight: '28px' }}>
                                    <label className="block text-sm font-pop text-black"
                                        style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>SUFFIX</label>
                                    <Input
                                        id="suffix"
                                        name="suffix"
                                        value={guestData.suffix}
                                        onChange={(e) => handleInputChange('suffix', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                                    />
                                </div>
                            </div>

                            {/* Add Plus One Button */}
                            {!showPartner && (
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-black font-small underline hover:no-underline flex items-center gap-1"
                                    onClick={handleAddPartner}
                                    style={{ marginTop: '0em', paddingLeft: '8px' }}
                                >
                                    + Add Plus One
                                </Button>
                            )}

                            {/* Partner Fields */}
                            {showPartner && (
                                <div className="grid grid-cols-12 gap-4">
                                    {/* Partner Title */}
                                    <div className="col-span-2" style={{ paddingLeft: '4px' }}>
                                        <select
                                            value={guestData.partner?.title || ''}
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
                                            value={guestData.partner?.firstName || ''}
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
                                            value={guestData.partner?.lastName || ''}
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
                                                value={guestData.partner?.suffix || ''}
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

                            {/* Add Additional Guest Button */}
                            {showPartner && (
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-black font-small underline hover:no-underline flex items-center gap-1"
                                    onClick={handleAddChild}
                                    style={{ marginTop: '0em', paddingLeft: '8px' }}
                                >
                                    + Add Additional Guest
                                </Button>
                            )}

                            {/* Additional Guests Fields */}
                            {guestData.children?.map((child, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4">
                                    {/* Child Title */}
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

                                    {/* Child First Name */}
                                    <div className="col-span-4">
                                        <Input
                                            required
                                            value={child.firstName}
                                            onChange={(e) => handleChildInputChange(index, 'firstName', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                                            placeholder="First Name"
                                        />
                                    </div>

                                    {/* Child Last Name */}
                                    <div className="col-span-4">
                                        <Input
                                            required
                                            value={child.lastName}
                                            onChange={(e) => handleChildInputChange(index, 'lastName', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                                            placeholder="Last Name"
                                        />
                                    </div>

                                    {/* Child Suffix and Remove Button */}
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
                        </TabsContent>

                        {/* Contact Info Tab */}
                        <TabsContent value="contact-info" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                                {/* Street 2 */}
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
                            {/* City */}
                            <div className="grid grid-cols-12 gap-4">
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
                                {/* State */}
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
                                {/* Zip Code */}
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
                            {/* Country */}
                            <div className="col-span-12">
                                <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>COUNTRY</label>
                                <select
                                    value={guestData.address.country}
                                    onChange={(e) => handleInputChange('address', {
                                        ...guestData.address,
                                        country: e.target.value
                                    })}
                                    className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm text-black"
                                    style={{ paddingBottom: '11px' }}
                                >
                                    {countryOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-pop text-black" style={{ lineHeight: '2.25em', letterSpacing: '1px' }}>EMAIL</label>
                                    <Input
                                        value={guestData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                                    />
                                </div>
                                {/* Phone Number */}
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
                        </TabsContent>

                        {/* RSVP Status Tab */}
                        <TabsContent value="rsvp-status" className="space-y-4">
                            <div className="space-y-4 pt-1 pl-8 py-1 pr-8">
                                <div className="grid grid-cols-4 gap-4">
                                    <label className="block text-sm font-pop text-black col-span-3"
                                        style={{
                                            letterSpacing: '1px',
                                        }}>
                                        GUESTS
                                    </label>
                                    <label className="block text-sm font-pop text-black col-span-1"
                                        style={{
                                            letterSpacing: '1px'
                                        }}>
                                        RSVP
                                    </label>

                                    {guestArray.map((guest, index) => (
                                        <React.Fragment key={index}>
                                            {/* Guest Name */}
                                            <div className="col-span-3 pt-2">
                                                <span className="text-sm font-pop text-gray-500">{index + 1}. </span>
                                                <span className="font-pop text-gray-500">{guest.firstName} {guest.lastName}</span>
                                            </div>

                                            {/* RSVP Status Dropdown */}
                                            <div className="col-span-1">
                                                <select
                                                    value={guest.rsvpStatus}
                                                    onChange={(e) => handleRSVPChange(index, e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm text-black"
                                                >
                                                    {rsvpStatuses.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="col-span-12">
                                    <label className="block text-sm font-pop text-black"
                                        style={{
                                            lineHeight: '2.25em',
                                            letterSpacing: '1px'
                                        }}>
                                        Are there any dietary restrictions that we should know of?
                                    </label>
                                    <Input
                                        value={guestData.diet}
                                        onChange={(e) => handleInputChange('diet', {
                                            ...guestData.diet,
                                            diet: e.target.value
                                        })}
                                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <label className="block text-sm font-pop text-black"
                                        style={{
                                            lineHeight: '2.25em',
                                            letterSpacing: '1px'
                                        }}>
                                        Any song requests for the wedding reception?
                                    </label>
                                    <Input
                                        value={guestData.song}
                                        onChange={(e) => handleInputChange('song', {
                                            ...guestData.song,
                                            ShoppingBagIcon: e.target.value
                                        })}
                                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black text-black"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-6">
                        <div className="sticky bottom-0 bg-[rgb(238, 238, 238)] px-6 py-4 border-t"
                            style={{ backgroundColor: 'rgb(238, 238, 238' }}>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="rounded-md border border-black bg-white px-4 py-2 text-sm font-pop text-black shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                    style={{ letterSpacing: '1px' }}>
                                    CANCEL
                                </Button>
                                <Button
                                    type="submit"
                                    className="rounded-md border border-black bg-black px-4 py-2 text-sm font-pop text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                    style={{ letterSpacing: '1px' }}>SAVE CHANGES</Button>
                            </div>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
};

export default EditGuestModal;
