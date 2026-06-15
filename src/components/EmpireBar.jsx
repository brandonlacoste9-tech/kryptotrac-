import React from 'react';

const EmpireBar = () => {
  return (
    <div style={{
      backgroundColor: '#050505',
      borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
      padding: '8px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '30px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 99999,
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <span style={{ color: '#666', fontWeight: 'bold', letterSpacing: '2px' }}>THE EMPIRE:</span>
      <a href="https://hellyeah-games.com" style={{ color: '#00f3ff', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>🎮</span> HELL YEAH GAMES
      </a>
      <a href="https://kryptotrac.com" style={{ color: '#f7931a', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>📈</span> KRYPTOTRAC
      </a>
      <a href="https://ironclaw.ca" style={{ color: '#00ffaa', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>⚡</span> IRON CLAW
      </a>
    </div>
  );
};

export default EmpireBar;
