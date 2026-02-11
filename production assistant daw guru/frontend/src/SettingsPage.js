import React, { useState } from 'react';

const settingsStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #232323 60%, #444 100%)',
  color: '#fff',
};

const formStyle = {
  background: 'rgba(35,35,35,0.92)',
  borderRadius: '24px',
  padding: '2em 2em',
  boxShadow: '0 8px 32px #0008',
  textAlign: 'center',
  minWidth: '320px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5em',
  fontWeight: 600,
  color: '#ffb400',
};

const inputStyle = {
  width: '100%',
  padding: '0.75em',
  borderRadius: '8px',
  border: '1px solid #444',
  marginBottom: '1em',
  fontSize: '1em',
  background: '#333',
  color: '#fff',
};

const buttonStyle = {
  width: '100%',
  padding: '1em',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #ffb400 60%, #ff6a00 100%)',
  color: '#232323',
  fontWeight: 700,
  fontSize: '1.1em',
  border: 'none',
  boxShadow: '0 2px 8px #0004',
  cursor: 'pointer',
  marginTop: '1em',
};

function SettingsPage({ onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [setupStatus, setSetupStatus] = useState('');

  const handleSetup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const result = await response.json();
      setSetupStatus(result.status || 'Setup complete');
      if (onSave) onSave(apiKey);
    } catch (error) {
      setSetupStatus('Setup failed: ' + error);
    }
  };

  const claimApiUrl = 'https://platform.openai.com/account/api-keys'; // Example: OpenAI API key claim page
  return (
    <div style={settingsStyle}>
      <form style={formStyle} onSubmit={handleSetup}>
        <h2 style={{ color: '#ffb400', marginBottom: '1em' }}>Settings</h2>
        <label style={labelStyle}>Paste API Key (optional)</label>
        <input style={inputStyle} type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API key" />
        <button style={buttonStyle} type="submit">Save & Setup</button>
        <button style={{ ...buttonStyle, background: '#232323', color: '#ffb400', marginTop: '0.5em' }} type="button" onClick={() => window.open(claimApiUrl, '_blank')}>Claim API Key</button>
        {setupStatus && <div style={{ color: '#ffb400', marginTop: '1em' }}>{setupStatus}</div>}
      </form>
    </div>
  );
}

export default SettingsPage;
