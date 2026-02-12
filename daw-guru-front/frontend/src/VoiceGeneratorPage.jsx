import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';

function VoiceGeneratorPage() {
  const [lyrics, setLyrics] = useState('');
  const [voiceType, setVoiceType] = useState('Male');
  const [language, setLanguage] = useState('English');
  const [ethnicity, setEthnicity] = useState('Default');
  const [pitch, setPitch] = useState(0);
  const [vibrato, setVibrato] = useState(0);
  const [timbre, setTimbre] = useState('default');
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/generate-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lyrics, voiceType, language, ethnicity, pitch, vibrato, timbre }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Voice generation failed: ' + error);
    }
  };

  return (
    <div className="central-page" style={{display:'flex',flexDirection:'row',gap:'2em',alignItems:'flex-start',justifyContent:'center',flexWrap:'wrap'}}>
      <HamburgerMenu />
      {/* Voice Tuning Console Placeholder */}
      <div style={{background:'#232323',borderRadius:16,padding:24,minWidth:300,maxWidth:400,boxShadow:'0 2px 8px #0006',flex:1}}>
        <h3 style={{color:'#ffb400',marginBottom:12}}>Voice Tuning Console</h3>
        <div style={{color:'#aaa',marginBottom:12}}>Adjust the voice parameters below before generating your voice.</div>
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
      </div>
      {/* Voice Generation Placeholder */}
      <div style={{background:'#232323',borderRadius:16,padding:24,minWidth:300,maxWidth:400,boxShadow:'0 2px 8px #0006',flex:1}}>
        <h3 style={{color:'#ffb400',marginBottom:12}}>Voice Generation</h3>
        <div style={{color:'#aaa',marginBottom:12}}>Paste lyrics and generate your custom voice below.</div>
        <div className="voice-tuning-section">
          <label className="voice-tuning-label">Lyrics to Sing</label>
          <textarea
            className="lyrics-edit-textarea"
            style={{ minHeight: 320, width: '100%', borderRadius: 8, padding: 12, background: '#232323', color: '#fff', border: '1px solid #444', fontSize: 16, resize: 'vertical', boxSizing: 'border-box' }}
            value={lyrics}
            onChange={e => setLyrics(e.target.value)}
            placeholder="Paste or write lyrics here"
          />
        </div>
        <button onClick={handleGenerate} className="voice-tuning-button" style={{marginTop:16}}>
          Generate Voice
        </button>
        {result && (
          <div className="voice-result" style={{marginTop:16}}>
            <h4>Voice Generation Result</h4>
            {result.audioUrl && <audio controls src={result.audioUrl} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceGeneratorPage;
