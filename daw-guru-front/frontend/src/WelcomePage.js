import React from 'react';

// ...existing code...

function WelcomePage({ onStart }) {
  return (
    <div className="welcome-bg">
      <div className="welcome-overlay">
        <h1 className="welcome-title">Welcome to DAW Guru</h1>
        <p className="welcome-subtitle">Your AI-powered studio companion</p>
        <button className="welcome-btn" onClick={onStart}>
          Let's make some music
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
