import React from 'react';
import DetachableChatBox from './DetachableChatBox';
import VoiceTuningConsole from './VoiceTuningConsole';
import './App.css';

const mainStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #232323 60%, #444 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontFamily: 'Montserrat, Arial, sans-serif',
};

const panelStyle = {
  background: 'rgba(35,35,35,0.92)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px #0008',
  padding: '2em',
  margin: '1em',
  minWidth: '340px',
  maxWidth: '600px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const meterStyle = {
  width: '100%',
  height: '16px',
  background: '#333',
  borderRadius: '8px',
  margin: '1em 0',
  boxShadow: '0 2px 8px #0004',
};

const knobStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: '#444',
  boxShadow: '0 2px 8px #0006',
  margin: '1em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffb400',
  fontWeight: 700,
  fontSize: '1.2em',
};

function MainStudioInterface() {
  const [sampleUrl, setSampleUrl] = React.useState('https://freesound.org/data/previews/123/123456_7037-lq.mp3');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const handleSampleSearch = async () => {
    setSearching(true);
    const response = await fetch(`${backendUrl}/search-sample?description=${encodeURIComponent(searchTerm)}`);
    const result = await response.json();
    setSampleUrl(result.sample_url);
    setSearching(false);
  };
  return (
    <div className="main-studio">
      <div className="studio-panel">
        <h2 className="studio-title">DAW Guru Studio Console</h2>
        <div className="studio-meter">
          {/* Placeholder for audio meter */}
          <div className="meter-bar" />
        </div>
        <div className="studio-knobs">
          <div className="studio-knob">Tune</div>
          <div className="studio-knob">Mix</div>
          <div className="studio-knob">FX</div>
        </div>
        <VoiceTuningConsole initialTuning={{ pitch: 0, vibrato: 0, timbre: 'default' }} onTune={() => {}} onReplay={() => {}} />
      </div>
      {/* Audio/MIDI Visualization Panel */}
      <div className="studio-panel studio-panel-wide">
        <h3 className="studio-subtitle">Audio/MIDI Visualization</h3>
        <div className="studio-visualization">
          {/* Visualization placeholder: waveform, MIDI notes, etc. */}
          <div className="visualization-placeholder">Live waveform & MIDI display coming soon...</div>
        </div>
        {/* Sample search and preview controls */}
        <div className="studio-search">
          <label htmlFor="sample-search" className="studio-label">Search for a sample:</label>
          <input
            id="sample-search"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search for a sample..."
            autoComplete="off"
            className="studio-input"
          />
          <button className="studio-button"
            disabled={searching}
            onClick={handleSampleSearch}>{searching ? 'Searching...' : 'Search'}</button>
        </div>
        <div className="studio-audio-controls">
          <audio id="sample-audio" src={sampleUrl} preload="auto" />
          <button className="studio-button audio-play"
            onClick={() => document.getElementById('sample-audio').play()}>Play Sample</button>
          <button className="studio-button audio-stop"
            onClick={() => { const audio = document.getElementById('sample-audio'); audio.pause(); audio.currentTime = 0; }}>Stop</button>
          <button className="studio-button audio-discard"
            onClick={() => { const audio = document.getElementById('sample-audio'); audio.pause(); audio.currentTime = 0; setSampleUrl(''); }}>Discard</button>
          <button className="studio-button audio-send"
            onClick={async () => {
              await fetch(`${backendUrl}/send-to-daw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sample_url: sampleUrl })
              });
              alert('Sample sent to DAW!');
            }}>Send to DAW</button>
        </div>
      </div>
      {/* Plugin Management Panel */}
      <div className="studio-panel studio-panel-wide">
        <h3 className="studio-subtitle">Plugin Management</h3>
        <div className="studio-plugin-list">
          {/* Dynamic plugin list */}
          <PluginManager />
        </div>
      </div>
      <DetachableChatBox visible={true} onClose={() => {}} />
    </div>
  );
}

function PluginManager() {
  const [plugins, setPlugins] = React.useState([]);
  const [newPlugin, setNewPlugin] = React.useState('');
  const [scanning, setScanning] = React.useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  React.useEffect(() => {
    fetch(`${backendUrl}/scan-plugins`)
      .then(res => res.json())
      .then(data => setPlugins(data.plugins || []));
  }, [backendUrl]);
  const handleScan = async () => {
    setScanning(true);
    const res = await fetch(`${backendUrl}/scan-plugins`);
    const data = await res.json();
    setPlugins(data.plugins || []);
    setScanning(false);
  };
  const handleAdd = async () => {
    if (!newPlugin) return;
    await fetch(`${backendUrl}/add-plugin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPlugin })
    });
    setPlugins([...plugins, newPlugin]);
    setNewPlugin('');
  };
  return (
    <div>
      <div style={{ marginBottom: '1em' }}>
        <strong>Plugins:</strong>
        <ul style={{ paddingLeft: '1em', color: '#fff' }}>
          {plugins.map((p, idx) => <li key={idx}>{p}</li>)}
        </ul>
      </div>
      <div style={{ marginTop: '1em', color: '#fff' }}>
        <button style={{ ...buttonStyle, width: 'auto', padding: '0.5em 1em', fontSize: '1em' }}
          onClick={handleScan} disabled={scanning}>{scanning ? 'Scanning...' : 'Scan Plugins'}</button>
        <input
          type="text"
          value={newPlugin}
          onChange={e => setNewPlugin(e.target.value)}
          placeholder="Add plugin..."
          style={{ marginLeft: '1em', padding: '0.5em', borderRadius: '8px', border: '1px solid #444', fontSize: '1em' }}
        />
        <button style={{ ...buttonStyle, width: 'auto', padding: '0.5em 1em', fontSize: '1em', marginLeft: '1em', background: '#232323', color: '#ffb400' }}
          onClick={handleAdd}>Add Plugin</button>
      </div>
    </div>
  );
}

export default MainStudioInterface;
