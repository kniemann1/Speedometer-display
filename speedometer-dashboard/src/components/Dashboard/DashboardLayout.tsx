import React from 'react';
import Speedometer from '../Speedometer/Gauge';

const DashboardLayout: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-4">
      <div 
        className="relative bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '1600px',
          height: '0',
          paddingBottom: '56.25%', // 16:9 aspect ratio
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {/* Main speedometer */}
          <div className="w-full flex justify-center mb-4">
            <div style={{ width: '60%', height: '100%' }}>
              <Speedometer
                value={60}
                min={0}
                max={120}
                unit="km/h"
                gaugeType="speed"
                size={{ 
                  width: Math.min(window.innerWidth * 0.5, 800), 
                  height: Math.min(window.innerWidth * 0.5 * 0.5625, 450) 
                }}
              />
            </div>
          </div>
          
          {/* Two additional gauges in a row */}
          <div className="w-full flex justify-center space-x-8">
            {/* RPM Gauge */}
            <div style={{ width: '40%', height: '100%' }}>
              <Speedometer
                value={3000}
                min={0}
                max={8000}
                unit="RPM"
                gaugeType="rpm"
                colors={{
                  needle: '#FF9500'
                }}
                size={{ 
                  width: Math.min(window.innerWidth * 0.35, 600), 
                  height: Math.min(window.innerWidth * 0.35 * 0.5625, 337) 
                }}
              />
            </div>
            
            {/* Fuel Gauge */}
            <div style={{ width: '40%', height: '100%' }}>
              <Speedometer
                value={75}
                min={0}
                max={100}
                unit="%"
                gaugeType="fuel"
                colors={{
                  needle: '#34C759'
                }}
                size={{ 
                  width: Math.min(window.innerWidth * 0.35, 600), 
                  height: Math.min(window.innerWidth * 0.35 * 0.5625, 337) 
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