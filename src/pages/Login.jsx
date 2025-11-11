import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <i className="fas fa-flow"></i>
            </div>
            <div className="auth-logo-text">TalentFlow HR</div>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn auth-btn-primary mb-3"
          >
            {loading ? (
              <>
                <span className="loading-spinner me-2"></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Sign In
              </>
            )}
          </button>

          <div className="auth-divider">
            <span className="auth-divider-text">New to TalentFlow?</span>
          </div>

          <Link to="/register" className="auth-btn btn btn-outline-custom">
            <i className="fas fa-user-plus me-2"></i>
            Create New Account
          </Link>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">Demo Accounts</p>
          <div className="demo-accounts">
            <div className="demo-title">Try these demo accounts:</div>
            <div className="demo-account">
              <strong>Admin:</strong> admin@talentflow.com / password
            </div>
            <div className="demo-account">
              <strong>HR:</strong> hr@talentflow.com / password
            </div>
            <div className="demo-account">
              <strong>Employee:</strong> employee@talentflow.com / password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;