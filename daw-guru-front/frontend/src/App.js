import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import SettingsPage from './SettingsPage';
import SetupPage from './SetupPage.jsx';
import LyricsGenerationPage from './LyricsGenerationPage';
import VoiceTuningConsole from './VoiceTuningConsole';
import DetachableChatBox from './DetachableChatBox';
import FaviconLogo from './FaviconLogo';

function App() {
  const [user, setUser] = useState(null);
  const [lyricsOptions, setLyricsOptions] = useState(null);
  const [chatVisible, setChatVisible] = useState(true);
  const [tuningResult, setTuningResult] = useState(null);

  return (
    <Router>
      <div>
        <button
          className="toggle-chat-btn"
          onClick={() => setChatVisible(v => !v)}
        >
          {chatVisible ? 'Hide Chat' : 'Show Chat'}
        </button>
        <DetachableChatBox visible={chatVisible} onClose={() => setChatVisible(false)} />
        {/* Tab Navigation */}
        <nav className="app-nav">
          <a href="/main" className="app-nav-link">Studio</a>
          <a href="/settings" className="app-nav-link">Settings</a>
        </nav>
        <Routes>
          <Route path="/settings" element={<SettingsPage onSave={key => {}} />} />
          <Route path="/main" element={<LyricsGenerationPage onGenerate={opts => { setLyricsOptions(opts); window.location.href = '/tuning'; }} />} />
          <Route path="/tuning" element={<VoiceTuningConsole initialTuning={{ pitch: 0, vibrato: 0, timbre: 'default' }} onTune={() => {}} onReplay={result => { setTuningResult(result); window.location.href = '/studio'; }} />} />
          <Route path="/studio" element={<MainStudioInterface />} />
          <Route path="/" element={<MainStudioInterface />} />
        </Routes>
        <FaviconLogo />
      </div>
    </Router>
  );
}

export default App;
