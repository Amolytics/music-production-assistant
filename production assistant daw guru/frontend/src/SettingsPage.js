import React, { useState } from 'react';



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
    <div className="settings-page">
      <form className="settings-form" onSubmit={handleSetup}>
        <h2 className="settings-title">Settings</h2>
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
