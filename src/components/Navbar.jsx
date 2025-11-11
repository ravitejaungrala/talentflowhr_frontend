import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'fa-home' },
    { name: 'Feedback', href: '/feedback', icon: 'fa-comments' },
    { name: 'Leave Management', href: '/leaves', icon: 'fa-calendar-alt' },
    { name: 'Skills', href: '/skills', icon: 'fa-rocket' },
    { name: 'Recognition', href: '/recognition', icon: 'fa-trophy' },
    { name: 'Training', href: '/training', icon: 'fa-graduation-cap' },
    { name: 'Goals', href: '/goals', icon: 'fa-bullseye' },
    { name: 'Surveys', href: '/surveys', icon: 'fa-chart-bar' },
    { name: 'Announcements', href: '/announcements', icon: 'fa-bullhorn' },
    { name: 'Documents', href: '/documents', icon: 'fa-file' },
    ...(user?.role === 'admin' ? [{ name: 'Employees', href: '/employees', icon: 'fa-users' }] : []),
  ];

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-custom fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to={user ? "/dashboard" : "/"}>
          <i className="fas fa-flow"></i>
          TalentFlow HR
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* Collapsible Content */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          {/* Navigation Links - Only show when user is logged in */}
          {/* {user && (
            <ul className="navbar-nav me-auto">
              {navigation.map((item) => (
                <li key={item.name} className="nav-item">
                  <Link
                    className={`nav-link ${isActive(item.href)}`}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )} */}

          {/* Right Side Content */}
          {/* <div className="d-flex align-items-center ms-auto">
            {user ? (
              <>
                
                <div className="user-info d-none d-lg-flex">
                  <div className="user-avatar">
                    {getUserInitials(user.name)}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role text-capitalize">{user.role}</div>
                  </div>
                </div>

                
                <div className="d-lg-none navbar-text me-3">
                  <i className="fas fa-user me-2"></i>
                  {user.name}
                  <span className="badge bg-primary ms-2 text-capitalize">{user.role}</span>
                </div>

               
                <button
                  onClick={handleLogout}
                  className="btn logout-btn"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt me-1"></i>
                  <span className="d-none d-md-inline">Logout</span>
                </button>
              </>
            ) : (
             
              <div className="d-flex gap-2">
                <Link 
                  to="/login" 
                  className="btn btn-outline-custom"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary-custom"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Get Started
                </Link>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;