import React, { useState, useEffect } from 'react';
import Speedometer from '../Speedometer/Gauge';

const DashboardLayout: React.FC = () => {
  const [speed, setSpeed] = useState(3.8);
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
      {/* Top banner */}
      <div className="text-white p-3 flex justify-between">
        <div>
          <div className="text-xl font-bold">Elehike<span className="text-sm align-super">®</span></div>
          <div className="text-gray-400 text-xs">SMART DISPLAY SYSTEM</div>
        </div>
      </div>
      
      {/* Main display area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top row - Power info */}
        <div className="text-white mb-2 pl-6">
          <div className="text-gray-300 text-sm">POWER</div>
          <div className="text-3xl">{power}<span className="text-xl">%</span></div>
          <div className="text-gray-400 text-xs">CURRENT</div>
        </div>
        
        {/* Middle row - Gauges and Speed */}
        <div className="flex-1 flex justify-center items-center">
          {/* Left gauge */}
          <div className="flex-1 flex justify-center">
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
                width: 280, 
                height: 280 
              }}
            />
          </div>
          
          {/* Center speed */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-white text-7xl font-bold">{speed.toFixed(1)}</div>
            <div className="text-blue-400 text-xl">KM/H</div>
          </div>
          
          {/* Right gauge */}
          <div className="flex-1 flex justify-center">
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
                width: 280, 
                height: 280 
              }}
            />
          </div>
        </div>
        
        {/* Bottom row - Distance info */}
        <div className="mb-4 text-center">
          <div className="text-white text-xl">{distance.toFixed(1)} km</div>
        </div>
        
        {/* Bottom section - Battery info */}
        <div className="text-white mb-4 pl-6">
          <div className="text-gray-300 text-sm">BATTERY</div>
          <div className="text-3xl text-green-500">{battery}<span className="text-xl">%</span></div>
          <div className="text-gray-400 text-xs">REMAINING</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 