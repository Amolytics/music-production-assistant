import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="hamburger-menu" style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
      <button
        className="hamburger-btn"
        onClick={() => setOpen(v => !v)}
        aria-label="Open menu"
        style={{ fontSize: '2rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <span className="hamburger-icon">☰</span>
      </button>
      <div className={`side-drawer${open ? ' open' : ''}`} style={{
        position: 'fixed',
        top: 0,
        right: open ? 0 : '-250px',
        width: '250px',
        height: '100vh',
        background: '#222',
        color: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        transition: 'right 0.3s',
        zIndex: 1001,
        display: open ? 'block' : 'none'
      }}>
        <button className="drawer-close-btn" onClick={() => setOpen(false)} aria-label="Close menu" style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: '1.5rem',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer'
        }}>×</button>
        <nav className="drawer-nav" style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link to="/main" className="drawer-link" onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>Studio</Link>
          <Link to="/settings" className="drawer-link" onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>Settings</Link>
          <Link to="/tuning" className="drawer-link" onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>Voice Tuning</Link>
          <Link to="/collaboration" className="drawer-link" onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>Collaboration</Link>
          <Link to="/sample-search" className="drawer-link" onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>Sample Search</Link>
          <Link to="/" className="drawer-link" onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>Welcome</Link>
        </nav>
      </div>
      {/* Overlay for closing drawer when clicking outside */}
      {open && <div className="drawer-overlay" onClick={() => setOpen(false)} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.2)',
        zIndex: 1000
      }} />}
    </div>
  );
}

export default HamburgerMenu;
