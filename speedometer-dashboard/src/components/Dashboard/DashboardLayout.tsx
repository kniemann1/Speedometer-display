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
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            style={{ 
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <Speedometer
              value={60}
              min={0}
              max={120}
              unit="km/h"
              size={{ 
                width: Math.min(window.innerWidth * 0.6, 1200), 
                height: Math.min(window.innerWidth * 0.6 * 0.5625, 675) 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 