import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import SettingsPage from './SettingsPage';
import SetupPage from './SetupPage';
import LyricsGenerationPage from './LyricsGenerationPage';
import VoiceTuningConsole from './VoiceTuningConsole';
import DetachableChatBox from './DetachableChatBox';

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
        <Routes>
                    <Route path="/settings" element={<SettingsPage onSave={key => {}} />} />
          <Route path="/" element={<WelcomePage onStart={() => window.location.href = '/setup'} />} />
          <Route path="/setup" element={<SetupPage onComplete={data => { setUser(data); window.location.href = '/main'; }} />} />
          <Route path="/main" element={<LyricsGenerationPage onGenerate={opts => { setLyricsOptions(opts); window.location.href = '/tuning'; }} />} />
          <Route path="/tuning" element={<VoiceTuningConsole initialTuning={{ pitch: 0, vibrato: 0, timbre: 'default' }} onTune={() => {}} onReplay={result => { setTuningResult(result); window.location.href = '/studio'; }} />} />
          <Route path="/studio" element={<MainStudioInterface />} />
          {/* Add more routes for advanced features */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
