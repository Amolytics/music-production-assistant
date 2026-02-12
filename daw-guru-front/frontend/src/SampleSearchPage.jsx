import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu.jsx';

function SampleSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSearch = async () => {
    const response = await fetch(`${backendUrl}/search-sample?description=${encodeURIComponent(searchTerm)}`);
    const result = await response.json();
    setResults(result.samples || []);
  };

  return (
    <div className="central-page sample-search-page">
      <HamburgerMenu />
      <h2 className="sample-search-title">Sample Search</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search for a sample..."
        className="sample-search-input"
      />
      <button onClick={handleSearch} className="sample-search-btn">Search</button>
      <div className="sample-search-results">
        {results.length === 0 ? <p>No samples found.</p> : results.map((sample, idx) => (
          <div key={idx} className="sample-result">
            <audio controls src={sample.url} />
            <div>{sample.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SampleSearchPage;
