import React from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../assets/logos/logo-light.png';
import logoDark from '../assets/logos/logo-dark.png';

const Footer = () => {
    return (
        <footer>
            <div className="logo-container" style={{ justifyContent: 'center' }}>
                <img src={logoLight} alt="Classmate AI Logo" className="logo logo-light" />
                <img src={logoDark} alt="Classmate AI Logo" className="logo logo-dark" />
                <span className="logo-text">ClassmateAI</span>
            </div>
            <div className="footer-links">
                <a href="#">About Us</a>
                <a href="#features">Features</a>
                <a href="#contact">Contact Us</a>
            </div>
            <div className="social-links">
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
            <p>© 2025 Classmate AI. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
