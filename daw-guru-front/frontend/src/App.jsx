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
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [lyricsOptions, setLyricsOptions] = useState(null);
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [chatVisible, setChatVisible] = useState(true);
  const [tuningResult, setTuningResult] = useState(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(15);

  React.useEffect(() => {
    // Fetch reminder setting and user name on mount
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/user-info`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.reminder_enabled === 'boolean') setReminderEnabled(data.reminder_enabled);
        if (typeof data.reminder_interval === 'number') setReminderInterval(data.reminder_interval);
        if (data.name) {
          setUser({ name: data.name });
        } else {
          setShowNamePrompt(true);
        }
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

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setUser({ name: pendingName });
    setShowNamePrompt(false);
    // Optionally, save to backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pendingName })
    });
  };

  return (
    <Router>
      <div>
        {showNamePrompt && (
          <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#000a',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <form onSubmit={handleNameSubmit} style={{background:'#232323',padding:32,borderRadius:16,boxShadow:'0 2px 16px #0008',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
              <h2>Hey! Before we get started, what should I call you?</h2>
              <input type="text" value={pendingName} onChange={e => setPendingName(e.target.value)} placeholder="Your name" required style={{fontSize:'1.2em',padding:8,borderRadius:8}} />
              <button type="submit" style={{fontSize:'1.1em',padding:'8px 24px',borderRadius:8}}>Continue</button>
            </form>
          </div>
        )}
        <button
          className="toggle-chat-btn"
          onClick={() => setChatVisible(v => !v)}
        >
          {chatVisible ? 'Hide Chat' : 'Show Chat'}
        </button>
        <DetachableChatBox visible={chatVisible} onClose={() => setChatVisible(false)} user={user} />
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
