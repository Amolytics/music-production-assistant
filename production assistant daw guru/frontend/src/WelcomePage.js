import React from 'react';

const backgroundStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #232323 60%, #444 100%)',
  backgroundImage: 'url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
};

const overlayStyle = {
  background: 'rgba(35,35,35,0.85)',
  borderRadius: '24px',
  padding: '3em 2em',
  boxShadow: '0 8px 32px #0008',
  textAlign: 'center',
};

const buttonStyle = {
  marginTop: '2em',
  padding: '1em 2.5em',
  fontSize: '1.5em',
  fontWeight: 700,
  borderRadius: '16px',
  background: 'linear-gradient(90deg, #ffb400 60%, #ff6a00 100%)',
  color: '#232323',
  border: 'none',
  boxShadow: '0 4px 16px #0006',
  cursor: 'pointer',
  letterSpacing: '0.05em',
};

function WelcomePage({ onStart }) {
  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <h1 style={{ fontSize: '3em', fontWeight: 900, marginBottom: '0.5em', letterSpacing: '0.05em' }}>
          Welcome to DAW Guru
        </h1>
        <p style={{ fontSize: '1.2em', marginBottom: '2em', color: '#ffb400' }}>
          Your AI-powered studio companion
        </p>
        <button style={buttonStyle} onClick={onStart}>
          Let's make some music
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
