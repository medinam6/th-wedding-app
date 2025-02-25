export const formatPhoneNumber = (value) => {
  if (!value) return ''; // Handle empty input gracefully

  // Remove all non-numeric characters
  console.log('Value', value);
  const phoneNumber = String(value).replace(/\D/g, '');

  // Format the number based on length
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else {
    // If it's longer than 10 digits, format it as an international number
    return `+${phoneNumber[0]} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
  }
};

export const getTotalPartySize = (guestData) => {
  let size = 1;
  if (guestData.partner) size++;
  if (guestData.children && guestData.children.length > 0) {
    size += guestData.children.length;
  }
  return size;
}

export const countRsvpStatuses = (allGuests) => {
  const rsvpCounts = {
    attending: 0,
    declined: 0,
    noResponse: 0
  };

  allGuests.forEach(guest => {
    // Count primary guest's RSVP status
    if (guest.rsvpStatus === "Attending") {
      rsvpCounts.attending++;
    } else if (guest.rsvpStatus === "Declined") {
      rsvpCounts.declined++;
    } else {
      rsvpCounts.noResponse++;
    }

    // Count partner's RSVP status (if they exist)
    if (guest.partner && guest.partner.rsvpStatus) {
      if (guest.partner.rsvpStatus === "Attending") {
        rsvpCounts.attending++;
      } else if (guest.partner.rsvpStatus === "Declined") {
        rsvpCounts.declined++;
      } else {
        rsvpCounts.noResponse++;
      }
    }

    // Count children's RSVP statuses (if they exist)
    if (guest.children && Array.isArray(guest.children)) {
      guest.children.forEach(child => {
        if (child.rsvpStatus === "Attending") {
          rsvpCounts.attending++;
        } else if (child.rsvpStatus === "Declined") {
          rsvpCounts.declined++;
        } else {
          rsvpCounts.noResponse++;
        }
      });
    }
  });

  // If all guests have not responded, return null
  if (rsvpCounts.attending === 0 && rsvpCounts.declined === 0) {
    return null;
  }

  function pluralize(count, status) {
    if (status === 'No Response') {
      if (count === 1) {
        return "Has Not Responded"
      } else {
        return "Have Not Responded"
      }
    } else {
      if (count === 1) {
        return 'Guest'
      } else {
        return 'Guests'
      }
    }
  }

  return (
    <p>
      {<><span className="font-pop text-xl text-green-500">{rsvpCounts.attending} </span><span className="font-pop text-xs text-white">{pluralize(rsvpCounts.attending, 'Attending')} Attending  &nbsp;&nbsp;</span></>}
      {<><span className="font-pop text-xl text-red-500">{rsvpCounts.declined} </span><span className="font-pop text-xs text-white">{pluralize(rsvpCounts.declined, 'Declined')} Declined  &nbsp;&nbsp;</span></>}
      {rsvpCounts.noResponse > 0 && <><span className="font-pop text-xl text-white">{rsvpCounts.noResponse} </span><span className="font-pop text-xs text-white">{pluralize(rsvpCounts.noResponse, 'No Response')}  &nbsp;&nbsp;</span></>}
    </p>
  );
}

export const weddingDetails = () => {
  const startTime = 'Monday, April, 20, 2026 7:00 PM';
  const endTime = 'Sunday, Month, XX, XXXX 12:00 AM';
  const weddingAddress = '123 South Main Street, Las Vegas, Nevada 89XXX';
  const dressCode = 'Semi-Formal: Tuxes and gowns are welcome, and so are suits and cocktail dresses.';
  const additionalInfo = 'Pre-Ceremony Cocktails being at 6:30 PM, Ceremony will begin at 7:00 PM';

  return (
    <>
      <div className="text-center relative px-16 pt-6 pb-6 ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-4xl sm:rounded-lg sm:px-20"
        style={{ backgroundColor: 'rgb(238, 238, 238)' }}>
        <h3 className='text-xl text-black font-bodo mb-4'>Wedding Date</h3>
        <p className='font-pop text-black text-sm mt-2'>{startTime}</p>
        {/* <p className='font-pop text-black text-sm mt-2'>{weddingAddress}</p>
        <p className='font-pop text-black text-sm mt-2'>{dressCode}</p>
        <p className='font-pop text-black text-sm mt-2'>{additionalInfo}</p> */}
      </div >
    </>
  )
}

export const sortGuestList = (guests) => {
  return [...guests].sort((a, b) => {
    // First compare last names
    const lastNameComparison = a.lastName.localeCompare(b.lastName);

    // If last names are the same, compare first names
    if (lastNameComparison === 0) {
      return a.firstName.localeCompare(b.firstName);
    }

    return lastNameComparison;
  });
};

export const extractGuestsIntoArray = (guestData) => {
  const guests = [
    {
      firstName: guestData.firstName,
      lastName: guestData.lastName,
      rsvpStatus: guestData.rsvpStatus
    }
  ]
  if (guestData.partner) {
    guests.push({
      firstName: guestData.partner.firstName,
      lastName: guestData.partner.lastName,
      rsvpStatus: guestData.partner.rsvpStatus
    })
  }
  if (guestData.children?.length) {
    guestData.children.forEach(child => {
      guests.push({
        firstName: child.firstName,
        lastName: child.lastName,
        rsvpStatus: child.rsvpStatus
      })
    })
  }
  return guests;
}

export const reconstructGuestData = (originalGuestData, updatedGuestArray) => {
  const updatedGuestData = { ...originalGuestData };

  // Update main guest
  updatedGuestData.rsvpStatus = updatedGuestArray[0].rsvpStatus;

  // Update partner if exists
  if (updatedGuestData.partner) {
    updatedGuestData.partner.rsvpStatus = updatedGuestArray[1]?.rsvpStatus;
  }

  // Update children if exist
  if (updatedGuestData.children?.length) {
    updatedGuestData.children = updatedGuestData.children.map((child, index) => ({
      ...child,
      rsvpStatus: updatedGuestArray[index + (updatedGuestData.partner ? 2 : 1)]?.rsvpStatus
    }));
  }

  return updatedGuestData;
};

export function formatGuestNamesInTable(guest) {
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
  if (Array.isArray(guest?.children)) {
    guest.children.forEach(child => {
      if (child.firstName || child.lastName) {
        names.push(`${child.firstName || ''} ${child.lastName || ''}`.trim());
      }
    });
  }

  // Return formatted names as JSX
  return names.length > 0 ? (
    <>
      {names.map((name, index) => (
        <span key={index}>
          {name}
          <br />
        </span>
      ))}
    </>
  ) : <span>No Name Available</span>;
};

export const titleOptions = [
  { value: "", label: "Select" },
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Ms.", label: "Ms." },
  { value: 'Miss', label: "Miss" },
  { value: "Dr.", label: "Dr." }
];

export const rsvpStatuses = [
  { value: "No Response", label: "No Response" },
  { value: "Attending", label: "Attending" },
  { value: "Declined", label: "Declined" }
]

export const stateOptions = [
  { value: "", label: "Select..." },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District Of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "AA", label: "Armed Forces Americas" },
  { value: "AE", label: "Armed Forces Europe" },
  { value: "AP", label: "Armed Forces Pacific" },
]

export const countryOptions = [
  { value: "", label: "Select..." },
  { value: "US", label: "United States" },
  { value: "AF", label: "Afghanistan" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AS", label: "American Samoa" },
  { value: "AD", label: "Andorra" },
  { value: "AO", label: "Angola" },
  { value: "AI", label: "Anguilla" },
  { value: "AQ", label: "Antarctica" },
  { value: "AG", label: "Antigua and Barbuda" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AW", label: "Aruba" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "BS", label: "Bahamas" },
  { value: "BH", label: "Bahrain" },
  { value: "BD", label: "Bangladesh" },
  { value: "BB", label: "Barbados" },
  { value: "BY", label: "Belarus" },
  { value: "BE", label: "Belgium" },
  { value: "BZ", label: "Belize" },
  { value: "BJ", label: "Benin" },
  { value: "BM", label: "Bermuda" },
  { value: "BT", label: "Bhutan" },
  { value: "BO", label: "Bolivia" },
  { value: "BQ", label: "Bonaire, Sint Eustatius and Saba" },
  { value: "BA", label: "Bosnia and Herzegovina" },
  { value: "BW", label: "Botswana" },
  { value: "BV", label: "Bouvet Island" },
  { value: "BR", label: "Brazil" },
  { value: "IO", label: "British Indian Ocean Territory" },
  { value: "VG", label: "British Virgin Islands" },
  { value: "BN", label: "Brunei" },
  { value: "BG", label: "Bulgaria" },
  { value: "BF", label: "Burkina Faso" },
  { value: "BI", label: "Burundi" },
  { value: "KH", label: "Cambodia" },
  { value: "CM", label: "Cameroon" },
  { value: "CA", label: "Canada" },
  { value: "CV", label: "Cape Verde" },
  { value: "KY", label: "Cayman Islands" },
  { value: "CF", label: "Central African Republic" },
  { value: "TD", label: "Chad" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CX", label: "Christmas Island" },
  { value: "CC", label: "Cocos Islands" },
  { value: "CO", label: "Colombia" },
  { value: "KM", label: "Comoros" },
  { value: "CG", label: "Congo" },
  { value: "CK", label: "Cook Islands" },
  { value: "CR", label: "Costa Rica" },
  { value: "HR", label: "Croatia" },
  { value: "CU", label: "Cuba" },
  { value: "CW", label: "Curaçao" },
  { value: "CY", label: "Cyprus" },
  { value: "CZ", label: "Czech Republic" },
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "DK", label: "Denmark" },
  { value: "DJ", label: "Djibouti" },
  { value: "DM", label: "Dominica" },
  { value: "DO", label: "Dominican Republic" },
  { value: "EC", label: "Ecuador" },
  { value: "EG", label: "Egypt" },
  { value: "SV", label: "El Salvador" },
  { value: "GQ", label: "Equatorial Guinea" },
  { value: "ER", label: "Eritrea" },
  { value: "EE", label: "Estonia" },
  { value: "ET", label: "Ethiopia" },
  { value: "FK", label: "Falkland Islands" },
  { value: "FO", label: "Faroe Islands" },
  { value: "FJ", label: "Fiji" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "GF", label: "French Guiana" },
  { value: "PF", label: "French Polynesia" },
  { value: "TF", label: "French Southern Territories" },
  { value: "GA", label: "Gabon" },
  { value: "GM", label: "Gambia" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Germany" },
  { value: "GH", label: "Ghana" },
  { value: "GI", label: "Gibraltar" },
  { value: "GR", label: "Greece" },
  { value: "GL", label: "Greenland" },
  { value: "GD", label: "Grenada" },
  { value: "GP", label: "Guadeloupe" },
  { value: "GU", label: "Guam" },
  { value: "GT", label: "Guatemala" },
  { value: "GG", label: "Guernsey" },
  { value: "GN", label: "Guinea" },
  { value: "GW", label: "Guinea-Bissau" },
  { value: "GY", label: "Guyana" },
  { value: "HT", label: "Haiti" },
  { value: "HM", label: "Heard Island And McDonald Islands" },
  { value: "HN", label: "Honduras" },
  { value: "HK", label: "Hong Kong" },
  { value: "HU", label: "Hungary" },
  { value: "IS", label: "Iceland" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" },
  { value: "IQ", label: "Iraq" },
  { value: "IE", label: "Ireland" },
  { value: "IM", label: "Isle Of Man" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japan" },
  { value: "JE", label: "Jersey" },
  { value: "JO", label: "Jordan" },
  { value: "KZ", label: "Kazakhstan" },
  { value: "KE", label: "Kenya" },
  { value: "KI", label: "Kiribati" },
  { value: "XK", label: "Kosovo" },
  { value: "KW", label: "Kuwait" },
  { value: "KG", label: "Kyrgyzstan" },
  { value: "LA", label: "Laos" },
  { value: "LV", label: "Latvia" },
  { value: "LB", label: "Lebanon" },
  { value: "LS", label: "Lesotho" },
  { value: "LR", label: "Liberia" },
  { value: "LY", label: "Libya" },
  { value: "LI", label: "Liechtenstein" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "MO", label: "Macao" },
  { value: "MK", label: "Macedonia" },
  { value: "MG", label: "Madagascar" },
  { value: "MW", label: "Malawi" },
  { value: "MY", label: "Malaysia" },
  { value: "MV", label: "Maldives" },
  { value: "ML", label: "Mali" },
  { value: "MT", label: "Malta" },
  { value: "MH", label: "Marshall Islands" },
  { value: "MQ", label: "Martinique" },
  { value: "MR", label: "Mauritania" },
  { value: "MU", label: "Mauritius" },
  { value: "YT", label: "Mayotte" },
  { value: "MX", label: "Mexico" },
  { value: "FM", label: "Micronesia" },
  { value: "MD", label: "Moldova" },
  { value: "MC", label: "Monaco" },
  { value: "MN", label: "Mongolia" },
  { value: "ME", label: "Montenegro" },
  { value: "MS", label: "Montserrat" },
  { value: "MA", label: "Morocco" },
  { value: "MZ", label: "Mozambique" },
  { value: "MM", label: "Myanmar" },
  { value: "NA", label: "Namibia" },
  { value: "NR", label: "Nauru" },
  { value: "NP", label: "Nepal" },
  { value: "NL", label: "Netherlands" },
  { value: "AN", label: "Netherlands Antilles" },
  { value: "NC", label: "New Caledonia" },
  { value: "NZ", label: "New Zealand" },
  { value: "NI", label: "Nicaragua" },
  { value: "NE", label: "Niger" },
  { value: "NG", label: "Nigeria" },
  { value: "NU", label: "Niue" },
  { value: "NF", label: "Norfolk Island" },
  { value: "KP", label: "North Korea" },
  { value: "MP", label: "Northern Mariana Islands" },
  { value: "NO", label: "Norway" },
  { value: "OM", label: "Oman" },
  { value: "PK", label: "Pakistan" },
  { value: "PW", label: "Palau" },
  { value: "PS", label: "Palestine" },
  { value: "PA", label: "Panama" },
  { value: "PG", label: "Papua New Guinea" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PN", label: "Pitcairn" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "PR", label: "Puerto Rico" },
  { value: "QA", label: "Qatar" },
  { value: "RE", label: "Reunion" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russia" },
  { value: "RW", label: "Rwanda" },
  { value: "BL", label: "Saint Barthélemy" },
  { value: "SH", label: "Saint Helena" },
  { value: "KN", label: "Saint Kitts And Nevis" },
  { value: "LC", label: "Saint Lucia" },
  { value: "MF", label: "Saint Martin" },
  { value: "PM", label: "Saint Pierre And Miquelon" },
  { value: "VC", label: "Saint Vincent And The Grenadines" },
  { value: "WS", label: "Samoa" },
  { value: "SM", label: "San Marino" },
  { value: "ST", label: "Sao Tome And Principe" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "SN", label: "Senegal" },
  { value: "RS", label: "Serbia" },
  { value: "SC", label: "Seychelles" },
  { value: "SL", label: "Sierra Leone" },
  { value: "SG", label: "Singapore" },
  { value: "SX", label: "Sint Maarten (Dutch part)" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "SB", label: "Solomon Islands" },
  { value: "SO", label: "Somalia" },
  { value: "ZA", label: "South Africa" },
  { value: "GS", label: "South Georgia And The South Sandwich Islands" },
  { value: "KR", label: "South Korea" },
  { value: "ES", label: "Spain" },
  { value: "LK", label: "Sri Lanka" },
  { value: "SD", label: "Sudan" },
  { value: "SR", label: "Suriname" },
  { value: "SJ", label: "Svalbard And Jan Mayen" },
  { value: "SZ", label: "Swaziland" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "SY", label: "Syria" },
  { value: "TW", label: "Taiwan" },
  { value: "TJ", label: "Tajikistan" },
  { value: "TZ", label: "Tanzania" },
  { value: "TH", label: "Thailand" },
  { value: "CD", label: "The Democratic Republic Of Congo" },
  { value: "TL", label: "Timor-Leste" },
  { value: "TG", label: "Togo" },
  { value: "TK", label: "Tokelau" },
  { value: "TO", label: "Tonga" },
  { value: "TT", label: "Trinidad and Tobago" },
  { value: "TN", label: "Tunisia" },
  { value: "TR", label: "Turkey" },
  { value: "TM", label: "Turkmenistan" },
  { value: "TC", label: "Turks And Caicos Islands" },
  { value: "TV", label: "Tuvalu" },
  { value: "VI", label: "U.S. Virgin Islands" },
  { value: "UG", label: "Uganda" },
  { value: "UA", label: "Ukraine" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom" },
  { value: "UM", label: "United States Minor Outlying Islands" },
  { value: "UY", label: "Uruguay" },
  { value: "UZ", label: "Uzbekistan" },
  { value: "VU", label: "Vanuatu" },
  { value: "VA", label: "Vatican" },
  { value: "VE", label: "Venezuela" },
  { value: "VN", label: "Vietnam" },
  { value: "WF", label: "Wallis And Futuna" },
  { value: "EH", label: "Western Sahara" },
  { value: "YE", label: "Yemen" },
  { value: "ZM", label: "Zambia" },
  { value: "ZW", label: "Zimbabwe" },
  { value: "AX", label: "Åland Islands" },
]
