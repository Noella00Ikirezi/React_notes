import React from 'react';


function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        color: "white",
        background: "inherit",
        padding: "20px",
        border: "1px solid white", 
        borderRadius: "4px" 
      }}
    >
      {children}
    </button>
  );
}

export { Button };
