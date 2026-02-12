import React from 'react';

function WelcomePage() {
  return (
    <div style={{width:'100vw',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#232323'}}>
      <img src={require('../../background.png')} alt="Welcome" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain',borderRadius:24,boxShadow:'0 4px 32px #0008'}} />
    </div>
  );
}

export default WelcomePage;
