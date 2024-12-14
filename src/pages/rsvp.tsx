import React from 'react';
import RSVPForm from '../components/RSVPForm';

const RSVPPage: React.FC = () => (
    <>
        <div className="flex flex-col pt-12 mt-12 items-center py-6">
            {/* Main Heading */}
            <h1 className="font-bodo text-7xl font-bold text-white text-center mb-2">
                RSVP
            </h1>
            {/* Subheader */}
            <h2 className="font-bodo text-m font-bold text-white text-center pt-6">
                Kindly Reply by Month, X, XXXX
            </h2>
            {/* Form */}
            <RSVPForm />
        </div>
    </>
);

export default RSVPPage;
