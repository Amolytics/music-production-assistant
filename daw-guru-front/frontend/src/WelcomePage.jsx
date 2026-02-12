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
      <div
        style={{
          background: 'rgba(34,34,59,0.96)',
          borderRadius: 48,
          boxShadow: '0 8px 48px #000a',
          padding: '64px 48px 48px 48px',
          maxWidth: 520,
          width: '90vw',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
        onClick={() => navigate('/settings')}
      >
        Let's make some music
      </button>
    </div>
  );
}

export default WelcomePage;
