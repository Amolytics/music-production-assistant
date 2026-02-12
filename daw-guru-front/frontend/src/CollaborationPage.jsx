import React from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';

function CollaborationPage() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { user: 'You', text: input }]);
      setInput("");
      // TODO: Integrate with backend or websocket for real user chat
    }
  };
  return (
    <div className="central-page collaboration-page">
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
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{flex:1,padding:8,borderRadius:8,border:'1px solid #444',background:'#333',color:'#fff'}}
          />
          <button type="submit" style={{padding:'8px 16px',borderRadius:8,background:'#ffb400',color:'#232323',border:'none',fontWeight:700}}>Send</button>
        </form>
      </div>
      <div className="collab-share">
        <h3>Share Samples</h3>
        <p>Drag and drop files here to share with collaborators.</p>
        {/* Sample sharing UI can be implemented here */}
      </div>
    </div>
  );
}

export default CollaborationPage;


  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { user: 'You', text: input }]);
      setInput("");
      // TODO: Integrate with backend or websocket for real user chat
    }
  };
  return (
    <div className="central-page collaboration-page">
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
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{flex:1,padding:8,borderRadius:8,border:'1px solid #444',background:'#333',color:'#fff'}}
          />
          <button type="submit" style={{padding:'8px 16px',borderRadius:8,background:'#ffb400',color:'#232323',border:'none',fontWeight:700}}>Send</button>
        </form>
      </div>
      <div className="collab-share">
        <h3>Share Samples</h3>
        <p>Drag and drop files here to share with collaborators.</p>
        {/* Sample sharing UI can be implemented here */}
      </div>
    </div>
  );
}

export default CollaborationPage;
