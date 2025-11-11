import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header/Navigation - Simplified for landing page */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="fas fa-flow me-2"></i>
            TalentFlow HR
          </Link>
          
          <div className="navbar-nav ms-auto">
            <Link to="/login" className="nav-link me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary-custom">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Rest of the landing page content remains the same */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6 hero-content fade-in">
              <h1 className="hero-title">
                Streamline Your <span className="text-warning">HR Operations</span>
              </h1>
              <p className="hero-subtitle">
                An all-in-one HR platform that simplifies employee management with 
                intuitive tools for feedback, leave management, and skill tracking. 
                Designed for modern businesses that value efficiency and growth.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary-custom btn-lg">
                  <i className="fas fa-rocket me-2"></i>
                  Start Free Trial
                </Link>
                <button className="btn btn-outline-custom btn-lg">
                  <i className="fas fa-play-circle me-2"></i>
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="col-lg-6 slide-up">
              <div className="text-center">
                <div className="row g-4">
                  <div className="col-6">
                    <div className="feature-card glass-effect">
                      <div className="feature-icon">
                        <i className="fas fa-comments"></i>
                      </div>
                      <h4>Feedback</h4>
                      <p className="text-light">Continuous employee feedback system</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="feature-card glass-effect">
                      <div className="feature-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <h4>Leave Management</h4>
                      <p className="text-light">Streamlined leave requests</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="feature-card glass-effect">
                      <div className="feature-icon">
                        <i className="fas fa-rocket"></i>
                      </div>
                      <h4>Skills Tracking</h4>
                      <p className="text-light">Employee skill inventory</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="feature-card glass-effect">
                      <div className="feature-icon">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <h4>Analytics</h4>
                      <p className="text-light">HR insights & reports</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Proposition */}
      <section className="value-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Why Choose TalentFlow HR?</h2>
            <p className="lead text-muted">
              Designed specifically for small to medium businesses who need powerful HR tools without the complexity.
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="value-card slide-up">
                <div className="value-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3 className="h4 mb-3">Lightning Fast</h3>
                <p className="text-muted">
                  Get set up in minutes, not days. Our intuitive interface means less training 
                  and more productivity for your entire team.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="value-card slide-up" style={{animationDelay: '0.2s'}}>
                <div className="value-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <h3 className="h4 mb-3">Cost Effective</h3>
                <p className="text-muted">
                  Enterprise-level features at a fraction of the cost. Scale as you grow 
                  without breaking the bank.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="value-card slide-up" style={{animationDelay: '0.4s'}}>
                <div className="value-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="h4 mb-3">Secure & Reliable</h3>
                <p className="text-muted">
                  Your data is safe with us. Enterprise-grade security with 99.9% uptime 
                  guarantee and regular backups.
                </p>
              </div>
            </div>
          </div>

          {/* Core Features */}
          <div className="row mt-5 pt-5">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold">Core Features</h2>
              <p className="lead text-muted">Everything you need in one platform</p>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="text-center p-4">
                <div className="feature-icon mx-auto mb-4">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <h4 className="fw-bold">Smart Feedback</h4>
                <p className="text-muted">
                  Real-time feedback system with analytics to improve employee engagement and performance.
                </p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="text-center p-4">
                <div className="feature-icon mx-auto mb-4">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h4 className="fw-bold">Leave Management</h4>
                <p className="text-muted">
                  Automated leave requests, approvals, and tracking with calendar integration.
                </p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="text-center p-4">
                <div className="feature-icon mx-auto mb-4">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h4 className="fw-bold">Skills Analytics</h4>
                <p className="text-muted">
                  Comprehensive skill tracking with gap analysis and development recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Ready to Transform Your HR?</h2>
                <p className="lead text-muted">
                  Get in touch with our team to learn how TalentFlow can help your organization.
                </p>
              </div>
              
              <div className="custom-form">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows="4"
                        placeholder="Tell us about your HR challenges..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary-custom w-100 py-3">
                        <i className="fas fa-paper-plane me-2"></i>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
                
                <div className="mt-4 pt-4 border-top text-center">
                  <p className="text-muted mb-3">Or contact us directly:</p>
                  <div className="row">
                    <div className="col-md-4">
                      <i className="fas fa-envelope text-primary me-2"></i>
                      contact@talentflow.com
                    </div>
                    <div className="col-md-4">
                      <i className="fas fa-phone text-primary me-2"></i>
                      +1 (555) 123-4567
                    </div>
                    <div className="col-md-4">
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      San Francisco, CA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-flow fa-2x text-primary me-3"></i>
                <h4 className="mb-0">TalentFlow HR</h4>
              </div>
              <p className="text-light mb-0">
                Streamlining HR operations for modern businesses
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-light mb-0">
                © 2024 TalentFlow HR. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;