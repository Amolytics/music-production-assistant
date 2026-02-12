import React from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';
import DetachableChatBox from './DetachableChatBox.jsx';

function CollaborationPage() {
  return (
    <div className="central-page collaboration-page">
      <HamburgerMenu />
      <h2 className="collab-title">Collaboration Studio</h2>
      <DetachableChatBox visible={true} onClose={() => {}} />
      <div className="collab-share">
        <h3>Share Samples</h3>
        <p>Drag and drop files here to share with collaborators.</p>
        {/* Sample sharing UI can be implemented here */}
      </div>
    </div>
  );
}

export default CollaborationPage;
