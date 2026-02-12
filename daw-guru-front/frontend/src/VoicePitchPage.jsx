import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';

function VoicePitchPage({ pitch, setPitch }) {
  return (
    <div className="voice-tuning-console">
      <HamburgerMenu />
      <h2 className="voice-tuning-title">Adjust Pitch</h2>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Pitch</label>
        <input type="range" min="-12" max="12" value={pitch} onChange={e => setPitch(Number(e.target.value))} className="voice-tuning-range" />
        <div className="voice-tuning-value">{pitch} semitones</div>
      </div>
    </div>
  );
}

export default VoicePitchPage;
