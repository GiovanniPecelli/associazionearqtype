import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="min-h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default PublicLayout;
