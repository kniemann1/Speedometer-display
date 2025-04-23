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
      {/* Header with logo and info */}
      <div className="text-white p-3">
        <div className="text-xl font-bold">Elehike<span className="text-sm align-super">®</span></div>
        <div className="text-gray-400 text-xs mb-2">SMART DISPLAY SYSTEM</div>
        <div>
          <div className="text-gray-300 text-sm">POWER</div>
          <div className="text-2xl font-medium">{power}<span className="text-lg">%</span></div>
          <div className="text-gray-400 text-xs">CURRENT</div>
        </div>
      </div>
      
      {/* Speed display */}
      <div className="mx-auto my-4">
        <div className="text-white text-5xl font-bold">{speed.toFixed(1)}</div>
        <div className="text-blue-400 text-lg text-center">KM/H</div>
      </div>
      
      {/* Main section with gauges in horizontal row */}
      <div className="flex-grow flex flex-row justify-evenly items-center w-full px-4 space-x-24">
        <div className="flex-none">
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
              width: 200, 
              height: 200 
            }}
          />
        </div>
        
        <div className="flex-none">
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
              width: 200, 
              height: 200 
            }}
          />
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-3">
        <div className="text-white text-lg text-center mb-2">{distance.toFixed(1)} km</div>
        <div className="text-white">
          <div className="text-gray-300 text-sm">BATTERY</div>
          <div className="text-2xl font-medium text-green-500">{battery}<span className="text-lg">%</span></div>
          <div className="text-gray-400 text-xs">REMAINING</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 