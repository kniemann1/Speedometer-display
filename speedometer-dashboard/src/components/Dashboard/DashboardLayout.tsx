import React, { useState, useEffect } from 'react';
import Speedometer from '../Speedometer/Gauge';

const DashboardLayout: React.FC = () => {
  const [speed, setSpeed] = useState(3.5);
  const [distance, setDistance] = useState(0.1);
  const [power, setPower] = useState(22);
  const [battery, setBattery] = useState(35);
  
  // Simulate speed changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prevSpeed => {
        const newSpeed = Math.max(0, Math.min(100, prevSpeed + (Math.random() > 0.5 ? 0.1 : -0.1))).toFixed(1);
        return parseFloat(newSpeed);
      });
      setDistance(prev => Math.max(0, prev + (Math.random() > 0.5 ? 0.001 : 0)));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen bg-[#111827] flex flex-col">
      {/* Top banner with logo and info */}
      <div className="text-white p-3">
        <div className="text-xl font-bold">Elehike<span className="text-sm align-super">®</span></div>
        <div className="text-gray-400 text-xs">SMART DISPLAY SYSTEM</div>
        <div className="mt-2">
          <div className="text-gray-300 text-sm">POWER</div>
          <div className="text-3xl">{power}<span className="text-xl">%</span></div>
          <div className="text-gray-400 text-xs">CURRENT</div>
        </div>
      </div>
      
      {/* Middle section with power gauge and speed */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* First row - Power gauge */}
        <div className="mb-4 flex justify-center">
          <Speedometer
            value={power}
            min={0}
            max={100}
            unit="%"
            gaugeType="rpm"
            colors={{
              background: '#121212',
              ticks: '#555555',
              numbers: '#888888'
            }}
            size={{ 
              width: 240, 
              height: 240 
            }}
          />
        </div>
        
        {/* Speed display */}
        <div className="mb-10 flex flex-col items-center">
          <div className="text-white text-6xl font-bold">{speed.toFixed(1)}</div>
          <div className="text-blue-400 text-xl">KM/H</div>
        </div>
        
        {/* Second row - Battery gauge */}
        <div className="mb-4 flex justify-center">
          <Speedometer
            value={battery}
            min={0}
            max={100}
            unit="%"
            gaugeType="fuel"
            colors={{
              background: '#121212',
              ticks: '#555555',
              numbers: '#888888'
            }}
            size={{ 
              width: 240, 
              height: 240 
            }}
          />
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="p-4">
        <div className="text-white text-center text-xl mb-3">{distance.toFixed(1)} km</div>
        <div className="text-white">
          <div className="text-gray-300 text-sm">BATTERY</div>
          <div className="text-3xl text-green-500">{battery}<span className="text-xl">%</span></div>
          <div className="text-gray-400 text-xs">REMAINING</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 