import React from 'react';
import { Icon } from '../Icon';
import { Vehicle } from '../../types';

interface WarehouseViewProps {
  vehicles: Vehicle[];
  onUpdateStatus?: (vehicleId: string, newStatus: Vehicle['status'], progress?: number) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({ vehicles = [], onUpdateStatus }) => {
  
  // Filter vehicles that are relevant to warehouse operations
  const inboundVehicles = vehicles.filter(v => v.status === 'Unloading');
  const outboundVehicles = vehicles.filter(v => v.status === 'Loading');
  const availableVehicles = vehicles.filter(v => v.status === 'Stationary' && v.origin.includes('HQ') || v.origin.includes('Depot'));

  // Simulate Docks (4 fixed bays)
  const docks = [1, 2, 3, 4];

  // Helper to find a vehicle in a specific dock slot (simulated by index for this demo)
  const getVehicleInDock = (dockIndex: number) => {
      // Simple logic: distribute loading/unloading vehicles across docks
      const activeOps = [...outboundVehicles, ...inboundVehicles];
      return activeOps[dockIndex] || null;
  };

  const handleDockAction = (vehicle: Vehicle) => {
      if (!onUpdateStatus) return;

      if (vehicle.status === 'Loading') {
          if (vehicle.progress < 100) {
              // Finish Loading
              onUpdateStatus(vehicle.id, 'Loading', 100);
          } else {
              // Dispatch
              if (confirm(`Dispatch ${vehicle.name} to ${vehicle.destination}?`)) {
                  onUpdateStatus(vehicle.id, 'In transit', 0);
              }
          }
      } else if (vehicle.status === 'Unloading') {
           if (vehicle.progress < 100) {
              onUpdateStatus(vehicle.id, 'Unloading', 100);
           } else {
              if (confirm(`${vehicle.name} unloaded. Mark as Available?`)) {
                  onUpdateStatus(vehicle.id, 'Stationary', 0);
              }
           }
      }
  };

  return (
    <div className="p-6 space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-bold text-gray-800">Depot Operations</h2>
           <p className="text-sm text-gray-500">Sta. Rosa, Laguna (Main Depot) - Live Status</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
            <Icon name="Activity" size={14} />
            Real-time Sync Active
        </div>
      </div>

      {/* Docks Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {docks.map((dockId, index) => {
            const vehicle = getVehicleInDock(index);
            const isOccupied = !!vehicle;
            
            return (
                <div 
                    key={dockId} 
                    onClick={() => vehicle && handleDockAction(vehicle)}
                    className={`
                        p-6 rounded-xl border-2 transition-all relative overflow-hidden group
                        ${!isOccupied 
                            ? 'border-dashed border-gray-200 bg-gray-50' 
                            : vehicle.status === 'Loading' 
                                ? 'border-blue-200 bg-white hover:border-blue-400 cursor-pointer'
                                : 'border-purple-200 bg-white hover:border-purple-400 cursor-pointer'
                        }
                    `}
                >
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="text-xl font-bold text-gray-700">Bay {dockId}</h3>
                        <span className={`text-xs px-2 py-1 rounded font-bold ${!isOccupied ? 'bg-gray-200 text-gray-500' : vehicle.status === 'Loading' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {!isOccupied ? 'Available' : vehicle.status}
                        </span>
                    </div>

                    {vehicle ? (
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                 <div className={`p-2 rounded-lg ${vehicle.status === 'Loading' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                     <Icon name="Truck" size={24} />
                                 </div>
                                 <div>
                                     <div className="font-bold text-gray-800">{vehicle.name}</div>
                                     <div className="text-[10px] text-gray-500">{vehicle.type}</div>
                                 </div>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{vehicle.status === 'Loading' ? 'Load Progress' : 'Unload Progress'}</span>
                                    <span className="font-bold">{vehicle.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-500 ${vehicle.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                                        style={{ width: `${vehicle.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {vehicle.progress === 100 && (
                                <div className="mt-4 text-center">
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded animate-pulse">
                                        <Icon name="CheckCircle" size={12} /> Ready for {vehicle.status === 'Loading' ? 'Departure' : 'Release'}
                                    </span>
                                    <div className="text-[10px] text-gray-400 mt-1">Click to confirm</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-24 flex items-center justify-center text-gray-300 flex-col gap-2">
                            <Icon name="Package" size={32} />
                            <span className="text-xs font-medium">Ready for assignment</span>
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Box" size={20} /> Today's Throughput
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-blue-600 font-medium">Scheduled Outbound</div>
                        <div className="text-2xl font-bold text-blue-900 mt-1">{outboundVehicles.length + 5} Units</div>
                        <div className="text-xs text-blue-500 mt-2">12,500 kg volume</div>
                      </div>
                      <Icon name="Truck" size={32} className="text-blue-200" />
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-purple-600 font-medium">Inbound Receipts</div>
                        <div className="text-2xl font-bold text-purple-900 mt-1">{inboundVehicles.length + 2} Units</div>
                        <div className="text-xs text-purple-500 mt-2">Returns & Raw Mats</div>
                      </div>
                      <Icon name="Warehouse" size={32} className="text-purple-200" />
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-orange-600 font-medium">Dock Efficiency</div>
                        <div className="text-2xl font-bold text-orange-900 mt-1">45 min</div>
                        <div className="text-xs text-orange-500 mt-2">Avg Turnaround Time</div>
                      </div>
                      <Icon name="Clock" size={32} className="text-orange-200" />
                  </div>
              </div>
          </div>

          {/* Available Fleet at Hub */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Available at Hub</h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{availableVehicles.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[200px]">
                  {availableVehicles.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-4">No available vehicles</div>
                  ) : (
                      availableVehicles.map(v => (
                          <div key={v.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <div>
                                  <div className="font-bold text-sm text-gray-700">{v.name}</div>
                                  <div className="text-[10px] text-gray-500">{v.type}</div>
                              </div>
                              <div className="text-right">
                                  <div className="text-xs font-bold text-green-600">Ready</div>
                                  <div className="text-[10px] text-gray-400">{v.driver}</div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};