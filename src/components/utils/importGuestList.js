// utils/guestImport.js
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Transform imported data into the correct guest format
const transformToGuestFormat = row => {
  try {
    const columns = Object.keys(row)

    const childColumns = columns.filter(
      col => col.startsWith('Child ') && col.endsWith('First Name')
    )

    childColumns.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0])
      const numB = parseInt(b.match(/\d+/)[0])
      return numA - numB
    })

    const children = childColumns
      .map(firstNameCol => {
        const childNumber = firstNameCol.match(/\d+/)[0]
        const lastNameCol = `Child ${childNumber} Last Name`
        const firstName = row[firstNameCol]
        const lastName = row[lastNameCol]

        // Only add child if first name exists
        if (firstName) {
          return {
            firstName: firstName.trim(),
            lastName: lastName ? lastName.trim() : '',
            title: '',
            suffix: '',
            rsvpStatus: 'No Response',
          }
        }
        return null
      })
      .filter(Boolean) // Remove null entries

    return {
      totalInParty: calculateTotalParty(row, children),
      firstName: row['First Name'],
      lastName: row['Last Name'],
      title: row['Title'] || '',
      suffix: row['Suffix'] || '',
      rsvpStatus: 'No Response',
      partner: row['Partner First Name']
        ? {
            firstName: row['Partner First Name'],
            lastName: row['Partner Last Name'] || '',
            title: row['Partner Title'] || '',
            suffix: row['Partner Suffix'] || '',
            rsvpStatus: 'No Response',
          }
        : null,
      email: row['Email Address'] || '',
      phoneNumber: row['Phone Number'] || '',
      address: {
        street1: row['Street Address'],
        street2: row['Street Address (line 2)'],
        city: row['City'] || '',
        state: row['State'] || '',
        zipCode: row['Zip Code'] || '',
        country: row['Country'] || '',
      },
      children: children,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error transforming row:', row, error)
    return null
  }
}

const calculateTotalParty = (row, children) => {
  let total = 1 // Main guest

  // Add partner if exists
  if (row['Partner First Name']) {
    total += 1
  }

  // Add children
  total += children.length

  return total
}

// Validate required fields
const validateGuest = guest => {
  const required = ['firstName', 'lastName']
  return required.every(field => guest[field] && guest[field].trim() !== '')
}

// Parse CSV file
const parseCSV = file => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => {
        const transformedGuests = results.data
          .map(transformToGuestFormat)
          .filter(guest => guest && validateGuest(guest))

        resolve({
          guests: transformedGuests,
          errors: results.errors,
          totalRows: results.data.length,
          successfulRows: transformedGuests.length,
        })
      },
      error: error => reject(error),
    })
  })
}

// Parse Excel file
const parseExcel = async file => {
  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, {
      type: 'array',
      cellDates: true,
      cellNF: false,
      cellText: false,
    })

    // Get first sheet
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    // Get headers from first row
    const headers = jsonData[0]

    // Convert to array of objects with headers
    const rows = jsonData.slice(1).map(row => {
      const obj = {}
      headers.forEach((header, index) => {
        obj[header] = row[index]
      })
      return obj
    })

    // Transform and validate
    const transformedGuests = rows
      .map(transformToGuestFormat)
      .filter(guest => guest && validateGuest(guest))

    return {
      guests: transformedGuests,
      errors: [],
      totalRows: rows.length,
      successfulRows: transformedGuests.length,
    }
  } catch (error) {
    throw new Error(`Error parsing Excel file: ${error.message}`)
  }
}

// Main import function
export const importGuests = async file => {
  try {
    const fileType = file.name.split('.').pop().toLowerCase()
    let result

    if (fileType === 'csv') {
      result = await parseCSV(file)
    } else if (['xlsx', 'xls'].includes(fileType)) {
      result = await parseExcel(file)
    } else {
      throw new Error('Unsupported file type. Please upload a CSV or Excel file.')
    }

    return {
      success: true,
      ...result,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      guests: [],
      totalRows: 0,
      successfulRows: 0,
    }
  }
}

export default importGuests
