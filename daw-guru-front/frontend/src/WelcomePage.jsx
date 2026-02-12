import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#232323',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div className="welcome-placeholder">
        <img
          src="/logo.png"
          alt="Logo"
          className="welcome-logo"
        />
        <h1 className="welcome-title">Welcome to DAW Guru</h1>
        <p className="welcome-subtitle">Start your music production journey!</p>
        <button
          className="music-input welcome-btn"
          onClick={() => navigate('/settings')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
