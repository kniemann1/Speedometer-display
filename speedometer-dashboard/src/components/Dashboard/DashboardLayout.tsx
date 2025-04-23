import React, { useState, useEffect } from 'react';
import Speedometer from '../Speedometer/Gauge';

const DashboardLayout: React.FC = () => {
  const [power, setPower] = useState(22);
  const [battery, setBattery] = useState(35);
  
  // Simulate value changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPower(prev => {
        // Random fluctuation between 15-30%
        const newValue = Math.max(15, Math.min(30, prev + (Math.random() > 0.5 ? 1 : -1)));
        return newValue;
      });
      
      setBattery(prev => {
        // Battery slowly decreases
        const newValue = Math.max(15, prev - 0.1);
        return newValue;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 text-white">
        <div className="text-xl font-bold">Elehike<span className="text-sm align-super">®</span></div>
        <div className="text-gray-400 text-xs">SMART DISPLAY SYSTEM</div>
        <div className="mt-2">
          <div className="text-gray-300 text-sm">POWER</div>
          <div className="text-3xl">{power}%</div>
          <div className="text-gray-400 text-xs">CURRENT</div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow flex justify-center items-center">
        {/* Container for side-by-side gauges */}
        <div className="flex flex-row space-x-16">
          {/* Power Gauge */}
          <div>
            <Speedometer
              value={power}
              min={0}
              max={100}
              unit="%"
              size={{ 
                width: 300, 
                height: 300 
              }}
            />
          </div>
          
          {/* Battery Gauge */}
          <div>
            <Speedometer
              value={battery}
              min={0}
              max={100}
              unit="%"
              size={{ 
                width: 300, 
                height: 300 
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 text-white">
        <div className="text-center text-lg mb-3">0.1 km</div>
        <div>
          <div className="text-gray-300 text-sm">BATTERY</div>
          <div className="text-3xl text-green-500">{battery}%</div>
          <div className="text-gray-400 text-xs">REMAINING</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 