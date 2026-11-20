import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, FileDown, Code2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(prev => !prev);
  const closeMobile = () => setMobileOpen(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Skills', path: '/skills' },
    { label: 'Projects', path: '/projects' },
    { label: 'Education', path: '/education' },
    { label: 'Resume', path: '/resume' },
    { label: 'Contact', path: '/contact' },
    { label: 'Visitors', path: '/visitors' }
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="brand-logo" onClick={closeMobile}>
          <div className="brand-icon">
            <span>L</span>
          </div>
          <span>B M <span className="gradient-text">LOKESHA</span></span>
        </Link>

        {/* Desktop & Mobile Navigation Links */}
        <ul className={`nav-menu ${mobileOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          {/* Mobile view quick resume download */}
          {mobileOpen && (
            <li style={{ width: '100%', marginTop: '0.5rem' }}>
              <a
                href="/resume/B_M_Lokesha_Resume.pdf"
                download="B_M_Lokesha_Resume.pdf"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={closeMobile}
              >
                <FileDown size={18} />
                <span>Download Resume</span>
              </a>
            </li>
          )}
        </ul>

        {/* Action Controls */}
        <div className="nav-actions">
          <ThemeToggle />

          <a
            href="/resume/B_M_Lokesha_Resume.pdf"
            download="B_M_Lokesha_Resume.pdf"
            className="btn btn-primary desktop-only"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
          >
            <FileDown size={16} />
            <span>Resume</span>
          </a>

          <button
            className="mobile-toggle"
            onClick={toggleMobile}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  );
}
