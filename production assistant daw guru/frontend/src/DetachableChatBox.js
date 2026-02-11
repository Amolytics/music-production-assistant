import React, { useState } from 'react';
// WebSocket for real-time chat
import DragDropFileUpload from './DragDropFileUpload';

// ...existing code...

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
    <div className={`chatbox${position.x !== undefined && position.y !== undefined ? ' chatbox-movable' : ''}`} data-left={position.x} data-top={position.y}>
      <div className="chatbox-header" onMouseDown={handleMouseDown}>
        AI Chat Assistant
        <button className="chatbox-close" onClick={onClose}>&times;</button>
      </div>
      {notification && (
        <div className="chatbox-notification">{notification}</div>
      )}
      <DragDropFileUpload onUpload={handleFileUpload} />
      <div className="chatbox-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbox-message ${msg.sender === 'AI' ? 'ai' : 'user'}`}>
            <span className={`chatbox-sender ${msg.sender === 'AI' ? 'ai' : 'user'}`}>{msg.sender}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
        {files.length > 0 && (
          <div className="chatbox-files">
            <strong>Shared Files:</strong>
            <ul>
              {files.map((file, idx) => (
                <li key={idx}>
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="chatbox-file-image" />
                  ) : null}
                  {file.type.startsWith('audio/') ? (
                    <audio controls className="chatbox-file-audio">
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the audio element.
                    </audio>
                  ) : null}
                  <a href={URL.createObjectURL(file)} download={file.name} className="chatbox-file-link">{file.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <form className="chatbox-form" onSubmit={e => {
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
          className="chatbox-input"
        />
        <button type="submit" className="chatbox-send">Send</button>
      </form>
    </div>
  );

export default DetachableChatBox;
