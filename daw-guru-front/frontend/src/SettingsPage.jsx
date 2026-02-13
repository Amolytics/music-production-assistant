
import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';
import { useNavigate } from 'react-router-dom';





function SettingsPage({ onSave }) {
  const [persona, setPersona] = useState('friendly music assistant who gives creative, supportive advice');
  const [setupStatus, setSetupStatus] = useState('');
  const navigate = useNavigate();

  const handleSetup = async (e) => {
    e.preventDefault();
    try {
      // You can POST persona to the backend if you want to persist it
      setSetupStatus('Persona saved!');
      if (onSave) onSave(persona);
      navigate('/nav');
    } catch (error) {
      setSetupStatus('Setup failed: ' + error);
    }
  };

  return (
    <div className="settings-page">
      <HamburgerMenu />
      <form className="settings-form" onSubmit={handleSetup}>
        <h2 className="settings-title">AI Persona</h2>
        <label className="settings-label">You are a...</label>
        <input
          className="music-input"
          type="text"
          value={persona}
          onChange={e => setPersona(e.target.value)}
          placeholder="e.g. friendly music assistant who gives creative, supportive advice"
        />
        <button className="music-input" type="submit">Save Persona</button>
        {setupStatus && <div className="settings-status">{setupStatus}</div>}
      </form>
    </div>
  );
}

export default SettingsPage;
