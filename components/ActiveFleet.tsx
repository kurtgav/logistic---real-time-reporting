import React from 'react';
import { Vehicle } from '../types';
import { Icon } from './Icon';

interface ActiveFleetProps {
  vehicles: Vehicle[];
  onVehicleClick?: (vehicle: Vehicle) => void;
}

export const ActiveFleet: React.FC<ActiveFleetProps> = ({ vehicles, onVehicleClick }) => {
  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'In transit': return 'bg-green-100 text-green-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      case 'Loading': return 'bg-blue-100 text-blue-700';
      case 'Unloading': return 'bg-purple-100 text-purple-700';
      case 'Stationary': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFuelColor = (level: number) => {
    if (level < 20) return 'text-red-500';
    if (level < 50) return 'text-yellow-500';
    return 'text-green-500';
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Active Fleet</h3>
        <button className="p-1 hover:bg-gray-50 rounded">
          <Icon name="MoreVertical" size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle.id} 
            onClick={() => onVehicleClick && onVehicleClick(vehicle)}
            className="border-b border-gray-50 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{vehicle.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded">{vehicle.type}</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[150px]">{vehicle.currentJob}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2 mt-3">
                <div className="flex items-center gap-1">
                    <Icon name="Map" size={12} className="text-gray-400"/>
                    <span className="font-medium text-gray-600">{vehicle.origin}</span>
                </div>
                <Icon name="ChevronRight" size={12} className="text-gray-300" />
                <div className="flex items-center gap-1">
                    <Icon name="Map" size={12} className="text-gray-400"/>
                    <span className="font-medium text-gray-600">{vehicle.destination}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 flex-1 mr-4">
                    <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1">
                        <div 
                            className={`absolute top-0 left-0 h-full rounded-full ${vehicle.status === 'Delayed' ? 'bg-red-400' : 'bg-blue-500'}`}
                            style={{ width: `${vehicle.progress}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">ETA {vehicle.eta}</span>
                </div>
                
                <div className="flex items-center gap-1" title="Fuel Level">
                    <Icon name="Fuel" size={12} className={getFuelColor(vehicle.fuelLevel)} />
                    <span className="text-[10px] font-bold text-gray-600">{vehicle.fuelLevel}%</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};