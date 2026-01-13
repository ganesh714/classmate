import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import logoLight from '../assets/logos/logo-light.png';
import logoDark from '../assets/logos/logo-dark.png';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <>
            <header id="mainHeader" className={isScrolled ? 'scrolled' : ''}>
                <div className="header-container">
                    <div className="logo-container">
                        <img src={theme === 'light' ? logoLight : logoDark} alt="Classmate AI Logo" className="logo" />
                        <span className="logo-text">ClassmateAI</span>
                    </div>
                    <nav>
                        <a href="#" className="nav-link" data-target="hero">Home</a>
                        <a href="#features" className="nav-link" data-target="features">Features</a>
                        <a href="#contact" className="nav-link" data-target="contact">Contact</a>
                    </nav>
                    <div className="auth-buttons">
                        <button className="theme-toggle" id="themeToggleDesktop" onClick={toggleTheme}>
                            {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                        </button>
                        <Link to="/login" className="btn btn-primary">
                            <i className="fas fa-sign-in-alt"></i> Login/Signup
                        </Link>
                    </div>
                    <button className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`} id="mobileMenuBtn" onClick={toggleMobileMenu}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`} id="mobileNav">
                <div className="mobile-theme-toggle" id="themeToggleMobile">
                    <button className="theme-toggle" onClick={toggleTheme}>
                        {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                    </button>
                    <span id="themeText">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <button className="close-mobile-menu" id="closeMobileMenu" onClick={closeMobileMenu}>
                    <i className="fas fa-times"></i>
                </button>
                <a href="#" className="mobile-nav-link" style={{ "--i": 1 }} onClick={closeMobileMenu}>Home</a>
                <a href="#features" className="mobile-nav-link" style={{ "--i": 2 }} onClick={closeMobileMenu}>Features</a>
                <a href="#contact" className="mobile-nav-link" style={{ "--i": 3 }} onClick={closeMobileMenu}>Contact</a>
                <Link to="/login" className="btn btn-primary mobile-auth-btn" onClick={closeMobileMenu}>
                    <i className="fas fa-sign-in-alt"></i> Login/Signup
                </Link>
            </div>
        </>
    );
};

export default Navbar;
