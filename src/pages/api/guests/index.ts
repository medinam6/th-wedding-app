import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'guests.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        // Check if file exists
        try {
          await fs.access(DATA_FILE)
        } catch {
          // If file doesn't exist, return empty array instead of error
          return res.status(200).json([])
        }

        const data = await fs.readFile(DATA_FILE, 'utf8')
        const guests = JSON.parse(data)

        // Ensure we always return an array
        res.status(200).json(Array.isArray(guests) ? guests : [])
      } catch (error) {
        console.error('Error in guests API:', error)
        // Return empty array instead of error
        res.status(200).json([])
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
