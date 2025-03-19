import React from 'react';
import RSVPForm from '../components/RSVPForm';

const RSVPPage: React.FC = () => <>
  <div className="flex flex-col pt-12 mt-12 items-center py-6">
    <h1 className="font-bodo text-7xl font-bold text-white text-center mb-2">
      RSVP
    </h1>
    <h3 className="font-bodo text-sm font-bold text-white text-center pt-6">
      Kindly Reply by Monday
    </h3>
    <h1 className="font-bodo text-xl font-bold text-white text-center pt-4">
      March, 9, 2026
    </h1>
    <RSVPForm />
  </div>
</>

export default RSVPPage
