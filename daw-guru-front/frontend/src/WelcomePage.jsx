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
          src="/favicon.ico"
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
          fontSize: '2.2em',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #00adb5 60%, #ffd166 100%)',
          color: '#1a1a2e',
          border: 'none',
          borderRadius: '32px 32px 0 0',
          padding: '32px 0 28px 0',
          boxShadow: '0 -4px 32px #0006',
          cursor: 'pointer',
          letterSpacing: '0.04em',
        }}
        onClick={() => navigate('/settings')}
      >
        Let's make some music
      </button>
    </div>
  );
}

export default WelcomePage;
