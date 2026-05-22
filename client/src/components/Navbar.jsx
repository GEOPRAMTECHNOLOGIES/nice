import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = auth.user?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-brand">
          Geo<span>pram</span>
        </Link>

        <ul className="navbar-menu">
          {!isAdmin && (
            <>
              <li>
                <Link to="/home" className={`navbar-link ${isActive('/home')}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className={`navbar-link ${isActive('/services')}`}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/orders" className={`navbar-link ${isActive('/orders')}`}>
                  Orders
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <>
              <li>
                <Link to="/admin/dashboard" className={`navbar-link ${isActive('/admin/dashboard')}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className={`navbar-link ${isActive('/admin/orders')}`}>
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/services" className={`navbar-link ${isActive('/admin/services')}`}>
                  Services
                </Link>
              </li>
            </>
          )}

          <li className="navbar-dropdown">
            <button
              className="navbar-avatar"
              style={{ cursor: 'pointer', border: 'none', background: 'var(--primary-color)' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {auth.user?.name?.charAt(0).toUpperCase()}
            </button>
            <div className="navbar-dropdown-menu">
              <span className="navbar-dropdown-item" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>
                {auth.user?.name}
              </span>
              <div className="navbar-dropdown-divider"></div>
              <span className="navbar-dropdown-item" style={{ cursor: 'default', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {auth.user?.email}
              </span>
              <div className="navbar-dropdown-divider"></div>
              <button
                className="navbar-dropdown-item"
                onClick={handleLogout}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', padding: '0.75rem 1.25rem' }}
              >
                Logout
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
