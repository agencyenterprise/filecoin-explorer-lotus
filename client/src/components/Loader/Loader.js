import React from 'react';

export const Loader = ({ loading }) => {
  return (
    <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0, 0.2)', zIndex: 9999 }}>
      <span uk-spinner="ratio: 4.5"></span>
    </div>
  )
}
