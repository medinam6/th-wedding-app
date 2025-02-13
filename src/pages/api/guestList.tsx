import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db('th-wedding');
    const collection = db.collection('guestList');

    switch (req.method) {
        case 'GET':
            try {
                const guests = await collection.find({}).toArray();
                res.status(200).json(guests);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch guests' });
            }
            break;

        case 'POST':
            try {
                const newGuest = req.body;
                const result = await collection.insertOne(newGuest);
                res.status(201).json(result);
            } catch (error) {
                res.status(500).json({ error: 'Failed to add guest' });
            }
            break;

        case 'PUT':
            try {
                const { id, ...updateData } = req.body;
                const result = await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );
                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({ error: 'Failed to update guest' });
            }
            break;

        case 'DELETE':
            try {
                const { id } = req.query;
                const result = await collection.deleteOne({
                    _id: new ObjectId(id as string)
                });
                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete guest' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
