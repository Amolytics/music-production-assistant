// ScreenSharePopup component for fullscreen/small screen toggle
function ScreenSharePopup({ screenStream, onClose }) {
  const [fullscreen, setFullscreen] = React.useState(true);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.85)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#111',borderRadius:16,padding:24,boxShadow:'0 4px 24px #000a',maxWidth:fullscreen ? '90vw' : '600px',maxHeight:fullscreen ? '90vh' : '400px',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <h2 style={{color:'#fff',marginBottom:16}}>Screen Sharing</h2>
        <video
          ref={videoRef}
          autoPlay
          controls
          style={{width:fullscreen ? '80vw' : '500px',height:fullscreen ? '70vh' : '300px',background:'#000',borderRadius:12,boxShadow:'0 2px 8px #0006'}}
        />
        <div style={{marginTop:24,display:'flex',gap:16}}>
          <button className="music-input" onClick={() => setFullscreen(v => !v)}>
            {fullscreen ? 'Small Screen' : 'Fullscreen'}
          </button>
          <button className="music-input" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';
import DragDropFileUpload from './DragDropFileUpload.jsx';

// FlashingAlert component (must be outside main component)
function FlashingAlert({ message }) {
  const [flash, setFlash] = React.useState(true);
  React.useEffect(() => {
    const interval = setInterval(() => setFlash(f => !f), 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{
      color: flash ? '#fff' : '#ff3',
      background: flash ? '#c00' : '#222',
      padding: '16px 32px',
      borderRadius: 12,
      fontWeight: 'bold',
      fontSize: '1.3em',
      marginBottom: 24,
      boxShadow: '0 0 16px #c00a',
      textAlign: 'center',
      animation: 'flash 1s infinite',
    }}>{message}</div>
  );
}

function CollaborationPage() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [uploadFeedback, setUploadFeedback] = React.useState("");
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [showFriends, setShowFriends] = React.useState(true);
  const [friends, setFriends] = React.useState([]);
  const [screenSharing, setScreenSharing] = React.useState(false);
  const [screenStream, setScreenStream] = React.useState(null);
  const [consentRequested, setConsentRequested] = React.useState(false);
  const [consentPrompt, setConsentPrompt] = React.useState(false);
  const [requester, setRequester] = React.useState(null);

  React.useEffect(() => {
    // TODO: Replace with real backend fetch for online users and friends
    setOnlineUsers([
      { name: "Alice", online: true },
      { name: "Bob", online: true },
      { name: "Charlie", online: true },
      { name: "Dana", online: true }
    ]);
    setFriends(["Alice", "Dana"]);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { user: 'You', text: input }]);
      setInput("");
      // TODO: Integrate with backend or websocket for real user chat
    }
  };

  const handleUpload = async (file) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const formData = new FormData();
    formData.append('file', file);
    setUploadFeedback('Uploading...');
    const res = await fetch(`${backendUrl}/upload-file`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setUploadFeedback(data.feedback || 'Upload complete!');
  };

  // Filter users based on toggle
  const displayedUsers = showFriends
    ? onlineUsers.filter(u => friends.includes(u.name))
    : onlineUsers;

  // Screen sharing logic
  const handleStartScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      setScreenSharing(true);
      // TODO: Notify other users and trigger consent prompt
      setConsentRequested(true);
    } catch (err) {
      alert('Screen sharing failed or was cancelled.');
    }
  };
  const handleStopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    setScreenStream(null);
    setScreenSharing(false);
    setConsentRequested(false);
    setConsentPrompt(false);
  };

  // Simulate receiving a screen share request (for demo)
  const simulateConsentPrompt = () => {
    setConsentPrompt(true);
    setRequester('Alice'); // Example requester
  };

  const handleAcceptScreenShare = () => {
    setConsentPrompt(false);
    setScreenSharing(true);
    // TODO: Connect to WebRTC stream
  };
  const handleDeclineScreenShare = () => {
    setConsentPrompt(false);
    setMessages(prev => [...prev, { user: 'System', text: 'Sorry, I’m busy right now and can’t join the screen share.' }]);
    // TODO: Notify requester politely
  };

  return (
    <div className="central-page collaboration-page" style={{display:'flex',flexDirection:'row',gap:32}}>
      <div style={{flex:1}}>
        <HamburgerMenu />
        <h2 className="collab-title">Collaboration Studio</h2>
        <div className="user-chatbox" style={{background:'#232323',borderRadius:12,padding:16,maxWidth:400,margin:'0 auto 2em',boxShadow:'0 2px 8px #0006'}}>
          <div className="user-chat-messages" style={{minHeight:120,maxHeight:200,overflowY:'auto',marginBottom:8}}>
            {messages.length === 0 ? <div style={{color:'#888'}}>No messages yet.</div> : messages.map((msg,i) => (
              <div key={i} style={{marginBottom:4}}><b>{msg.user}:</b> {msg.text}</div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{display:'flex',gap:8}}>
            <input
              className="music-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{flex:1}}
            />
            <button className="music-input" type="submit">Send</button>
          </form>
        </div>
        <div className="collab-share">
          <h3>Share Samples</h3>
          <DragDropFileUpload onUpload={handleUpload} />
          {uploadFeedback && <div className="upload-feedback">{uploadFeedback}</div>}
        </div>
        <div className="collab-screen-share" style={{marginTop:24}}>
          <button className="music-input" onClick={screenSharing ? handleStopScreenShare : handleStartScreenShare}>
            {screenSharing ? 'Stop Screen Sharing' : 'Start Screen Sharing'}
          </button>
          {/* Demo: Simulate receiving a screen share request */}
          <button className="music-input" style={{marginLeft:8}} onClick={simulateConsentPrompt}>Simulate Screen Share Request</button>
        </div>
      </div>
      <div className="collab-online-list" style={{width:220,minWidth:180,background:'#222',borderRadius:12,padding:16,boxShadow:'0 2px 8px #0006',marginTop:32}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontWeight:'bold',fontSize:'1.1em'}}>Online Users</span>
          <label style={{display:'flex',alignItems:'center',gap:4}}>
            <input type="checkbox" checked={showFriends} onChange={() => setShowFriends(v => !v)} />
            <span style={{fontSize:'0.95em'}}>{showFriends ? 'Show Friends' : 'Show All'}</span>
          </label>
        </div>
        <ul style={{listStyle:'none',padding:0}}>
          {displayedUsers.length === 0 ? <li style={{color:'#888'}}>No users online.</li> : displayedUsers.map((u,i) => (
            <li key={i} style={{marginBottom:6,padding:6,borderRadius:6,background:'#333',color:'#fff'}}>
              <span style={{fontWeight:'bold'}}>{u.name}</span> <span style={{color:'#0f0',fontSize:'0.9em'}}>●</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Consent prompt for screen sharing with flashing alert */}
      {consentPrompt && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#222',borderRadius:16,padding:32,boxShadow:'0 4px 24px #000a',maxWidth:'90vw',maxHeight:'90vh',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <FlashingAlert message={`${requester || 'A user'} wants to share their screen with you!`} />
            <div style={{marginBottom:24,color:'#fff'}}>Do you want to accept the screen share?</div>
            <div style={{display:'flex',gap:16}}>
              <button className="music-input" onClick={handleAcceptScreenShare}>Accept</button>
              <button className="music-input" onClick={handleDeclineScreenShare}>Decline</button>
            </div>
          </div>
        </div>
      )}


      {/* Screen share popup overlay */}
      {screenSharing && screenStream && (
        <ScreenSharePopup screenStream={screenStream} onClose={handleStopScreenShare} />
      )}
    </div>
  );
}

export default CollaborationPage;
