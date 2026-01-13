import React from 'react';
import { useTheme } from '../context/ThemeContext';
import logoLight from '../assets/logos/logo-light.png';
import logoDark from '../assets/logos/logo-dark.png';
import '../styles/auth.css';

const AuthLayout = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <header>
                <div className="logo-container">
                    <img src={theme === 'light' ? logoLight : logoDark} alt="ClassmateAI Logo" className="logo" />
                    <span className="logo-text">ClassmateAI</span>
                </div>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                </button>
            </header>
            <div className="grid-bg"></div>
            <div className="auth-container">
                {children}
            </div>
        </>
    );
};

export default AuthLayout;
