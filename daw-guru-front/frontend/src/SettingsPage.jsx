
import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';
import { useNavigate } from 'react-router-dom';





function SettingsPage({ onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [userName, setUserName] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(15);
  const [sessionGoal, setSessionGoal] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [setupStatus, setSetupStatus] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch user info on mount
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/user-info`)
      .then(res => res.json())
      .then(data => {
        if (data.name) setUserName(data.name);
        if (typeof data.reminder_enabled === 'boolean') setReminderEnabled(data.reminder_enabled);
        if (typeof data.reminder_interval === 'number') setReminderInterval(data.reminder_interval);
        if (typeof data.session_goal === 'string') setSessionGoal(data.session_goal);
        if (Array.isArray(data.favorite_genres)) setFavoriteGenres(data.favorite_genres);
      });
  }, []);

  const handleSetup = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey, name: userName, reminder_enabled: reminderEnabled, reminder_interval: reminderInterval, session_goal: sessionGoal, favorite_genres: favoriteGenres }),
      });
      const result = await response.json();
      setSetupStatus(result.status || 'Setup complete');
      if (onSave) onSave(apiKey);
      // Redirect to navigation page after successful setup
      if (result.status === 'setup complete' || result.status) {
        navigate('/nav');
      }
    } catch (error) {
      setSetupStatus('Setup failed: ' + error);
    }
  };

  const claimApiUrl = 'https://platform.openai.com/account/api-keys';
  return (
    <div className="settings-page">
      <HamburgerMenu />
      <form className="settings-form" onSubmit={handleSetup}>
        <h2 className="settings-title">Settings</h2>
        <label className="settings-label">Your Name</label>
        <input className="music-input" type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter your name" />
        <label className="settings-label">Paste API Key (optional)</label>
        <input className="music-input" type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API key" />
        <label className="settings-label">Session Goal</label>
        <input className="music-input" type="text" value={sessionGoal} onChange={e => setSessionGoal(e.target.value)} placeholder="What do you want to achieve this session?" />
        <label className="settings-label">Favorite Genres</label>
        <select
          className="music-input"
          multiple
          value={favoriteGenres}
          onChange={e => {
            const options = Array.from(e.target.selectedOptions).map(o => o.value);
            setFavoriteGenres(options);
          }}
        >
          {['Pop','EDM','House','Bounce','Hardvore','HipHop','Trap','Metal','Country','Blues','Folk'].map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <div style={{fontSize:'0.9em',color:'#888',marginTop:4}}>Hold Ctrl/Cmd to select multiple genres</div>
        <label className="settings-label">
          <input type="checkbox" checked={reminderEnabled} onChange={e => setReminderEnabled(e.target.checked)} />
          Remind me every
          <input
            type="number"
            min="1"
            max="120"
            value={reminderInterval}
            onChange={e => setReminderInterval(Number(e.target.value))}
            style={{ width: '3em', margin: '0 0.5em' }}
            disabled={!reminderEnabled}
          />
          minutes to upload a sample for feedback
        </label>
        <button className="music-input" type="submit">Save & Setup</button>
        <button className="music-input" type="button" onClick={() => window.open(claimApiUrl, '_blank')}>Claim API Key</button>
        {setupStatus && <div className="settings-status">{setupStatus}</div>}
      </form>
    </div>
  );
}

export default SettingsPage;
