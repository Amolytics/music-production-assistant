import React, { useState, useRef } from 'react';

const dropZoneStyle = {
  border: '2px dashed #ffb400',
  borderRadius: '12px',
  padding: '1em',
  textAlign: 'center',
  background: 'rgba(35,35,35,0.85)',
  color: '#ffb400',
  marginBottom: '1em',
  cursor: 'pointer',
};

function DragDropFileUpload({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div
      style={{ ...dropZoneStyle, borderColor: dragActive ? '#fff' : '#ffb400' }}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      {dragActive ? 'Drop file here...' : 'Drag & drop file or click to upload'}
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}

export default DragDropFileUpload;
