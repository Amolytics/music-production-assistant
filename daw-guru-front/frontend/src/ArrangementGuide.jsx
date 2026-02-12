import React, { useState } from 'react';

const ARRANGEMENTS = {
  Pop: {
    sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
    tips: 'Pop songs often use a Verse-Chorus structure with a memorable hook.'
  },
  EDM: {
    sections: ['Intro', 'Build', 'Drop', 'Breakdown', 'Build', 'Drop', 'Outro'],
    tips: 'EDM tracks focus on energy and drops. Use risers and breakdowns for tension.'
  },
  House: {
    sections: ['Intro', 'Groove', 'Breakdown', 'Drop', 'Groove', 'Outro'],
    tips: 'House music features steady beats, repetitive grooves, and breakdowns.'
  },
  Bounce: {
    sections: ['Intro', 'Verse', 'Bounce', 'Verse', 'Bounce', 'Outro'],
    tips: 'Bounce/Donk tracks use energetic basslines and playful rhythms.'
  },
  Hardvore: {
    sections: ['Intro', 'Hard Drop', 'Break', 'Hard Drop', 'Outro'],
    tips: 'Hardvore is aggressive and fast—use distorted kicks and intense drops.'
  },
  HipHop: {
    sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Outro'],
    tips: 'Hip-Hop often alternates verses and choruses, with space for rap and hooks.'
  },
  Trap: {
    sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
    tips: 'Trap uses hi-hat rolls, 808s, and breakdowns for dynamic flow.'
  },
  Metal: {
    sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Solo', 'Chorus', 'Outro'],
    tips: 'Metal tracks feature heavy riffs, solos, and powerful choruses.'
  },
  Country: {
    sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
    tips: 'Country songs tell stories—focus on lyrics and clear structure.'
  },
  Blues: {
    sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Outro'],
    tips: 'Blues uses repeated progressions and expressive solos.'
  },
  Folk: {
    sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Outro'],
    tips: 'Folk emphasizes storytelling and acoustic instruments.'
  },
};

const GENRES = Object.keys(ARRANGEMENTS);

function ArrangementGuide() {
  const [genre, setGenre] = useState('Pop');
  const arrangement = ARRANGEMENTS[genre];

  return (
    <div className="arrangement-guide">
      <h2>Arrangement Guide</h2>
      <label>
        Select Genre:
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </label>
      <div className="arrangement-visual" style={{margin:'2em 0'}}>
        <div style={{display:'flex',gap:8,justifyContent:'center'}}>
          {arrangement.sections.map((sec,i) => (
            <div key={i} style={{padding:'1em',background:'#222',color:'#fff',borderRadius:8,minWidth:80,textAlign:'center'}}>{sec}</div>
          ))}
        </div>
      </div>
      <div className="arrangement-tips" style={{marginTop:16}}>
        <strong>Tips:</strong> {arrangement.tips}
      </div>
    </div>
  );
}

export default ArrangementGuide;
