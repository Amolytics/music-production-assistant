import React from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';

function VoiceTimbrePage({ timbre, setTimbre }) {
  return (
    <div className="voice-tuning-console">
      <HamburgerMenu />
      <h2 className="voice-tuning-title">Select Timbre</h2>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Timbre</label>
        <select value={timbre} onChange={e => setTimbre(e.target.value)} className="voice-tuning-select">
          <option value="default">Default</option>
          <option value="bright">Bright</option>
          <option value="warm">Warm</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
}

export default VoiceTimbrePage;
