import React from 'react';
import FaviconLogo from './FaviconLogo.jsx';

function WelcomePage() {
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
      <img
        src="/favicon.ico"
        alt="Logo"
        style={{
          width: 120,
          height: 120,
          borderRadius: 24,
          marginBottom: 32,
          boxShadow: '0 4px 24px #0008',
          background: '#fff',
          padding: 12,
        }}
      />
      <div>
        <h1 style={{ fontSize: '3em', fontWeight: 900, marginBottom: 8 }}>Welcome to DAW Guru</h1>
        <p style={{ fontSize: '1.3em', marginBottom: 48 }}>Start your music production journey!</p>
      </div>
      <button
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
          width: '100%',
          maxWidth: 600,
          fontFamily: 'Pacifico, cursive, sans-serif',
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
      >
        Let's make some music
      </button>
    </div>
  );
}

export default WelcomePage;
