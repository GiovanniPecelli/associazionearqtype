import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './public/Navbar';
import PublicFooter from './public/Footer';

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <PublicNavbar />
            <div className="min-h-screen">
                <Outlet />
            </div>
            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
