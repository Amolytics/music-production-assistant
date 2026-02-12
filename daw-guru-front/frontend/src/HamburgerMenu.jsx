import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="hamburger-menu">
      <button
        className="hamburger-btn"
        onClick={() => setOpen(v => !v)}
        aria-label="Open menu"
      >
        <span className="hamburger-icon">☰</span>
      </button>
      <div className={`side-drawer${open ? ' open' : ''}`}>
        <button className="drawer-close-btn" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
        <nav className="drawer-nav">
          <Link to="/main" className="drawer-link" onClick={() => setOpen(false)}>Studio</Link>
          <Link to="/settings" className="drawer-link" onClick={() => setOpen(false)}>Settings</Link>
          <Link to="/tuning" className="drawer-link" onClick={() => setOpen(false)}>Voice Tuning</Link>
          <Link to="/" className="drawer-link" onClick={() => setOpen(false)}>Welcome</Link>
        </nav>
      </div>
      {/* Overlay for closing drawer when clicking outside */}
      {open && <div className="drawer-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}

export default HamburgerMenu;
