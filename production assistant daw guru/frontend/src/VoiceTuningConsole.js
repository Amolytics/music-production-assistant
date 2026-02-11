import React, { useState } from 'react';

function VoiceTuningConsole({ initialTuning, onTune, onReplay }) {
  const [pitch, setPitch] = useState(initialTuning.pitch || 0);
  const [vibrato, setVibrato] = useState(initialTuning.vibrato || 0);
  const [timbre, setTimbre] = useState(initialTuning.timbre || 'default');

  const handleTune = async () => {
    onTune({ pitch, vibrato, timbre });
    try {
      const response = await fetch('http://localhost:8000/tune-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pitch, vibrato, timbre }),
      });
      const result = await response.json();
      onReplay(result);
    } catch (error) {
      alert('Voice tuning failed: ' + error);
    }
  };

  return (
    <div className="voice-tuning-console">
      <h2 className="voice-tuning-title">Voice Tuning Console</h2>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Pitch</label>
        <input type="range" min="-12" max="12" value={pitch} onChange={e => setPitch(Number(e.target.value))} className="voice-tuning-range" />
        <div className="voice-tuning-value">{pitch} semitones</div>
      </div>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Vibrato</label>
        <input type="range" min="0" max="100" value={vibrato} onChange={e => setVibrato(Number(e.target.value))} className="voice-tuning-range" />
        <div className="voice-tuning-value">{vibrato}%</div>
      </div>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Timbre</label>
        <select value={timbre} onChange={e => setTimbre(e.target.value)} className="voice-tuning-select">
          <option value="default">Default</option>
          <option value="bright">Bright</option>
          <option value="warm">Warm</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button onClick={handleTune} className="voice-tuning-button">
        Apply Tuning & Replay Voice
      </button>
    </div>
  );
}

export default VoiceTuningConsole;
