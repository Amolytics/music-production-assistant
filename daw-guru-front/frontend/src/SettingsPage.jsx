import React, { useState } from 'react';



function SettingsPage({ onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [setupStatus, setSetupStatus] = useState('');

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
    } catch (error) {
      setSetupStatus('Setup failed: ' + error);
    }
  };

  const claimApiUrl = 'https://platform.openai.com/account/api-keys'; // Example: OpenAI API key claim page
  return (
    <div className="settings-page">
      <form className="settings-form" onSubmit={handleSetup}>
        <h2 className="settings-title">Settings</h2>
        <label className="settings-label">Paste API Key (optional)</label>
        <input className="settings-input" type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API key" />
        <button className="settings-btn" type="submit">Save & Setup</button>
        <button className="settings-btn-alt" type="button" onClick={() => window.open(claimApiUrl, '_blank')}>Claim API Key</button>
        {setupStatus && <div className="settings-status">{setupStatus}</div>}
      </form>
    </div>
  );
}

export default SettingsPage;
