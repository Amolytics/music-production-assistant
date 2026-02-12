import React, { useState } from 'react';



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
      const response = await fetch('http://localhost:8000/generate-lyrics', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      onGenerate(result);
    } catch (error) {
      alert('Lyrics generation failed: ' + error);
    }
  };

  return (
    <div className="lyrics-page">
      <form className="lyrics-form" onSubmit={handleSubmit}>
        <h2 className="lyrics-title">Generate Lyrics or Voice</h2>
        <label className="lyrics-label">Genre</label>
        <input className="lyrics-input" type="text" value={genre} onChange={e => setGenre(e.target.value)} placeholder="Genre (e.g. Pop, Rock)" required />
        <label className="lyrics-label">Style</label>
        <input className="lyrics-input" type="text" value={style} onChange={e => setStyle(e.target.value)} placeholder="Style (e.g. Ballad, Rap)" required />
        <label className="lyrics-label">Emotion</label>
        <input className="lyrics-input" type="text" value={emotion} onChange={e => setEmotion(e.target.value)} placeholder="Emotion (e.g. Happy, Sad)" required />
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
        <button className="lyrics-button" type="submit">Generate</button>
      </form>
    </div>
  );
}

export default LyricsGenerationPage;
