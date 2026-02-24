import React from 'react';
import { LoadingStatus } from '../types';
import { Icon } from './Icon';

interface LoadingStatsProps {
  stats: LoadingStatus[];
  totalVolume: string;
  totalWeight: string;
}

export const LoadingStats: React.FC<LoadingStatsProps> = ({ stats, totalVolume, totalWeight }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Current loading status</h3>
        <button className="p-1 hover:bg-gray-50 rounded">
          <Icon name="MoreVertical" size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
            <h4 className="text-3xl font-bold text-gray-800">08</h4>
            <span className="text-xs text-gray-500">Truck being loaded</span>
        </div>
        <div>
            <h4 className="text-3xl font-bold text-gray-800">72%</h4>
            <span className="text-xs text-gray-500">Average load</span>
        </div>
      </div>

      <div className="flex gap-2 items-end h-24 mb-6 border-b border-gray-100 pb-4">
         {stats.map((stat, idx) => (
             <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                 <div className="w-full bg-blue-50 rounded-t-md relative h-full flex items-end overflow-hidden">
                     <div 
                        className="w-full bg-gradient-to-t from-teal-400 to-teal-300 transition-all duration-500"
                        style={{ height: `${stat.percentage}%` }}
                     ></div>
                 </div>
             </div>
         ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div>
            <h4 className="text-lg font-bold text-gray-800">{totalVolume}</h4>
            <span className="text-xs text-gray-500">Total volume today</span>
        </div>
        <div>
            <h4 className="text-lg font-bold text-gray-800">{totalWeight}</h4>
            <span className="text-xs text-gray-500">Total weight load</span>
        </div>
      </div>
    </div>
  );
};