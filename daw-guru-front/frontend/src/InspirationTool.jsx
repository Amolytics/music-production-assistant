import React, { useState, useEffect } from 'react';

const TIPS = {
  Pop: [
    'Try writing your chorus first for a catchy hook.',
    'Layer harmonies to make your vocals shine.',
    'Use a pre-chorus to build anticipation.'
  ],
  EDM: [
    'Automate filter sweeps for dynamic builds.',
    'Try sidechain compression for a pumping effect.',
    'Use white noise risers for energy.'
  ],
  House: [
    'Keep your kick and bass tight for groove.',
    'Use vocal chops for extra flavor.',
    'Try a breakdown with minimal elements.'
  ],
  Bounce: [
    'Experiment with bouncy basslines and syncopation.',
    'Use donk sounds for signature bounce energy.',
    'Try call-and-response melodies.'
  ],
  Hardvore: [
    'Layer distorted kicks for impact.',
    'Use tempo changes for surprise.',
    'Try aggressive synth stabs.'
  ],
  HipHop: [
    'Sample old records for unique textures.',
    'Focus on groove and swing in your drums.',
    'Write punchy, memorable hooks.'
  ],
  Trap: [
    'Use hi-hat rolls and triplets for movement.',
    '808 slides add energy to your bass.',
    'Try half-time drops for contrast.'
  ],
  Metal: [
    'Double-track guitars for a massive sound.',
    'Experiment with odd time signatures.',
    'Use breakdowns for intensity.'
  ],
  Country: [
    'Tell a story with your lyrics.',
    'Use acoustic instruments for authenticity.',
    'Try a key change in the final chorus.'
  ],
  Blues: [
    'Improvise solos using the pentatonic scale.',
    'Use call-and-response between vocals and guitar.',
    'Try a 12-bar blues progression.'
  ],
  Folk: [
    'Focus on lyrics and melody.',
    'Use fingerpicking patterns for texture.',
    'Try harmonizing with simple intervals.'
  ],
};

const ALL_GENRES = Object.keys(TIPS);

function InspirationTool({ favoriteGenres = [] }) {
  const [tip, setTip] = useState('');

  const getRandomTip = () => {
    const genres = favoriteGenres.length ? favoriteGenres : ALL_GENRES;
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const tips = TIPS[genre];
    setTip(tips[Math.floor(Math.random() * tips.length)] + ` (${genre})`);
  };

  useEffect(() => {
    getRandomTip();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="inspiration-tool" style={{margin:'2em 0',textAlign:'center'}}>
      <h3>Need Inspiration?</h3>
      <div className="inspiration-tip" style={{fontSize:'1.2em',margin:'1em 0',color:'#2ad'}}>{tip}</div>
      <button className="music-input" onClick={getRandomTip}>Inspire Me Again</button>
    </div>
  );
}

export default InspirationTool;
