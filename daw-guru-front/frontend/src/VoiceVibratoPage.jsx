import React from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';

function VoiceVibratoPage({ vibrato, setVibrato }) {
  return (
    <div className="voice-tuning-console">
      <HamburgerMenu />
      <h2 className="voice-tuning-title">Adjust Vibrato</h2>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Vibrato</label>
        <input type="range" min="0" max="100" value={vibrato} onChange={e => setVibrato(Number(e.target.value))} className="voice-tuning-range" />
        <div className="voice-tuning-value">{vibrato}%</div>
      </div>
    </div>
  );
}

export default VoiceVibratoPage;
