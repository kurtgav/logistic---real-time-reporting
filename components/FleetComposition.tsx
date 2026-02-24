import React from 'react';
import { FleetTypeData } from '../types';
import { Icon } from './Icon';

interface FleetCompositionProps {
  data: FleetTypeData[];
}

export const FleetComposition: React.FC<FleetCompositionProps> = ({ data }) => {
  const totalFleet = data.reduce((acc, curr) => acc + curr.count, 0);
  const totalActive = data.reduce((acc, curr) => acc + curr.active, 0);
  const utilizationRate = totalFleet > 0 ? Math.round((totalActive / totalFleet) * 100) : 0;

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Fleet Inventory</h3>
          <p className="text-xs text-gray-500">Vehicle Types & Utilization</p>
        </div>
        
        {/* Circular Utilization Indicator */}
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl pr-4 border border-gray-100">
            <div className="relative w-10 h-10">
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="4"
                    />
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={utilizationRate > 80 ? '#22c55e' : '#3b82f6'}
                        strokeWidth="4"
                        strokeDasharray={`${utilizationRate}, 100`}
                        strokeLinecap="round"
                    />
                 </svg>
            </div>
            <div className="flex flex-col">
                <span className="block text-lg font-bold text-gray-800 leading-none">{utilizationRate}%</span>
                <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wide">Deployed</span>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
        {data.map((item, idx) => {
          const percent = Math.round((item.active / item.count) * 100);
          return (
          <div key={idx} className="group">
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-800 text-sm">{item.type}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${percent > 90 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                        {percent}%
                    </span>
                </div>
                <p className="text-[10px] text-gray-500">{item.capacity}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-800">{item.active}</span>
                <span className="text-xs text-gray-400"> / {item.count}</span>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
               {/* Background stripes for texture */}
               <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)] bg-[length:4px_4px]"></div>
               
               {/* Active Bar */}
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ease-out ${getUtilizationColor(percent)} relative`}
                 style={{ width: `${percent}%` }}
               >
                   <div className="absolute inset-0 bg-white/20"></div>
               </div>
            </div>
            
            <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-gray-400">{item.description}</span>
                <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 rounded">
                    {item.count - item.active} Available
                </span>
            </div>
          </div>
        )})}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50 border border-gray-50">
           <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md">
              <Icon name="Wrench" size={14} />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Maintenance</span>
              <span className="font-bold text-gray-800 text-xs">3 Units</span>
           </div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50 border border-gray-50">
           <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
              <Icon name="CheckCircle" size={14} />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Ready</span>
              <span className="font-bold text-gray-800 text-xs">{totalFleet - totalActive - 3} Units</span>
           </div>
        </div>
      </div>
    </div>
  );
};