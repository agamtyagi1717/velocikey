import React, { useState, useEffect } from 'react';
import TypingBox from '../components/TypingBox';

const Homepage = () => {
  const [isPC, setIsPC] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsPC(window.innerWidth > 800);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='w-[80vw] text-center flex flex-col justify-center h-full'>
      {isPC ? <TypingBox /> : <h1>Use a laptop or desktop to play</h1>}
    </div>
  );
};

export default Homepage;
