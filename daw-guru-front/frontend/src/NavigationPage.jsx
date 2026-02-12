import React from 'react';
import { useNavigate } from 'react-router-dom';

const pages = [
  { path: '/lyrics-generation', label: 'Lyrics Generation' },
  { path: '/voice-generator', label: 'Voice Generator' },
  { path: '/collaboration', label: 'Collaboration' },
  { path: '/sample-search', label: 'Sample Search' },
  { path: '/settings', label: 'Settings' },
];

function NavigationPage() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-bg-dark) 60%, var(--color-bg-accent) 100%)',
      color: 'var(--color-text-main)',
      padding: 32,
    }}>
      <h1 style={{ fontSize: '2.5em', fontWeight: 900, marginBottom: 32 }}>Navigation</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', maxWidth: 700 }}>
        {pages.map(page => (
          <button
            key={page.path}
            onClick={() => navigate(page.path)}
            className="music-input"
            style={{
              minWidth: 180,
              minHeight: 64,
              fontSize: '1.3em',
              fontWeight: 700,
              borderRadius: 16,
              background: 'linear-gradient(90deg, var(--color-bg-accent) 60%, var(--color-bg-highlight) 100%)',
              color: 'var(--color-text-dark)',
              border: 'none',
              boxShadow: '0 2px 12px #0004',
              cursor: 'pointer',
              margin: 8,
              letterSpacing: '0.03em',
            }}
          >
            {page.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default NavigationPage;
