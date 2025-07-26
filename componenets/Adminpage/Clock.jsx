import { useState,useEffect } from "react";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className=" relative top-2 text-[1rem] font-mono">
      {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
    </div>
  );
};

export default Clock