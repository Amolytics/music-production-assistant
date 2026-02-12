import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import WelcomePage from './WelcomePage.jsx';
import NavigationPage from './NavigationPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import LyricsGenerationPage from './LyricsGenerationPage.jsx';
import VoiceGeneratorPage from './VoiceGeneratorPage.jsx';
import DetachableChatBox from './DetachableChatBox.jsx';
import FaviconLogo from './FaviconLogo.jsx';
import SetupPage from './SetupPage.jsx';
import CollaborationPage from './CollaborationPage.jsx';
import SampleSearchPage from './SampleSearchPage.jsx';
import AnalyticsPanel from './AnalyticsPanel.jsx';


function App() {
  const [user, setUser] = useState(null);
  const [lyricsOptions, setLyricsOptions] = useState(null);
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [chatVisible, setChatVisible] = useState(true);
  const [tuningResult, setTuningResult] = useState(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(15);

  React.useEffect(() => {
    // Fetch reminder setting on mount
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/user-info`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.reminder_enabled === 'boolean') setReminderEnabled(data.reminder_enabled);
        if (typeof data.reminder_interval === 'number') setReminderInterval(data.reminder_interval);
      });
  }, []);

  React.useEffect(() => {
    let timer;
    if (reminderEnabled) {
      timer = setInterval(() => {
        alert('Time to upload a sample of your work for feedback and guidance!');
      }, reminderInterval * 60 * 1000);
    }
    return () => clearInterval(timer);
  }, [reminderEnabled, reminderInterval]);

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
          <Route path="/main" element={<LyricsGenerationPage onGenerate={opts => { setLyricsOptions(opts); setGeneratedLyrics(opts.lyrics || ''); }} />} />
          <Route path="/lyrics-generation" element={<LyricsGenerationPage onGenerate={opts => { setLyricsOptions(opts); window.location.href = '/tuning'; }} />} />
          <Route path="/voice-generator" element={<VoiceGeneratorPage />} />
          <Route path="/collaboration" element={<CollaborationPage />} />
          <Route path="/sample-search" element={<SampleSearchPage />} />
          <Route path="/analytics" element={<AnalyticsPanel />} />
          <Route path="/" element={<WelcomePage />} />
        </Routes>
        <FaviconLogo />
      </div>
    </Router>
  );
}

export default App;
