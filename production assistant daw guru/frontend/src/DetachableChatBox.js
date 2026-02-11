import React, { useState } from 'react';
// WebSocket for real-time chat
import DragDropFileUpload from './DragDropFileUpload';

const chatBoxStyle = {
  position: 'fixed',
  bottom: '2em',
  right: '2em',
  width: '320px',
  background: 'rgba(35,35,35,0.95)',
  borderRadius: '16px',
  boxShadow: '0 4px 24px #0008',
  color: '#fff',
  zIndex: 1000,
  padding: '1em',
  fontFamily: 'Montserrat, Arial, sans-serif',
};

const headerStyle = {
  cursor: 'move',
  background: '#232323',
  borderRadius: '16px 16px 0 0',
  padding: '0.5em',
  fontWeight: 700,
  color: '#ffb400',
  textAlign: 'center',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '0.5em',
  right: '0.5em',
  background: 'none',
  border: 'none',
  color: '#ffb400',
  fontSize: '1.2em',
  cursor: 'pointer',
};

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Welcome! How can I help with your music today?' }
  ]);
  const [ws, setWs] = useState(null);
  React.useEffect(() => {
    const socket = new window.WebSocket('ws://localhost:8000/ws/chat');
    socket.onmessage = (event) => {
      setMessages(prev => [...prev, { sender: 'AI', text: event.data }]);
    };
    setWs(socket);
    return () => socket.close();
  }, []);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const [notification, setNotification] = useState('');

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }
  };

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  if (!visible) return null;

  const handleFileUpload = file => {
    setFiles([...files, file]);
    setNotification(`File uploaded: ${file.name}`);
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://localhost:8000/upload-file', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setMessages([...messages, { sender: 'You', text: `Uploaded file: ${file.name}` }]);
        setTimeout(() => setNotification(''), 3000);
      })
      .catch(() => {
        setNotification('File upload failed');
        setTimeout(() => setNotification(''), 3000);
      });
  };

  return (
    <div style={{ ...chatBoxStyle, left: position.x || 'auto', top: position.y || 'auto' }}>
      <div style={headerStyle} onMouseDown={handleMouseDown}>
        AI Chat Assistant
        <button style={closeBtnStyle} onClick={onClose}>&times;</button>
      </div>
      {notification && (
        <div style={{ background: '#ffb400', color: '#232323', borderRadius: '8px', padding: '0.5em', marginBottom: '1em', fontWeight: 700, textAlign: 'center' }}>
          {notification}
        </div>
      )}
      <DragDropFileUpload onUpload={handleFileUpload} />
      <div style={{ maxHeight: '200px', overflowY: 'auto', margin: '1em 0' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === 'AI' ? 'left' : 'right', marginBottom: '0.5em' }}>
            <span style={{ color: msg.sender === 'AI' ? '#ffb400' : '#fff', fontWeight: 600 }}>{msg.sender}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
        {files.length > 0 && (
          <div style={{ marginTop: '1em', color: '#ffb400' }}>
            <strong>Shared Files:</strong>
            <ul style={{ paddingLeft: '1em' }}>
              {files.map((file, idx) => (
                <li key={idx}>
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} style={{ maxWidth: '120px', maxHeight: '80px', borderRadius: '8px', marginRight: '0.5em' }} />
                  ) : null}
                  {file.type.startsWith('audio/') ? (
                    <audio controls style={{ maxWidth: '180px', verticalAlign: 'middle', marginRight: '0.5em' }}>
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the audio element.
                    </audio>
                  ) : null}
                  <a href={URL.createObjectURL(file)} download={file.name} style={{ color: '#ffb400', textDecoration: 'underline' }}>{file.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        setMessages([...messages, { sender: 'You', text: input }]);
        if (ws && ws.readyState === ws.OPEN) {
          ws.send(input);
        }
        setInput('');
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '100%', padding: '0.5em', borderRadius: '8px', border: '1px solid #444', marginBottom: '0.5em', background: '#333', color: '#fff' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.5em', borderRadius: '8px', background: '#ffb400', color: '#232323', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default DetachableChatBox;
