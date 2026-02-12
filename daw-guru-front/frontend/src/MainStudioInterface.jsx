import React from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';
import VoiceTuningConsole from './VoiceTuningConsole';
import './App.css';

function MainStudioInterface() {
  const [sampleUrl, setSampleUrl] = React.useState('https://freesound.org/data/previews/123/123456_7037-lq.mp3');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const handleSampleSearch = async () => {
    setSearching(true);
    const response = await fetch(`${backendUrl}/search-sample?description=${encodeURIComponent(searchTerm)}`);
    const result = await response.json();
    setSampleUrl(result.sample_url);
    setSearching(false);
  };
  return (
    <div className="main-studio">
      <HamburgerMenu />
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
          <button className="studio-search-btn" onClick={handleSampleSearch} disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
          <audio controls src={sampleUrl} className="studio-audio-preview" />
        </div>
      </div>
    </div>
  );
}

export default MainStudioInterface;
