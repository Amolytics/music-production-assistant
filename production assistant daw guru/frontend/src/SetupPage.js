import React, { useState } from 'react';

const setupStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #232323 60%, #444 100%)',
  color: '#fff',
};

const formStyle = {
  background: 'rgba(35,35,35,0.92)',
  borderRadius: '24px',
  padding: '2em 2em',
  boxShadow: '0 8px 32px #0008',
  textAlign: 'center',
  minWidth: '320px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5em',
  fontWeight: 600,
  color: '#ffb400',
};

const inputStyle = {
  width: '100%',
  padding: '0.75em',
  borderRadius: '8px',
  border: '1px solid #444',
  marginBottom: '1em',
  fontSize: '1em',
  background: '#333',
  color: '#fff',
};

const buttonStyle = {
  width: '100%',
  padding: '1em',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #ffb400 60%, #ff6a00 100%)',
  color: '#232323',
  fontWeight: 700,
  fontSize: '1.1em',
  border: 'none',
  boxShadow: '0 2px 8px #0004',
  cursor: 'pointer',
  marginTop: '1em',
};

function SetupPage({ onComplete }) {
  const [name, setName] = useState('');
  const [daw, setDaw] = useState('Ableton');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, daw }),
      });
      const result = await response.json();
      onComplete(result);
    } catch (error) {
      alert('Setup failed: ' + error);
    }
  };

  return (
    <div style={setupStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ color: '#ffb400', marginBottom: '1em' }}>Setup Your Studio</h2>
        <label style={labelStyle}>Your Name</label>
        <input style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />
        <label style={labelStyle}>Select Your DAW</label>
        <select style={inputStyle} value={daw} onChange={e => setDaw(e.target.value)}>
          <option value="Ableton">Ableton Live</option>
          <option value="FL Studio">FL Studio</option>
          <option value="Logic Pro">Logic Pro</option>
          <option value="Cubase">Cubase</option>
          <option value="Pro Tools">Pro Tools</option>
          <option value="Reaper">Reaper</option>
          <option value="Other">Other</option>
        </select>
        <button style={buttonStyle} type="submit">Continue</button>
      </form>
    </div>
  );
}

export default SetupPage;
