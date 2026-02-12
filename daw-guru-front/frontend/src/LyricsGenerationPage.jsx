import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu.jsx';


function LyricsGenerationPage({ onGenerate }) {
  const [style, setStyle] = useState('Pop');
  const [emotion, setEmotion] = useState('Happy');
  const [language, setLanguage] = useState('English');
  const [vocalType, setVocalType] = useState('Male');
  const [ethnicity, setEthnicity] = useState('Default');
  const [genre, setGenre] = useState('Pop');
  const [topic, setTopic] = useState('');
  const [outputType, setOutputType] = useState('lyrics'); // 'lyrics' or 'voice'
  const [songFile, setSongFile] = useState(null);
  const [bpm, setBpm] = useState(120);
  const [beatsPerLine, setBeatsPerLine] = useState(4);
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('style', style);
    formData.append('emotion', emotion);
    formData.append('language', language);
    formData.append('vocal_type', vocalType);
    formData.append('ethnicity', ethnicity);
    formData.append('genre', genre);
    formData.append('topic', topic);
    formData.append('output_type', outputType);
    if (songFile) formData.append('song_file', songFile);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/generate-lyrics`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setGeneratedLyrics(result.lyrics || '');
      onGenerate(result);
    } catch (error) {
      alert('Lyrics generation failed: ' + error);
    }
  };

  return (
    <div className="central-page lyrics-gen-flex">
      <HamburgerMenu />
      <form className="lyrics-form" onSubmit={handleSubmit} style={{ minWidth: 280, maxWidth: 400, flex: 1, margin: 0, padding: 16 }}>
        <h2 className="lyrics-title">Lyrics & Voice Generator</h2>
        <label className="lyrics-label">Genre</label>
        <select className="lyrics-input" value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Jazz">Jazz</option>
          <option value="Country">Country</option>
          <option value="Electronic">Electronic</option>
          <option value="Other">Other</option>
        </select>
        <label className="lyrics-label">Style</label>
        <input className="lyrics-input" type="text" value={style} onChange={e => setStyle(e.target.value)} placeholder="Style (e.g. Ballad, Rap)" required />
        <label className="lyrics-label">Emotion</label>
        <select className="lyrics-input" value={emotion} onChange={e => setEmotion(e.target.value)}>
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Angry">Angry</option>
          <option value="Romantic">Romantic</option>
          <option value="Inspirational">Inspirational</option>
          <option value="Other">Other</option>
        </select>
        <label className="lyrics-label">BPM</label>
        <input className="lyrics-input" type="number" value={bpm} onChange={e => setBpm(Number(e.target.value))} min={40} max={240} placeholder="Beats Per Minute" required />
        <label className="lyrics-label">Beats Per Line</label>
        <input className="lyrics-input" type="number" value={beatsPerLine} onChange={e => setBeatsPerLine(Number(e.target.value))} min={1} max={16} placeholder="Beats Per Line" required />
        <label className="lyrics-label">Language</label>
        <input className="lyrics-input" type="text" value={language} onChange={e => setLanguage(e.target.value)} placeholder="Language (e.g. English)" required />
        <label className="lyrics-label">Vocal Type</label>
        <input className="lyrics-input" type="text" value={vocalType} onChange={e => setVocalType(e.target.value)} placeholder="Vocal Type (e.g. Male, Female)" required />
        <label className="lyrics-label">Ethnicity</label>
        <input className="lyrics-input" type="text" value={ethnicity} onChange={e => setEthnicity(e.target.value)} placeholder="Ethnicity (optional)" />
        <label className="lyrics-label">Topic</label>
        <input className="lyrics-input" type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Song topic or keywords" required />
        <label className="lyrics-label">Output Type</label>
        <select className="lyrics-input" value={outputType} onChange={e => setOutputType(e.target.value)}>
          <option value="lyrics">Lyrics Only</option>
          <option value="voice">Lyrics + Voice</option>
        </select>
        {outputType === 'voice' && (
          <div className="lyrics-upload-section">
            <label className="lyrics-label">Upload Song (for fitting vocals)</label>
            <input className="lyrics-input" type="file" accept="audio/*" onChange={e => setSongFile(e.target.files[0])} />
          </div>
        )}
        {/* Voice tuning controls */}
        <div className="voice-tuning-section">
          <label className="voice-tuning-label">Pitch</label>
          <input type="range" min="-12" max="12" value={bpm} onChange={e => setBpm(Number(e.target.value))} className="voice-tuning-range" />
          <div className="voice-tuning-value">{bpm} semitones</div>
        </div>
        <div className="voice-tuning-section">
          <label className="voice-tuning-label">Vibrato</label>
          <input type="range" min="0" max="100" value={beatsPerLine} onChange={e => setBeatsPerLine(Number(e.target.value))} className="voice-tuning-range" />
          <div className="voice-tuning-value">{beatsPerLine}%</div>
        </div>
        <div className="voice-tuning-section">
          <label className="voice-tuning-label">Timbre</label>
          <select className="voice-tuning-select">
            <option value="default">Default</option>
            <option value="bright">Bright</option>
            <option value="warm">Warm</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button className="lyrics-button" type="submit">Generate Voice</button>
      </form>
      {/* Editable lyrics output box */}
      <div className="lyrics-edit-box">
        <h3 style={{ color: '#ffb400', marginBottom: 8 }}>Generated Lyrics</h3>
        <textarea
          className="lyrics-edit-textarea"
          value={generatedLyrics}
          onChange={e => setGeneratedLyrics(e.target.value)}
          placeholder="Generated lyrics will appear here..."
        />
      </div>
    </div>
  );
}

export default LyricsGenerationPage;
