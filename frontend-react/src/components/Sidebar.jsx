import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import logoLight from '../assets/logos/logo-light.png';
import logoDark from '../assets/logos/logo-dark.png';

const Sidebar = ({ isExpanded, toggleExpanded }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // State for user info with localStorage fallbacks
    const [userInfo, setUserInfo] = useState({
        name: localStorage.getItem('user_name') || 'Student',
        email: localStorage.getItem('user_email') || 'user@example.com',
        avatar: localStorage.getItem('user_avatar') || 'https://randomuser.me/api/portraits/men/32.jpg'
    });

    const serverUrl = "https://classmate-juji.onrender.com";

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const response = await fetch(`${serverUrl}/api/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    // Update state
                    const newUserInfo = {
                        name: data.name || userInfo.name,
                        email: data.email || userInfo.email,
                        avatar: data.avatar || localStorage.getItem('user_avatar') || userInfo.avatar // Prefer API, then local, then default
                    };

                    // If API returns no avatar, keep using the default random one to ensure image loads
                    if (!data.avatar) {
                        newUserInfo.avatar = userInfo.avatar;
                    }

                    setUserInfo(newUserInfo);

                    // Update localStorage
                    localStorage.setItem('user_name', newUserInfo.name);
                    localStorage.setItem('user_email', newUserInfo.email);
                    if (data.avatar) localStorage.setItem('user_avatar', data.avatar);

                } else if (response.status === 401) {
                    handleLogout();
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const displayTheme = theme === 'dark' ? 'Dark Mode' : 'Light Mode';

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_avatar');
        navigate('/login');
    };

    const NavItem = ({ to, icon, title, isExpandedItem }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isExpandedItem
                    ? `nav-item-expanded ${isActive ? 'active' : ''}`
                    : `nav-item ${isActive ? 'active' : ''}`
            }
            title={!isExpandedItem ? title : ''}
        >
            {isExpandedItem ? (
                <>
                    <div className="nav-icon"><i className={icon}></i></div>
                    <span className="nav-text">{title}</span>
                </>
            ) : (
                <i className={icon}></i>
            )}
        </NavLink>
    );

    return (
        <>
            {/* Narrow Panel */}
            <div
                className="vertical-panel-narrow"
                style={{ display: isExpanded ? 'none' : 'flex' }}
                onClick={(e) => {
                    // Don't expand if clicking on interactive elements
                    if (e.target.closest('.nav-item') ||
                        e.target.closest('.user-profile') ||
                        e.target.closest('.expand-button')) {
                        return;
                    }
                    toggleExpanded();
                }}
            >
                <div className="logo-container-sidebar">
                    <img
                        className="logo"
                        src={theme === 'light' ? logoLight : logoDark}
                        alt="logo"
                        style={{ height: '40px' }}
                    />
                    <div className="expand-button" onClick={toggleExpanded}>
                        <i className="fas fa-chevron-right"></i>
                    </div>
                </div>

                <div className="nav-icons-group" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Added wrapper for mobile alignment if needed, though CSS handles it */}
                    <NavItem to="/dashboard" icon="fa-solid fa-chart-column" title="Dashboard" isExpandedItem={false} />
                    <NavItem to="/chatbot" icon="fa-solid fa-robot" title="AI Chatbot" isExpandedItem={false} />
                    <NavItem to="/notes" icon="fas fa-sticky-note" title="Notes" isExpandedItem={false} />
                    <NavItem to="/tasks" icon="fas fa-tasks" title="Task Manager" isExpandedItem={false} />
                    <NavItem to="/attendance" icon="fa-solid fa-calendar-days" title="Attendance" isExpandedItem={false} />
                    <NavItem to="/settings" icon="fas fa-cog" title="Settings" isExpandedItem={false} />
                    <div className="nav-item" onClick={toggleTheme} title="Toggle Theme">
                        <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                    </div>
                </div>

                <div className="spacer"></div>

                <div className="nav-item" onClick={handleLogout} title="Logout" style={{ color: 'var(--danger)' }}>
                    <i className="fas fa-sign-out-alt"></i>
                </div>

                <div className="user-profile" title={userInfo.name}>
                    <img src={userInfo.avatar} alt="User" className="user-avatar" />
                </div>
            </div>

            {/* Expanded Panel */}
            <div
                className="vertical-panel-expanded"
                style={{ display: isExpanded ? 'flex' : 'none' }}
            >
                <div className="panel-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            className="logo"
                            src={theme === 'light' ? logoLight : logoDark}
                            alt="logo"
                            style={{ height: '32px' }}
                        />
                        <span className="logo-text-sidebar">Classmate</span>
                    </div>
                    <button className="collapse-button" onClick={toggleExpanded}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                </div>

                <div className="panel-section">
                    <div className="section-header">Menu</div>
                    <NavItem to="/dashboard" icon="fa-solid fa-chart-column" title="Dashboard" isExpandedItem={true} />
                    <NavItem to="/chatbot" icon="fa-solid fa-robot" title="AI Chatbot" isExpandedItem={true} />
                    <NavItem to="/notes" icon="fas fa-sticky-note" title="Notes" isExpandedItem={true} />
                    <NavItem to="/tasks" icon="fas fa-tasks" title="Task Manager" isExpandedItem={true} />
                    <NavItem to="/attendance" icon="fa-solid fa-calendar-days" title="Attendance" isExpandedItem={true} />
                </div>

                <div className="panel-section">
                    <div className="section-header">Settings</div>
                    <div className={`nav-item-expanded ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
                        <div className="nav-icon"><i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i></div>
                        <span className="nav-text">{displayTheme}</span>
                        <div className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}>
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                    <NavItem to="/settings" icon="fas fa-cog" title="Settings" isExpandedItem={true} />
                </div>

                <div className="spacer"></div>

                <div className="user-profile-expanded">
                    <img src={userInfo.avatar} alt="User" className="user-avatar" />
                    <div className="user-info">
                        <span className="user-name">{userInfo.name}</span>
                        <span className="user-role">{userInfo.email}</span>
                    </div>
                </div>
                <div className="nav-item-expanded logout" onClick={handleLogout} style={{ marginTop: '0' }}>
                    <div className="nav-icon"><i className="fas fa-sign-out-alt"></i></div>
                    <span className="nav-text">Log out</span>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
