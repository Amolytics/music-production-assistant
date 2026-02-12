import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SessionPage() {
  const [sessionGoal, setSessionGoal] = useState('');
  const [progress, setProgress] = useState('');
  const [lastSummary, setLastSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/session-info`)
      .then(res => res.json())
      .then(data => {
        setSessionGoal(data.current_goal || '');
        setLastSummary(data.last_summary || '');
        setLoading(false);
      });
  }, []);

  const handleStart = () => {
    setProgress('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/session-start`, { method: 'POST' });
  };

  const handleEnd = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/session-end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress }),
    }).then(() => navigate('/nav'));
  };

  if (loading) return <div>Loading session...</div>;

  return (
    <div className="session-page">
      <h2>Session</h2>
      {lastSummary && (
        <div className="session-summary">
          <strong>Last Session Summary:</strong>
          <div>{lastSummary}</div>
        </div>
      )}
      <label>Session Goal</label>
      <input
        className="music-input"
        type="text"
        value={sessionGoal}
        onChange={e => setSessionGoal(e.target.value)}
        placeholder="What do you want to achieve this session?"
      />
      <label>Progress / Notes</label>
      <textarea
        className="music-input"
        value={progress}
        onChange={e => setProgress(e.target.value)}
        placeholder="What did you accomplish this session?"
      />
      <button className="music-input" onClick={handleStart}>Start New Session</button>
      <button className="music-input" onClick={handleEnd}>End Session & Save Progress</button>
    </div>
  );
}

export default SessionPage;
