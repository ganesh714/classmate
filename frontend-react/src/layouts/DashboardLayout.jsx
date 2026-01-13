import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';

const DashboardLayout = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="app-container">
            <Sidebar isExpanded={isExpanded} toggleExpanded={toggleExpanded} />

            {/* Main Content Area */}
            <div className={isExpanded ? 'main-content main-content-expanded' : 'main-content'}>
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
