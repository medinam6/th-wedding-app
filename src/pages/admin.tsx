import React from 'react';
import GuestListManager from '../components/GuestListManager';


const AdminPage: React.FC = () => (
    <>
        <div className="flex flex-col pt-12 mt-12 items-center py-6">
            <h1 className="font-bodo text-7xl font-bold text-white text-center mb-2">
                Welcome
            </h1>
            <h2 className="font-bodo text-4xl font-bold text-white text-center pt-6">
                Henry & Teresa
            </h2>
            <div className="pt-6">
                <GuestListManager />
            </div>
        </div>
    </>
);

export default AdminPage;
