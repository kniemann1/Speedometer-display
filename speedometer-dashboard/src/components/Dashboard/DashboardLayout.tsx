import React, { useState, useEffect } from 'react';
import Speedometer from '../Speedometer/Gauge';

const DashboardLayout: React.FC = () => {
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [power, setPower] = useState(20);
  const [battery, setBattery] = useState(35);
  
  // Simulate speed changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prevSpeed => {
        const newSpeed = Math.max(0, Math.min(100, prevSpeed + (Math.random() > 0.5 ? 0.1 : -0.1))).toFixed(1);
        return parseFloat(newSpeed);
      });
      setDistance(prev => prev + 0.0001);
      setPower(prev => Math.max(0, Math.min(100, prev + (Math.random() > 0.5 ? 0.2 : -0.2))));
      setBattery(prev => Math.max(0, Math.min(100, prev + (Math.random() > 0.8 ? -0.05 : 0))));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-4">
      <div 
        className="relative bg-gray-900 rounded-lg shadow-xl overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '1600px',
          height: '0',
          paddingBottom: '56.25%', // 16:9 aspect ratio
        }}
      >
        {/* Logo */}
        <div className="absolute top-4 left-8">
          <div className="text-white text-2xl font-bold">Elehike<span className="text-sm align-super">®</span></div>
          <div className="text-gray-400 text-xs">SMART DISPLAY SYSTEM</div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-between w-full px-8">
            {/* Left Power Gauge */}
            <div className="relative" style={{ width: '30%' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-gray-300 text-lg font-semibold mb-2">POWER</div>
                <div className="text-5xl font-bold text-blue-500">{power.toFixed(0)}<span className="text-2xl">%</span></div>
                <div className="text-sm text-blue-300 mt-2">CURRENT</div>
              </div>
              <Speedometer
                value={power}
                min={0}
                max={100}
                unit="%"
                gaugeType="rpm"
                colors={{
                  needle: '#FF9500',
                  background: '#1a1a1a',
                  ticks: '#555555',
                  numbers: '#888888'
                }}
                size={{ 
                  width: 400, 
                  height: 400 
                }}
              />
            </div>
            
            {/* Central Digital Speed Display */}
            <div className="flex flex-col items-center" style={{ width: '36%' }}>
              <div className="bg-gray-900 rounded-full p-8 border-8 border-blue-500 mb-6 flex flex-col items-center justify-center"
                style={{ width: '280px', height: '280px' }}>
                <div className="text-white text-8xl font-bold mb-1">{speed}</div>
                <div className="text-blue-400 text-3xl">KM/H</div>
              </div>
              <div className="bg-blue-900 bg-opacity-20 py-2 px-10 rounded-full">
                <div className="text-white text-xl">{distance.toFixed(1)} km</div>
              </div>
              
              {/* Control buttons */}
              <div className="flex space-x-4 mt-8">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white">
                    <span className="material-icons text-2xl">↑</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white">
                    <span className="material-icons text-2xl">↓</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Battery Gauge */}
            <div className="relative" style={{ width: '30%' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-gray-300 text-lg font-semibold mb-2">BATTERY</div>
                <div className="text-5xl font-bold text-green-500">{battery.toFixed(0)}<span className="text-2xl">%</span></div>
                <div className="text-sm text-green-300 mt-2">REMAINING</div>
              </div>
              <Speedometer
                value={battery}
                min={0}
                max={100}
                unit="%"
                gaugeType="fuel"
                colors={{
                  needle: '#34C759',
                  background: '#1a1a1a',
                  ticks: '#555555',
                  numbers: '#888888'
                }}
                size={{ 
                  width: 400, 
                  height: 400 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 