
import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';
import { useNavigate } from 'react-router-dom';

function SettingsPage({ onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [setupStatus, setSetupStatus] = useState('');
  const navigate = useNavigate();

  const handleSetup = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const result = await response.json();
      setSetupStatus(result.status || 'Setup complete');
      if (onSave) onSave(apiKey);
      // Redirect to navigation page after successful setup
      if (result.status === 'Setup complete' || result.status) {
        navigate('/nav');
      }
    } catch (error) {
      setSetupStatus('Setup failed: ' + error);
    }
  };

  const claimApiUrl = 'https://platform.openai.com/account/api-keys'; // Example: OpenAI API key claim page
  return (
    <div className="settings-page">
      <HamburgerMenu />
      <form className="settings-form" onSubmit={handleSetup}>
        <h2 className="settings-title">Settings</h2>
        <label className="settings-label">Paste API Key (optional)</label>
        <input className="music-input" type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API key" />
        <button className="music-input" type="submit">Save & Setup</button>
        <button className="music-input" type="button" onClick={() => window.open(claimApiUrl, '_blank')}>Claim API Key</button>
        {setupStatus && <div className="settings-status">{setupStatus}</div>}
      </form>
    </div>
  );
}

export default SettingsPage;
