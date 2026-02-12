import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WelcomePage from './WelcomePage.jsx';
import NavigationPage from './NavigationPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import LyricsGenerationPage from './LyricsGenerationPage.jsx';
// import VoiceTuningConsole from './VoiceTuningConsole.jsx';
import VoiceGeneratorPage from './VoiceGeneratorPage.jsx';
import DetachableChatBox from './DetachableChatBox.jsx';
import FaviconLogo from './FaviconLogo.jsx';
import MainStudioInterface from './MainStudioInterface.jsx';
import SetupPage from './SetupPage.jsx';
import CollaborationPage from './CollaborationPage.jsx';
import SampleSearchPage from './SampleSearchPage.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [lyricsOptions, setLyricsOptions] = useState(null);
  const [generatedLyrics, setGeneratedLyrics] = useState('');
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
          <Link to="/settings" className="app-nav-link">Settings</Link>
        </nav>
        <Routes>
          <Route path="/settings" element={<SettingsPage onSave={key => {}} />} />
          <Route path="/nav" element={<NavigationPage />} />
          <Route path="/setup" element={<SetupPage onComplete={user => { setUser(user); window.location.href = '/main'; }} />} />
          <Route path="/main" element={<LyricsGenerationPage onGenerate={opts => { setLyricsOptions(opts); setGeneratedLyrics(opts.lyrics || ''); window.location.href = '/tuning'; }} />} />
          <Route path="/lyrics-generation" element={<LyricsGenerationPage onGenerate={opts => { setLyricsOptions(opts); window.location.href = '/tuning'; }} />} />
          <Route path="/voice-generator" element={<VoiceGeneratorPage />} />
          {/* Voice tuning pages removed */}
          {/* <Route path="/tuning" element={<VoiceTuningConsole initialTuning={{ pitch: 0, vibrato: 0, timbre: 'default' }} lyrics={generatedLyrics} onTune={() => {}} onReplay={result => { setTuningResult(result); window.location.href = '/studio'; }} />} /> */}
          <Route path="/collaboration" element={<CollaborationPage />} />
          <Route path="/sample-search" element={<SampleSearchPage />} />
          <Route path="/" element={<WelcomePage />} />
        </Routes>
        <FaviconLogo />
      </div>
    </Router>
  );
}

export default App;
