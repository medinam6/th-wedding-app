import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('th-wedding')
  const collection = db.collection('guestList')
  console.log('Req', req)

  switch (req.method) {
    case 'GET':
      try {
        // Only fetch guests that aren't deleted
        const guests = await collection
          .find({
            isDeleted: { $ne: true },
          })
          .toArray()
        res.status(200).json(guests)
      } catch (error) {
        console.error('Error fetching guests:', error)
        res.status(500).json({ error: 'Failed to fetch guests' })
      }
      break

    case 'POST':
      try {
        const newGuest = {
          ...req.body,
          isDeleted: false, // Set default value for new guests
        }
        const result = await collection.insertOne(newGuest)
        res.status(201).json(result)
      } catch (error) {
        console.error('Error adding guest:', error)
        res.status(500).json({ error: 'Failed to add guest' })
      }
      break

    case 'PUT':
      try {
        const { id, ...updateData } = req.body
        console.log('Request body:', req.body)
        console.log('Update Data:', updateData)
        console.log('ID:', id)

        if (!id) {
          return res.status(400).json({ error: 'Missing ID parameter' })
        }

        // Remove _id from the update data if it exists
        const { _id, ...cleanUpdateData } = updateData
        void _id // Explicitly ignore the _id value

        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: cleanUpdateData }
        )

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Guest not found' })
        }

        res.status(200).json(result)
      } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({ error: 'Failed to update guest: ' + error.message })
      }
      break

    case 'PATCH':
      try {
        const { id, isDeleted } = req.body
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { isDeleted } }
        )
        res.status(200).json(result)
      } catch (error) {
        console.error('Error updating guest deletion status:', error)
        res.status(500).json({ error: 'Failed to update guest deletion status' })
      }
      break

    case 'DELETE':
      // Keep the DELETE method for potential hard delete in the future
      try {
        const { id } = req.query
        const result = await collection.deleteOne({
          _id: new ObjectId(id),
        })
        res.status(200).json(result)
      } catch (error) {
        console.error('Error deleting guest:', error)
        res.status(500).json({ error: 'Failed to delete guest' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
