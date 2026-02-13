import React, { useState } from 'react';

function SetupPage({ onComplete }) {
  const [name, setName] = useState('');
  const [daw, setDaw] = useState('Ableton');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onComplete) onComplete({ name, daw });
  };

  return (
    <div className="setup-page">
      <form className="setup-form" onSubmit={handleSubmit}>
        <h2 className="setup-title">Setup Your Studio</h2>
        <label className="setup-label">Your Name</label>
        <input className="setup-input" type="text" id="setup-name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />
        <label className="setup-label">Select Your DAW</label>
        <select className="setup-input" id="setup-daw" name="daw" value={daw} onChange={e => setDaw(e.target.value)}>
          <option value="Ableton">Ableton Live</option>
          <option value="FL Studio">FL Studio</option>
          <option value="Logic Pro">Logic Pro</option>
          <option value="Cubase">Cubase</option>
          <option value="Pro Tools">Pro Tools</option>
          <option value="Reaper">Reaper</option>
          <option value="Other">Other</option>
        </select>
        <button className="setup-btn" type="submit">Continue</button>
      </form>
    </div>
  );
}

export default SetupPage;
