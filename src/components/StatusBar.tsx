import React from 'react';

export const StatusBar = () => {
  return (
    <div style={{
      background: 'var(--card-bg)',
      borderBottom: '1px solid var(--r)',
      padding: '8px 20px',
      textAlign: 'center',
      fontSize: '12px',
      fontFamily: 'var(--font-mono)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      color: 'var(--green)',
      fontWeight: 'bold'
    }}>
      <span className="live-dot green"></span>
      SYSTEM ACTIVE – MONITORING IN REAL-TIME
    </div>
  );
};
