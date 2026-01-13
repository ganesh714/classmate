import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import logoLight from '../assets/logos/logo-light.png';
import logoDark from '../assets/logos/logo-dark.png';
import { useTheme } from '../context/ThemeContext';

const RegisterPage = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', dob: '', terms: false });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const serverUrl = "https://classmate-juji.onrender.com";

    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAuthSuccess = (token, userData) => {
        localStorage.setItem('auth_token', token);
        if (userData && userData.name) {
            localStorage.setItem('user_name', userData.name);
        }
        navigate('/dashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.terms) {
            setError('You must agree to the Terms & Conditions.');
            return;
        }

        setIsLoading(true);

        try {
            // Register
            const response = await fetch(`${serverUrl}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    dob: formData.dob
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error_type === 'email_exists') {
                    setError('Email already registered. Please sign in.');
                } else {
                    setError(data.detail || 'Registration failed. Please check your details.');
                }
                setIsLoading(false);
                return;
            }

            // Auto Login
            try {
                const loginResponse = await fetch(`${serverUrl}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });

                const loginData = await loginResponse.json();

                if (!loginResponse.ok) {
                    setError('Registration successful! Please sign in manually.');
                    setTimeout(() => navigate('/login'), 2000);
                    setIsLoading(false);
                    return;
                }

                handleAuthSuccess(loginData.token, loginData.user);

            } catch (loginErr) {
                setError('Registration successful but auto-login failed. Please sign in.');
                setIsLoading(false);
            }

        } catch (err) {
            setError('Network error or server issue. Please try again.');
            console.error('Error:', err);
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <img src={theme === 'light' ? logoLight : logoDark} alt="ClassmateAI Logo" id="authLogo" />
                    </div>
                    <h1 className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join ClassmateAI today</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter your email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className="form-control"
                            placeholder="Create a password (min. 8 characters)"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob" className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            className="form-control"
                            required
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="terms-agreement">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            checked={formData.terms}
                            onChange={handleChange}
                        />
                        <label htmlFor="terms">I agree to the <a href="#">Terms & Conditions</a></label>
                    </div>

                    {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? (
                            <><i className="fas fa-spinner fa-spin btn-icon"></i> Creating Account...</>
                        ) : (
                            <><i className="fas fa-user-plus btn-icon"></i> Create Account</>
                        )}
                    </button>

                    <div className="auth-switch">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
