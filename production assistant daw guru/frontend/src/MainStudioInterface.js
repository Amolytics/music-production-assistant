import React from 'react';
import DetachableChatBox from './DetachableChatBox';
import VoiceTuningConsole from './VoiceTuningConsole';

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
  const handleSampleSearch = async () => {
    setSearching(true);
    const response = await fetch(`http://localhost:8000/search-sample?description=${encodeURIComponent(searchTerm)}`);
    const result = await response.json();
    setSampleUrl(result.sample_url);
    setSearching(false);
  };
  return (
    <div style={mainStyle}>
      <div style={panelStyle}>
        <h2 style={{ color: '#ffb400', fontWeight: 900, marginBottom: '1em' }}>DAW Guru Studio Console</h2>
        <div style={meterStyle}>
          {/* Placeholder for audio meter */}
          <div style={{ width: '60%', height: '100%', background: '#ffb400', borderRadius: '8px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={knobStyle}>Tune</div>
          <div style={knobStyle}>Mix</div>
          <div style={knobStyle}>FX</div>
        </div>
        <VoiceTuningConsole initialTuning={{ pitch: 0, vibrato: 0, timbre: 'default' }} onTune={() => {}} onReplay={() => {}} />
      </div>
      {/* Audio/MIDI Visualization Panel */}
      <div style={{ ...panelStyle, maxWidth: '700px', marginTop: '2em' }}>
        <h3 style={{ color: '#ffb400', marginBottom: '1em' }}>Audio/MIDI Visualization</h3>
        <div style={{ height: '120px', background: '#222', borderRadius: '12px', marginBottom: '1em', boxShadow: '0 2px 8px #0004' }}>
          {/* Visualization placeholder: waveform, MIDI notes, etc. */}
          <div style={{ color: '#ffb400', textAlign: 'center', paddingTop: '48px', fontWeight: 600 }}>Live waveform & MIDI display coming soon...</div>
        </div>
        {/* Sample search and preview controls */}
        <div style={{ marginBottom: '1em', textAlign: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search for a sample..."
            style={{ padding: '0.5em', borderRadius: '8px', border: '1px solid #444', width: '60%', marginRight: '1em', fontSize: '1em' }}
          />
          <button style={{ ...buttonStyle, width: 'auto', padding: '0.5em 1em', fontSize: '1em' }}
            disabled={searching}
            onClick={handleSampleSearch}>{searching ? 'Searching...' : 'Search'}</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1em' }}>
          <audio id="sample-audio" src={sampleUrl} preload="auto" />
          <button style={{ ...buttonStyle, width: 'auto', padding: '0.5em 1em', fontSize: '1em', marginRight: '1em' }}
            onClick={() => document.getElementById('sample-audio').play()}>Play Sample</button>
          <button style={{ ...buttonStyle, width: 'auto', padding: '0.5em 1em', fontSize: '1em', background: '#232323', color: '#ffb400', marginRight: '1em' }}
            onClick={() => { const audio = document.getElementById('sample-audio'); audio.pause(); audio.currentTime = 0; }}>Stop</button>
          <button style={{ ...buttonStyle, width: 'auto', padding: '0.5em 1em', fontSize: '1em', background: '#ff6a00', color: '#fff', marginRight: '1em' }}
            onClick={() => { const audio = document.getElementById('sample-audio'); audio.pause(); audio.currentTime = 0; setSampleUrl(''); }}>Discard</button>
          <button style={{ ...buttonStyle, width: 'auto', padding: '0.5em 1em', fontSize: '1em', background: '#00c853', color: '#fff' }}
            onClick={async () => {
              await fetch('http://localhost:8000/send-to-daw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sample_url: sampleUrl })
              });
              alert('Sample sent to DAW!');
            }}>Send to DAW</button>
        </div>
      </div>
      {/* Plugin Management Panel */}
      <div style={{ ...panelStyle, maxWidth: '700px', marginTop: '2em' }}>
        <h3 style={{ color: '#ffb400', marginBottom: '1em' }}>Plugin Management</h3>
        <div style={{ background: '#333', borderRadius: '12px', padding: '1em', color: '#ffb400', fontWeight: 600 }}>
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
  React.useEffect(() => {
    fetch('http://localhost:8000/scan-plugins')
      .then(res => res.json())
      .then(data => setPlugins(data.plugins || []));
  }, []);
  const handleScan = async () => {
    setScanning(true);
    const res = await fetch('http://localhost:8000/scan-plugins');
    const data = await res.json();
    setPlugins(data.plugins || []);
    setScanning(false);
  };
  const handleAdd = async () => {
    if (!newPlugin) return;
    await fetch('http://localhost:8000/add-plugin', {
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
