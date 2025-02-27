import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download, Search, Edit, Save } from 'lucide-react';

const GuestListManager = () => {
  const [guests, setGuests] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuest, setEditingGuest] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name);
    setFileName(file.name);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending request to /api/upload-guests');

      const response = await fetch('/api/upload-guests', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error:', errorData);
        throw new Error('Upload failed: ' + (errorData.error || 'Unknown error'));
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      setGuests(data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export-guests');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'guest-list-export.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting guest list:', error);
    }
  };

  // const handleUpdateGuest = async (guestId, updates) => {
  //   try {
  //     const response = await fetch(`/api/guests/${guestId}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updates),
  //     });

  //     if (!response.ok) throw new Error('Update failed');

  //     const updatedGuest = await response.json();
  //     setGuests(guests.map(g => g.id === guestId ? updatedGuest : g));
  //     setEditingGuest(null);
  //   } catch (error) {
  //     console.error('Error updating guest:', error);
  //   }
  // };

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

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return "No phone number";

    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      // If 11 digits and starts with '1', remove the leading '1'
      return formatPhoneNumber(cleaned.slice(1));
    }

    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    // Invalid cases
    return phoneNumber;
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
        const response = await fetch('/api/guests');
        const data = await response.json();
        setGuests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching guest list:', error);
        setGuests([]);
      }
    };

    fetchGuestList();
  }, []);
  console.log('Guests', guests);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-pop text-white">Guest List Management</CardTitle>
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

              <input
                type="file"
                id="fileInput"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <Button
                className="text-white"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <Upload className="w-4 h-4 mr-2 text-white font-pop" />
                Upload CSV
              </Button>

              <Button onClick={handleExport} className="text-white">
                <Download className="w-4 h-4 mr-2 text-white font-pop" />
                Export CSV
              </Button>
            </div>

            {fileName && (
              <p className="text-sm text-gray-500 font-pop text-white">Selected file: {fileName}</p>
            )}

            {guests.length === 0 ? (
              <div className="text-center py-8 text-white font-pop">
                <p>No guest list uploaded yet.</p>
                <p className="text-sm mt-2">Upload a CSV file to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <p className="font-pop text-white">Guest List Loaded: {totalGuests} Guests | {guests.length} Groups</p>
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
                        <td className="p-2 font-pop text-white">{guest.rsvp.status || 'Pending'}</td>
                        <td className="p-2 font-pop text-white">{guest.rsvp.lastUpdated || '-'}</td>
                        <td className="p-2 font-pop text-white">
                          {editingGuest === guest.id ? (
                            <Button
                              size="sm"
                              onClick={() => setEditingGuest(null)}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setEditingGuest(guest.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestListManager;
