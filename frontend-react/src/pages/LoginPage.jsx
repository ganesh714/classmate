import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import logoLight from '../assets/logos/logo-light.png';
import logoDark from '../assets/logos/logo-dark.png';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${serverUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error_type === 'email_not_found') {
                    setError('Email not registered. Please sign up first.');
                } else if (data.error_type === 'wrong_password') {
                    setError('Incorrect password. Please try again.');
                } else {
                    setError(data.detail || 'Login failed');
                }
                return;
            }

            localStorage.setItem('auth_token', data.token);
            if (data.user && data.user.name) {
                localStorage.setItem('user_name', data.user.name);
            }

            navigate('/dashboard');

        } catch (err) {
            setError('Network error or server issue. Please try again.');
            console.error('Error:', err);
        } finally {
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
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
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
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <label htmlFor="rememberMe">Remember me</label>
                    </div>

                    {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? (
                            <><i className="fas fa-spinner fa-spin btn-icon"></i> Signing In...</>
                        ) : (
                            <><i className="fas fa-sign-in-alt btn-icon"></i> Sign In</>
                        )}
                    </button>

                    <div className="auth-switch">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
