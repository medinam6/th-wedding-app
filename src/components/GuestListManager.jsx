import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download, Edit, Trash2, UserPlus, Check, X, Minus } from 'lucide-react';
import AddGuestModal from './AddGuestModal';
import EditGuestModal from './EditGuestModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import {
  formatPhoneNumber,
  formatGuestNamesInTable,
  countRsvpStatuses,
  sortGuestList
} from './utils/guestListUtility';
import exportGuestListToCSV from './utils/exportGuestList';
import importGuests from './utils/importGuestList'

const GuestListManager = () => {
  const [guests, setGuests] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

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
      setGuests(sortGuestList(activeGuests));
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
    console.log("Sending data to API:", guestData);
    try {
      const response = await fetch('/api/guestList', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: guestData._id,
          ...guestData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update guest');
      }

      console.log("Guest updated successfully");
      fetchGuests(); // Refresh the list
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await importGuests(file);

      if (result.success) {
        console.log(`Processing ${result.successfulRows} rows...`);

        let successCount = 0;
        let failedGuests = [];

        for (const guest of result.guests) {
          try {
            await handleAddGuest(guest);
            successCount++;
          } catch (error) {
            failedGuests.push({
              name: `${guest.firstName} ${guest.lastName}`,
              error: error.message
            });
            console.error('Error adding guest:', guest, error);
          }
        }

        let message = `Import complete:\n${successCount} guests added successfully`;
        if (failedGuests.length > 0) {
          message += `\n${failedGuests.length} guests failed to add:`;
          failedGuests.forEach(guest => {
            message += `\n- ${guest.name}`;
          });
        }

        alert(message);
      } else {
        alert(`Error importing guests: ${result.error}`);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      alert('There was an error importing the file. Please try again.');
    }
  };


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

  // Need to move to utlity file
  const getRSVPStatuses = (guest) => {
    const statuses = [];

    if (guest.rsvpStatus) {
      statuses.push(guest.rsvpStatus);
    }

    if (guest.partner?.rsvpStatus) {
      statuses.push(guest.partner.rsvpStatus);
    }

    if (Array.isArray(guest.children)) {
      guest.children.forEach(child => {
        if (child.rsvpStatus) {
          statuses.push(child.rsvpStatus);
        }
      });
    }

    return statuses;
  };

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

  const sortedGuests = sortGuestList(filteredGuests);

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
  
  return (
    <div className="space-y-8">
      <Card className="min-w-[1000px] w-full max-w-[1200px]">
        <CardHeader className="items-center justify-between">
          <CardTitle className="font-pop text-3xl text-white">Guest List Management</CardTitle>
          <div className="flex gap-4">
            <>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                className="text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2 text-white font-pop" />
                Upload CSV
              </Button>
            </>
            <Button
              className="text-white"
              onClick={() => {
                const downloadSuccessful = exportGuestListToCSV(sortedGuests);
                if (!downloadSuccessful) {
                  alert('There was an error exporting the guest list. Please try again.');
                }
              }} >
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
          <br />
          {guests.length === 0 ? (
            <div className="text-center py-8 text-white font-pop">
              <p>No guest list uploaded yet.</p>
              <p className="text-sm mt-2">Add a Guest or Upload a CSV file to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center w-full">
                <p className="font-pop text-white">
                  Guest List: {totalGuests} Guests | {guests.length} Groups
                </p>
                <div className="text-right">{countRsvpStatuses(guests)}</div>
              </div>
              <br></br>
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
                  {sortedGuests.map(guest => (
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
                      <td className="font-pop text-white text-center">
                        <div className="flex flex-col items-center">
                          {getRSVPStatuses(guest).map((status, index) => (
                            <div key={index}>
                              {status === "Attending" && <Check className="w-6 h-6 text-green-500" />}
                              {status === "Declined" && <X className="w-6 h-6 text-red-500" />}
                              {status === ("No Response" || "") && <Minus className="w-6 h-6 text-white" />}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 font-pop text-white">{formatDate(guest.lastUpdated) || '-'}</td>
                      <td className="p-2 font-pop text-white">
                        <Button
                          size="sm"
                          onClick={() => {
                            const guestToEdit = guests.find(g => g._id === guest._id);
                            setEditingGuest(guestToEdit);
                            setIsEditModalOpen(true);
                          }}
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
      <EditGuestModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGuest(null);
        }}
        onSubmit={handleUpdateGuest}
        guest={editingGuest}
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
