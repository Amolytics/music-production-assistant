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
    <div style={{
      background: '#232323',
      borderRadius: '16px',
      boxShadow: '0 4px 24px #0008',
      padding: '2em',
      marginTop: '2em',
      color: '#f0f0f0',
      maxWidth: '420px',
      fontFamily: 'Montserrat, Arial, sans-serif',
      border: '2px solid #444',
    }}>
      <h2 style={{
        fontWeight: 700,
        letterSpacing: '0.05em',
        marginBottom: '1em',
        color: '#ffb400',
        textShadow: '0 2px 8px #0006',
      }}>Voice Tuning Console</h2>
      <div style={{ marginBottom: '1.5em' }}>
        <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 600 }}>Pitch</label>
        <input type="range" min="-12" max="12" value={pitch} onChange={e => setPitch(Number(e.target.value))}
          style={{ width: '100%' }} />
        <div style={{ textAlign: 'right', color: '#ffb400', fontWeight: 500 }}>{pitch} semitones</div>
      </div>
      <div style={{ marginBottom: '1.5em' }}>
        <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 600 }}>Vibrato</label>
        <input type="range" min="0" max="100" value={vibrato} onChange={e => setVibrato(Number(e.target.value))}
          style={{ width: '100%' }} />
        <div style={{ textAlign: 'right', color: '#ffb400', fontWeight: 500 }}>{vibrato}%</div>
      </div>
      <div style={{ marginBottom: '1.5em' }}>
        <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 600 }}>Timbre</label>
        <select value={timbre} onChange={e => setTimbre(e.target.value)}
          style={{ width: '100%', padding: '0.5em', borderRadius: '8px', background: '#333', color: '#ffb400', fontWeight: 500 }}>
          <option value="default">Default</option>
          <option value="bright">Bright</option>
          <option value="warm">Warm</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button onClick={handleTune}
        style={{
          width: '100%',
          padding: '0.75em',
          borderRadius: '8px',
          background: '#ffb400',
          color: '#232323',
          fontWeight: 700,
          fontSize: '1.1em',
          border: 'none',
          boxShadow: '0 2px 8px #0004',
          cursor: 'pointer',
          marginTop: '1em',
        }}>
        Apply Tuning & Replay Voice
      </button>
    </div>
  );
}

export default VoiceTuningConsole;
