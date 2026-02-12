import React, { useState } from 'react';

function VoiceTuningInterface({ onTune }) {
  const [pitch, setPitch] = useState(0);
  const [vibrato, setVibrato] = useState(0);
  const [timbre, setTimbre] = useState('default');

  const handleSubmit = (e) => {
    e.preventDefault();
    onTune({ pitch, vibrato, timbre });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pitch:
        <input type="range" min="-12" max="12" value={pitch} onChange={e => setPitch(Number(e.target.value))} />
        {pitch}
      </label>
      <br />
      <label>
        Vibrato:
        <input type="range" min="0" max="100" value={vibrato} onChange={e => setVibrato(Number(e.target.value))} />
        {vibrato}%
      </label>
      <br />
      <label>
        Timbre:
        <select value={timbre} onChange={e => setTimbre(e.target.value)}>
          <option value="default">Default</option>
          <option value="bright">Bright</option>
          <option value="warm">Warm</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <br />
      <button type="submit">Apply Tuning</button>
    </form>
  );
}

export default VoiceTuningInterface;
