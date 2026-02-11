import React, { useState } from 'react';

const pageStyle = {
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
    <div style={pageStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ color: '#ffb400', marginBottom: '1em' }}>Generate Lyrics</h2>
        <div style={{ marginBottom: '1em' }}>
          <button type="button" style={{ ...buttonStyle, width: '48%', marginRight: '2%' }}
            onClick={() => setOutputType('lyrics')}
            className={outputType === 'lyrics' ? 'active' : ''}>
            Lyrics Only
          </button>
          <button type="button" style={{ ...buttonStyle, width: '48%' }}
            onClick={() => setOutputType('voice')}
            className={outputType === 'voice' ? 'active' : ''}>
            Lyrics as Voice
          </button>
        </div>
        <label style={labelStyle}>Music Style</label>
        <select style={inputStyle} value={style} onChange={e => setStyle(e.target.value)}>
          <option value="Pop">Pop</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="EDM">EDM</option>
          <option value="Jazz">Jazz</option>
          <option value="Rock">Rock</option>
          <option value="Classical">Classical</option>
        </select>
        <label style={labelStyle}>Emotion</label>
        <select style={inputStyle} value={emotion} onChange={e => setEmotion(e.target.value)}>
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Angry">Angry</option>
          <option value="Romantic">Romantic</option>
          <option value="Inspiring">Inspiring</option>
        </select>
        <label style={labelStyle}>Language</label>
        <select style={inputStyle} value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Chinese">Chinese</option>
          <option value="Other">Other</option>
        </select>
        <label style={labelStyle}>Vocal Type</label>
        <select style={inputStyle} value={vocalType} onChange={e => setVocalType(e.target.value)}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Child">Child</option>
          <option value="Robotic">Robotic</option>
          <option value="Custom">Custom</option>
        </select>
        <label style={labelStyle}>Ethnicity</label>
        <select style={inputStyle} value={ethnicity} onChange={e => setEthnicity(e.target.value)}>
          <option value="Default">Default</option>
          <option value="Gospel">Gospel</option>
          <option value="Latin">Latin</option>
          <option value="Asian">Asian</option>
          <option value="Other">Other</option>
        </select>
        <label style={labelStyle}>Music Genre</label>
        <select style={inputStyle} value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="Pop">Pop</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="EDM">EDM</option>
          <option value="Jazz">Jazz</option>
          <option value="Rock">Rock</option>
          <option value="Classical">Classical</option>
        </select>
        <label style={labelStyle}>Topic/Theme</label>
        <input style={inputStyle} type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter topic or theme" />
        {outputType === 'voice' && (
          <div style={{ marginTop: '1em' }}>
            <label style={labelStyle}>Upload Song (for fitting vocals)</label>
            <input style={inputStyle} type="file" accept="audio/*" onChange={e => setSongFile(e.target.files[0])} />
          </div>
        )}
        <button style={buttonStyle} type="submit">Generate Lyrics</button>
      </form>
    </div>
  );
}

export default LyricsGenerationPage;
