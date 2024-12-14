import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import multiparty from 'multiparty';
import { parse } from 'csv-parse';
import { v4 as uuidv4 } from 'uuid';

interface CSVRecord {
    'Total in Party': string;
    'Title'?: string;
    'First Name': string;
    'Last Name': string;
    'Suffix'?: string;
    'Partner Title'?: string;
    'Partner First Name'?: string;
    'Partner Last Name'?: string;
    'Partner Suffix'?: string;
    'Email Address'?: string;
    'Phone Number'?: string;
    'Street Address'?: string;
    'Street Address (line 2)'?: string;
    'City'?: string;
    'State / Region'?: string;
    'Zip / Postal Code'?: string;
    'Country'?: string;
    'Child 1 First Name'?: string;
    'Child 1 Last Name'?: string;
    'Child 2 First Name'?: string;
    'Child 2 Last Name'?: string;
    'Child 3 First Name'?: string;
    'Child 3 Last Name'?: string;
    'RSVP?'?: string;
    'Total Attending'?: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'guests.json');

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse the multipart form data
        const form = new multiparty.Form();

        const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        // Get the uploaded file
        const file = files.file?.[0];
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File received:', file.originalFilename);

        // Read the file content
        const fileContent = await fs.readFile(file.path, 'utf-8');

        // Parse CSV
        const records: CSVRecord[] = await new Promise((resolve, reject) => {
            parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            }, (err, records) => {
                if (err) reject(err);
                else resolve(records);
            });
        });

        console.log('Parsed records:', records);

        // Process the records into guest format
        const guests = records.map((record: any) => ({
            id: uuidv4(),
            partyId: uuidv4(),
            totalInParty: parseInt(record['Total in Party']) || 1,
            firstName: record['First Name'],
            lastName: record['Last Name'],
            title: record['Title'] || undefined,
            suffix: record['Suffix'] || undefined,
            partner: record['Partner First Name'] ? {
                title: record['Partner Title'] || undefined,
                firstName: record['Partner First Name'],
                lastName: record['Partner Last Name'],
                suffix: record['Partner Suffix'] || undefined,
            } : undefined,
            email: record['Email Address'],
            phoneNumber: record['Phone Number'],
            address: {
                street1: record['Street Address'],
                street2: record['Street Address (line 2)'] || undefined,
                city: record['City'],
                state: record['State / Region'],
                zipCode: record['Zip / Postal Code'],
                country: record['Country'],
            },
            children: [
                ...(record['Child 1 First Name'] ? [{
                    firstName: record['Child 1 First Name'],
                    lastName: record['Child 1 Last Name'],
                }] : []),
                ...(record['Child 2 First Name'] ? [{
                    firstName: record['Child 2 First Name'],
                    lastName: record['Child 2 Last Name'],
                }] : []),
                ...(record['Child 3 First Name'] ? [{
                    firstName: record['Child 3 First Name'],
                    lastName: record['Child 3 Last Name'],
                }] : []),
            ],
            rsvp: {
                status: undefined,
                totalAttending: undefined,
                lastUpdated: undefined,
                lastUpdatedBy: undefined,
            },
        }));

        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'data');
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir);
        }

        // Save to file
        await fs.writeFile(DATA_FILE, JSON.stringify(guests, null, 2));

        console.log('Saved guests:', guests.length);
        res.status(200).json(guests);

    } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).json({ error: 'Failed to process CSV file' });
    }
}
