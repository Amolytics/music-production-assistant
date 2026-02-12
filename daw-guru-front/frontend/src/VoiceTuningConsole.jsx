import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';

function VoiceTuningConsole({ initialTuning, onTune, onReplay, lyrics }) {
  const [pitch, setPitch] = useState(initialTuning.pitch || 0);
  const [vibrato, setVibrato] = useState(initialTuning.vibrato || 0);
  const [timbre, setTimbre] = useState(initialTuning.timbre || 'default');
  const [voiceType, setVoiceType] = useState('Male');
  const [language, setLanguage] = useState('English');
  const [ethnicity, setEthnicity] = useState('Default');
  const [lyricsText, setLyricsText] = useState(lyrics || '');

  const handleTune = async () => {
    onTune({ pitch, vibrato, timbre, lyrics: lyricsText });
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/tune-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pitch, vibrato, timbre, lyrics: lyricsText }),
      });
      const result = await response.json();
      onReplay(result);
    } catch (error) {
      alert('Voice tuning failed: ' + error);
    }
  };

  return (
    <div className="central-page voice-tuning-console">
      <HamburgerMenu />
      <h2 className="voice-tuning-title">Voice Tuning Console</h2>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Lyrics to Sing</label>
        <textarea
          className="voice-tuning-lyrics"
          value={lyricsText}
          onChange={e => setLyricsText(e.target.value)}
          rows={4}
          placeholder="Paste or edit lyrics here"
        />
      </div>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Voice Type</label>
        <select value={voiceType} onChange={e => setVoiceType(e.target.value)} className="voice-tuning-select">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Child">Child</option>
          <option value="Robot">Robot</option>
        </select>
      </div>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Language</label>
        <select value={language} onChange={e => setLanguage(e.target.value)} className="voice-tuning-select">
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="voice-tuning-section">
        <label className="voice-tuning-label">Ethnicity</label>
        <select value={ethnicity} onChange={e => setEthnicity(e.target.value)} className="voice-tuning-select">
          <option value="Default">Default</option>
          <option value="African">African</option>
          <option value="Asian">Asian</option>
          <option value="Caucasian">Caucasian</option>
          <option value="Latino">Latino</option>
          <option value="Other">Other</option>
        </select>
      </div>
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
