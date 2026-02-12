import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="hamburger-menu">
      <button className="hamburger-icon" onClick={() => setOpen(v => !v)}>
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
      </button>
      {open && (
        <div className="hamburger-dropdown">
          <Link to="/" className="hamburger-link" onClick={() => setOpen(false)}>Studio</Link>
          <Link to="/settings" className="hamburger-link" onClick={() => setOpen(false)}>Settings</Link>
          <Link to="/main" className="hamburger-link" onClick={() => setOpen(false)}>Lyrics Generation</Link>
          <Link to="/tuning" className="hamburger-link" onClick={() => setOpen(false)}>Voice Tuning</Link>
          <Link to="/welcome" className="hamburger-link" onClick={() => setOpen(false)}>Welcome</Link>
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;
