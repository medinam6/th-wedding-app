export const exportGuestListToCSV = (guests) => {
    try {
        // Format each guest into a flat structure
        const formattedGuests = guests.map(guest => ({
            'Total in Party': guest.totalInParty,
            // Main Guest
            'Title': guest.title || '',
            'First Name': guest.firstName || '',
            'Last Name': guest.lastName || '',
            'Suffix': guest.suffix || '' || '',
            'RSVP Status': guest.rsvpStatus || '',
            'Entree': guest.entree || '',
            // Partner
            'Partner Title': guest.partner?.title || '',
            'Partner First Name': guest.partner?.firstName || '',
            'Partner Last Name': guest.partner?.lastName || '',
            'Partner Suffix': guest.partner?.suffix || '',
            'Partner RSVP': guest.partner?.rsvpStatus || '',
            'Partner Entree': guest.partner?.entree || '',
            // Contact
            'Email': guest.email || '',
            'Phone Number': guest.phoneNumber || '',
            'Street Address': guest.address.street1 || '',
            'Street Address (line 2)': guest.address.street2 || '',
            'City': guest.address.city || '',
            'State': guest.address.state || '',
            'Zip Code': guest.address.zipCode || '',
            'Country': guest.address.country || '',
            // Child
            'Children': guest.children ? guest.children.map(child =>
                `${child.firstName} ${child.lastName} (${child.rsvpStatus} - ${child.entree})`).join('; ') : '',
            'Song Request': guest.song || '',
        }));

        // Get headers from the first row
        const headers = Object.keys(formattedGuests[0]);

        // Convert to CSV rows
        const csvRows = [
            // Header row
            headers.join(','),
            // Data rows
            ...formattedGuests.map(row =>
                headers.map(header => {
                    const cell = row[header]?.toString() || '';
                    // Escape quotes and wrap in quotes to handle commas and special characters
                    return `"${cell.replace(/"/g, '""')}"`;
                }).join(',')
            )
        ];

        // Join rows with newlines
        const csvString = csvRows.join('\n');

        // Create and trigger download
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        link.download = `guest-list-${date}.csv`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error exporting guest list:', error);
        return false;
    }
};

export default exportGuestListToCSV;
