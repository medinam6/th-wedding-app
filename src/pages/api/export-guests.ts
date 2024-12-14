import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'guests.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Read the JSON file
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const guests = JSON.parse(data);

        // Convert guests to CSV format
        const headers = [
            'Total in Party',
            'Title',
            'First Name',
            'Last Name',
            'Suffix',
            'Partner Title',
            'Partner First Name',
            'Partner Last Name',
            'Partner Suffix',
            'Street Address',
            'Street Address (line 2)',
            'City',
            'State / Region',
            'Zip / Postal Code',
            'Country',
            'Child 1 First Name',
            'Child 1 Last Name',
            'Child 2 First Name',
            'Child 2 Last Name',
            'Child 3 First Name',
            'Child 3 Last Name',
            'RSVP Status',
            'Total Attending'
        ].join(',');

        const rows = guests.map((guest: any) => {
            return [
                guest.totalInParty,
                guest.title || '',
                guest.firstName,
                guest.lastName,
                guest.suffix || '',
                guest.partner?.title || '',
                guest.partner?.firstName || '',
                guest.partner?.lastName || '',
                guest.partner?.suffix || '',
                guest.address.street1,
                guest.address.street2 || '',
                guest.address.city,
                guest.address.state,
                guest.address.zipCode,
                guest.address.country,
                guest.children[0]?.firstName || '',
                guest.children[0]?.lastName || '',
                guest.children[1]?.firstName || '',
                guest.children[1]?.lastName || '',
                guest.children[2]?.firstName || '',
                guest.children[2]?.lastName || '',
                guest.rsvp.status || '',
                guest.rsvp.totalAttending || ''
            ].map(value => `"${value}"`).join(',');
        });

        const csv = [headers, ...rows].join('\n');

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=guest-list-export.csv');

        res.status(200).send(csv);
    } catch (error) {
        console.error('Error exporting guests:', error);
        res.status(500).json({ error: 'Failed to export guest list' });
    }
}
