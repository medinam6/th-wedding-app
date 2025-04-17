import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'guests.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  switch (req.method) {
    case 'PATCH':
      try {
        const data = await fs.readFile(DATA_FILE, 'utf8')
        const guests = JSON.parse(data)
        const guestIndex = guests.findIndex(
          (g: { id: string | string[] | undefined }) => g.id === id
        )

        if (guestIndex === -1) {
          return res.status(404).json({ error: 'Guest not found' })
        }

        const updatedGuest = {
          ...guests[guestIndex],
          ...req.body,
          rsvp: {
            ...guests[guestIndex].rsvp,
            lastUpdated: new Date().toISOString(),
            lastUpdatedBy: 'admin',
          },
        }

        guests[guestIndex] = updatedGuest
        await fs.writeFile(DATA_FILE, JSON.stringify(guests, null, 2))

        res.status(200).json(updatedGuest)
      } catch (error) {
        console.error('Error updating guest:', error)
        res.status(500).json({ error: 'Failed to update guest' })
      }
      break

    default:
      res.setHeader('Allow', ['PATCH'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
