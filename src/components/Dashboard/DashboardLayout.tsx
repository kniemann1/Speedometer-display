import React from 'react';
import Speedometer from '../Speedometer/Gauge';

const DashboardLayout: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[1600px] bg-gray-800 rounded-lg shadow-xl" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Speedometer
            value={120}
            min={0}
            max={200}
            unit="km/h"
            size={{ width: 800, height: 450 }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 