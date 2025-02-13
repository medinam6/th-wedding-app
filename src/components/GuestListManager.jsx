import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download, Edit, Trash2, UserPlus } from 'lucide-react';
import AddGuestModal from './AddGuestModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { formatPhoneNumber } from './guestListUtility';

const GuestListManager = () => {
  const [guests, setGuests] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuest, setEditingGuest] = useState(null);

  const fetchGuests = async () => {
    try {
      const response = await fetch('api/guestList');
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      // Filter out soft-deleted guests
      const activeGuests = Array.isArray(data) ? data.filter(guest => !guest.isDeleted) : [];
      setGuests(activeGuests);
    } catch (error) {
      console.error('Detailed fetch error', error);
      setGuests([]);
    }
  };

  const handleAddGuest = async (guestData) => {
    try {
      const response = await fetch('/api/guestList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData)
      });
      if (response.ok) {
        fetchGuests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  // Update existing guest
  const handleUpdateGuest = async (guestData) => {
    try {
      const response = await fetch('/api/guestList', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData)
      });
      if (response.ok) {
        fetchGuests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating guest:', error);
    }
  };

  // Soft Delete Guest
  const handleDeleteGuest = async (id) => {
    try {
      const response = await fetch(`/api/guestList`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isDeleted: true,
          lastUpdated: new Date().toISOString(),
        })
      });
      if (response.ok) {
        fetchGuests(); // Refresh the list
        setGuestToDelete(null); // Clear the selected guest
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };


  function formatGuestNamesInTable(guest) {
    const names = [];

    // Add guest's name
    if (guest.firstName || guest.lastName) {
      names.push(`${guest.title || ''} ${guest.firstName || ''} ${guest.lastName || ''} ${guest.suffix || ''}`.trim());
    }

    // Add partner's name if it exists
    if (guest.partner?.firstName || guest.partner?.lastName) {
      names.push(`${guest.partner.title || ''} ${guest.partner.firstName || ''} ${guest.partner.lastName || ''}`.trim());
    }

    // Add children's names if they exist
    if (Array.isArray(guest.children)) {
      guest.children.forEach(child => {
        if (child.firstName || child.lastName) {
          names.push(`${child.firstName || ''} ${child.lastName || ''}`.trim());
        }
      });
    }

    // Return formatted names as JSX
    return (
      <>
        {names.map((name, index) => (
          <span key={index}>
            {name}
            <br />
          </span>
        ))}
      </>
    );
  }

  function formatGuestAddressInTable(address) {
    if (!address) {
      return <span className="text-red-500">No Address</span>;
    }

    const { street1, street2, city, state, zipCode } = address;

    return (
      <>
        {street1 && <span>{street1}<br /></span>}
        {street2 && <span>{street2}<br /></span>}
        {(city || state || zipCode) && (
          <span>
            {city && `${city}, `}
            {state && `${state} `}
            {zipCode}
          </span>
        )}
      </>
    );
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const shortDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    return shortDate;
  }

  const filteredGuests = guests.filter(guest =>
    `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${guest.partner?.firstName || ''} ${guest.partner?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGuests = guests.reduce((sum, guest) => sum + guest.totalInParty, 0);

  // Fetch guest list on component mount
  useEffect(() => {
    const fetchGuestList = async () => {
      try {
        const response = await fetch('/api/guestList');
        console.log('API Response:', response);

        if (!response.ok) {
          // Try to read the error details
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        setGuests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Detailed fetch error:', error);
        setGuests([]);
      }
    };

    fetchGuestList();
  }, []);
  console.log('Guests', guests);
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="items-center justify-between">
          <CardTitle className="font-pop text-white">Guest List Management</CardTitle>
          <div className="flex gap-4">
            <Button
              className="text-white"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Upload className="w-4 h-4 mr-2 text-white font-pop" />
              Upload CSV
            </Button>
            <Button onClick={''} className="text-white">
              <Download className="w-4 h-4 mr-2 text-white font-pop" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full font-pop text-white"
                />
              </div>
              <Button onClick={() => setIsAddModalOpen(true)} className="text-white">
                <UserPlus className="w-4 h-4 mr-2 text-white font-pop" />
                Add Guests
              </Button>
            </div>
          </div>

          {/* {fileName && (
              <p className="text-sm text-gray-500 font-pop text-white">Selected file: {fileName}</p>
            )} */}
          <br />
          {guests.length === 0 ? (
            <div className="text-center py-8 text-white font-pop">
              <p>No guest list uploaded yet.</p>
              <p className="text-sm mt-2">Upload a CSV file to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <p className="font-pop text-white">Guest List Loaded: {totalGuests} Guests | {guests.length} Groups</p>
              <br />
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2 text-white font-pop">Name</th>
                    <th className="text-left p-2 text-white font-pop">No. in Party</th>
                    <th className="text-left p-2 text-white font-pop">Email & Phone</th>
                    <th className="text-left p-2 text-white font-pop">Address</th>
                    <th className="text-left p-2 text-white font-pop">RSVP Status</th>
                    <th className="text-left p-2 text-white font-pop">Last Updated</th>
                    <th className="text-left p-2 text-white font-pop">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map(guest => (
                    <tr key={guest.id} className="border-b border-gray-200">
                      <td className="p-2 divide-white font-pop text-white">
                        {formatGuestNamesInTable(guest)}
                      </td>
                      <td className="p-2 font-pop text-white">{guest.totalInParty}</td>
                      <td className="p-2 font-pop">
                        <span className={guest?.email ? "text-white" : "text-red-500"}>
                          {guest?.email || 'No Email'}
                        </span>
                        <br />
                        <span className={guest?.phoneNumber ? "text-white" : "text-red-500"}>
                          {guest?.phoneNumber ? formatPhoneNumber(guest.phoneNumber) : "No Phone Number"}
                        </span>
                      </td>
                      <td className="p-2 font-pop text-white">
                        {formatGuestAddressInTable(guest.address)}
                      </td>
                      <td className="p-2 font-pop text-white">{guest.rsvpStatus || 'Pending'}</td>
                      <td className="p-2 font-pop text-white">{formatDate(guest.lastUpdated) || '-'}</td>
                      <td className="p-2 font-pop text-white">
                        <Button
                          size="sm"
                          onClick={() => setEditingGuest(guest.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setGuestToDelete(guest);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent >
      </Card >
      <AddGuestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddGuest}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setGuestToDelete(null);
        }}
        onConfirm={() => {
          handleDeleteGuest(guestToDelete?._id);
          setIsDeleteModalOpen(false);
        }}
        guestName={guestToDelete ? `${guestToDelete.firstName} ${guestToDelete.lastName}` : ''}
      />
    </div >
  );
};

export default GuestListManager;
