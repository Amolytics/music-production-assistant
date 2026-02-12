import React from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';
import DragDropFileUpload from './DragDropFileUpload.jsx';


function CollaborationPage() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [uploadFeedback, setUploadFeedback] = React.useState("");
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [showFriends, setShowFriends] = React.useState(true);
  const [friends, setFriends] = React.useState([]);
  const [screenSharing, setScreenSharing] = React.useState(false);
  const [screenStream, setScreenStream] = React.useState(null);

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
      {/* Screen share popup overlay */}
      {screenSharing && screenStream && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.85)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#111',borderRadius:16,padding:24,boxShadow:'0 4px 24px #000a',maxWidth:'90vw',maxHeight:'90vh',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <h2 style={{color:'#fff',marginBottom:16}}>Screen Sharing</h2>
            <video
              autoPlay
              controls
              style={{width:'80vw',height:'70vh',background:'#000',borderRadius:12,boxShadow:'0 2px 8px #0006'}}
              srcObject={screenStream}
              ref={el => {
                if (el && screenStream) el.srcObject = screenStream;
              }}
            />
            <button className="music-input" style={{marginTop:24}} onClick={handleStopScreenShare}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollaborationPage;
