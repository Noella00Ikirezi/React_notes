import React, { useState, useEffect } from 'react';
import './ErrorMessage.css'; 

function ErrorMessage({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={` ErrorMessage ${isVisible ? 'visible' : 'hidden'}`}>
      {message}
    </div>
  );
}

export default ErrorMessage;
