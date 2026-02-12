import React, { useEffect, useState } from 'react';

function AnalyticsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/analytics`)
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-panel" style={{margin:'2em 0',padding:'1em',background:'#222',color:'#fff',borderRadius:8,maxWidth:400}}>
      <h3>Your Session Stats</h3>
      <div>Total Sessions: <b>{stats.total_sessions}</b></div>
      <div>Total Time: <b>{Math.round(stats.total_time/60)} min</b></div>
      <div>Goals Completed: <b>{stats.goals_completed}</b></div>
      <div>Uploads: <b>{stats.total_uploads}</b></div>
      <div>Reminders Used: <b>{stats.total_reminders}</b></div>
    </div>
  );
}

export default AnalyticsPanel;