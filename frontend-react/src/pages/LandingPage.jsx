import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <>
            <div className="grid-bg"></div>

            <div className="hero-bg">
                <div className="hero-gradient"></div>
                <Navbar />

                {/* Hero Section */}
                <section className="hero" id="hero">
                    <h1>Your Personal AI Learning Assistant.</h1>
                    <p>Classmate AI helps you learn smarter, not harder. Get personalized study plans, instant answers to your questions, and intelligent insights to boost your academic performance.</p>
                    <div className="cta-buttons">
                        <Link to="/login" className="btn btn-primary">
                            <i className="fas fa-rocket"></i> Get Started
                        </Link>
                    </div>
                </section>
            </div>

            {/* Features */}
            <section className="features-container" id="features">
                <div className="features">
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <i className="fas fa-robot feature-icon"></i>
                        </div>
                        <h3>Chatbot AI</h3>
                        <p>Get instant answers to your study questions with our intelligent AI assistant available 24/7.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <i className="fas fa-chart-line feature-icon"></i>
                        </div>
                        <h3>Personal Dashboard</h3>
                        <p>Visualize your academic progress with customizable charts and performance metrics.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <i className="fas fa-book feature-icon"></i>
                        </div>
                        <h3>Smart Notes</h3>
                        <p>Organize, search, and highlight your notes with AI-powered suggestions and summaries.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <i className="fas fa-tasks feature-icon"></i>
                        </div>
                        <h3>Task Manager</h3>
                        <p>Stay on top of assignments and deadlines with intelligent prioritization and reminders.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <i className="fas fa-percentage feature-icon"></i>
                        </div>
                        <h3>Attendance Calculator</h3>
                        <p>Track your class attendance and get alerts when you're at risk of falling below requirements.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <i className="fas fa-cogs feature-icon"></i>
                        </div>
                        <h3>Settings & Customization</h3>
                        <p>Personalize your dashboard, toggle dark mode, and adjust features to match your study style.</p>
                    </div>
                </div>
            </section>

            {/* Student Success Section */}
            <section className="student-success">
                <div className="container">
                    <div className="success-content">
                        <div className="success-text">
                            <h2>Why Students Choose Classmate</h2>
                            <p>We understand the unique challenges students face. Here's how Classmate helps you overcome them:</p>

                            <div className="benefits">
                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-chart-line"></i>
                                    </div>
                                    <div className="benefit-text">
                                        <h3>Boost Academic Performance</h3>
                                        <p>Students using Classmate report an average 15% improvement in grades and assignment completion rates.</p>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-heart"></i>
                                    </div>
                                    <div className="benefit-text">
                                        <h3>Reduce Stress and Anxiety</h3>
                                        <p>Never miss a deadline or forget an assignment again. Our smart reminder system keeps you on track.</p>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div className="benefit-text">
                                        <h3>Save Valuable Time</h3>
                                        <p>Our AI assistant helps you study smarter, not harder, by providing instant answers and summarizing complex materials.</p>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-layer-group"></i>
                                    </div>
                                    <div className="benefit-text">
                                        <h3>Centralize Your Academic Life</h3>
                                        <p>Keep all your notes, assignments, schedules, and resources in one secure, accessible place.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="success-stats">
                            {/* Student Image */}
                            <div className="student-image">
                                <img
                                    src="https://readdy.ai/api/search-image?query=A%20group%20of%20diverse%20college%20students%20studying%20together%20in%20a%20modern%20library%20or%20campus%20setting.%20They%20are%20using%20laptops%20and%20tablets%2C%20looking%20engaged%20and%20productive.%20Some%20students%20are%20collaborating%20while%20others%20are%20focused%20on%20individual%20work.%20The%20scene%20shows%20a%20mix%20of%20male%20and%20female%20students%20from%20different%20backgrounds%2C%20all%20appearing%20motivated%20and%20successful%20in%20their%20academic%20pursuits.%20The%20lighting%20is%20bright%20and%20natural.&width=800&height=600&seq=students&orientation=landscape"
                                    alt="Students using Classmate"
                                    className="student-img"
                                />
                            </div>

                            <div className="stats-card">
                                <div className="stats-header">
                                    <div className="stats-title-container">
                                        <h3>Student Success Rate</h3>
                                        <p>Based on survey of 2,500+ students</p>
                                    </div>
                                    <div className="stats-percentage">94%</div>
                                </div>

                                <div className="stats-metrics">
                                    <div className="metric">
                                        <div className="metric-label">
                                            <span>Improved Organization</span>
                                            <span>96%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '96%' }}></div>
                                        </div>
                                    </div>

                                    <div className="metric">
                                        <div className="metric-label">
                                            <span>Better Time Management</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>

                                    <div className="metric">
                                        <div className="metric-label">
                                            <span>Reduced Academic Stress</span>
                                            <span>89%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '89%' }}></div>
                                        </div>
                                    </div>

                                    <div className="metric">
                                        <div className="metric-label">
                                            <span>Grade Improvement</span>
                                            <span>87%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '87%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact" style={{ padding: '4rem 2rem', background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)' }}>
                <div className="container" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text)', fontWeight: 700 }}>Contact Us</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>We'd love to hear from you! Reach out to us using any of the methods below:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                            <i className="fas fa-envelope" style={{ color: 'var(--accent)' }}></i>
                            <span>
                                Email:<br />
                                <a href="mailto:sriramchodabattula777@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>sriramchodabattula777@gmail.com</a><br />
                                <a href="mailto:evvganesh1@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>evvganesh1@gmail.com</a><br />
                                <a href="mailto:sivaganeshv1729@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>sivaganeshv1729@gmail.com</a><br />
                                <a href="mailto:nagaveeranna1234@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>nagaveeranna1234@gmail.com</a>
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                            <i className="fab fa-linkedin" style={{ color: 'var(--accent)' }}></i>
                            <span>
                                LinkedIn:<br />
                                <a href="http://www.linkedin.com/in/sriram-chodabattula-09b08a174" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>@sriram-chodabattula</a><br />
                                <a href="https://www.linkedin.com/in/siva-ganesh-vemula/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>@siva-ganesh-vemula</a><br />
                                <a href="https://www.linkedin.com/in/venkata-ganesh-934072291/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>@venkata-ganesh</a><br />
                                <a href="https://www.linkedin.com/in/naga-veeranna-97a133286/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>@naga-veeranna</a>
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                            <i className="fas fa-phone" style={{ color: 'var(--accent)' }}></i>
                            <span>Phone: <a href="tel:+918328465631" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>+91 8328465631</a></span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default LandingPage;
