import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { Icon } from '../Icon';
import { geminiService } from '../../services/geminiService';

interface ActiveMovesViewProps {
  vehicles: Vehicle[];
  onCompleteTrip?: (vehicle: Vehicle) => void;
}

export const ActiveMovesView: React.FC<ActiveMovesViewProps> = ({ vehicles, onCompleteTrip }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [analyzingVehicle, setAnalyzingVehicle] = useState<string | null>(null);
  const [delayReason, setDelayReason] = useState<string | null>(null);
  
  // Only show active vehicles (not Stationary/Maintenance) + apply status filter
  const activeVehicles = vehicles.filter(v => {
      const isActive = v.status !== 'Stationary' && v.status !== 'Maintenance';
      if (!isActive) return false;
      if (filterStatus === 'All') return true;
      return v.status === filterStatus;
  });

  const handleAnalyzeDelay = async (vehicle: Vehicle) => {
      setAnalyzingVehicle(vehicle.id);
      setDelayReason(null);
      
      const context = `
        Vehicle: ${vehicle.name} (${vehicle.type})
        Route: ${vehicle.origin} to ${vehicle.destination}
        Current Progress: ${vehicle.progress}%
        ETA: ${vehicle.eta}
        Status: DELAYED
        Simulated Context: Heavy traffic reported on SLEX northbound due to road construction near Alabang viaduct.
      `;
      
      const result = await geminiService.analyzeDelayReasons(context);
      setDelayReason(result || "Unable to determine delay reason.");
      setAnalyzingVehicle(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Active Moves</h2>
           <p className="text-sm text-gray-500">Monitoring {activeVehicles.length} ongoing trips</p>
        </div>
        <div className="flex gap-2">
            <div className="relative group">
                <button className="bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                    <Icon name="MoreVertical" size={16} /> Filter: {filterStatus}
                </button>
                <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg hidden group-hover:block z-20">
                    <button onClick={() => setFilterStatus('All')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">All Active</button>
                    <button onClick={() => setFilterStatus('In transit')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-green-600">In Transit</button>
                    <button onClick={() => setFilterStatus('Delayed')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600">Delayed</button>
                    <button onClick={() => setFilterStatus('Loading')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-blue-600">Loading</button>
                </div>
            </div>
            <button className="bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                <Icon name="FileText" size={16} /> Export
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {activeVehicles.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                <Icon name="CheckCircle" size={48} className="mb-3 text-gray-200" />
                <p>No active moves match your filter.</p>
                <button onClick={() => setFilterStatus('All')} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Clear Filter</button>
            </div>
         ) : (
            activeVehicles.map(vehicle => (
             <div key={vehicle.id} className={`bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full animate-fade-in ${vehicle.status === 'Delayed' ? 'border-red-100 ring-1 ring-red-50' : 'border-gray-200'}`}>
                 <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800">{vehicle.name}</h3>
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{vehicle.type}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate w-48" title={vehicle.currentJob}>{vehicle.currentJob}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${vehicle.status === 'Delayed' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {vehicle.status}
                    </span>
                 </div>

                 <div className="flex items-center gap-4 mb-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex-1">
                        <div className="text-gray-400 text-xs mb-1 uppercase font-bold">Origin</div>
                        <div className="font-medium text-gray-700 truncate">{vehicle.origin}</div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-gray-300" />
                    <div className="flex-1 text-right">
                        <div className="text-gray-400 text-xs mb-1 uppercase font-bold">Destination</div>
                        <div className="font-medium text-gray-700 truncate">{vehicle.destination}</div>
                    </div>
                 </div>

                 <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-bold text-blue-600">{vehicle.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${vehicle.progress}%` }}></div>
                    </div>
                 </div>
                 
                 {vehicle.status === 'Delayed' && (
                     <div className="mb-4">
                        {analyzingVehicle === vehicle.id ? (
                            <div className="text-xs text-orange-600 flex items-center gap-2 font-medium bg-orange-50 p-2 rounded">
                                <div className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                                AI Analyzing Route Conditions...
                            </div>
                        ) : delayReason && analyzingVehicle === null ? ( 
                             // Show result only if this card was the one analyzed (simplified logic for demo)
                             // In a real app, delayReason would probably be stored per vehicle or in a modal
                             null 
                        ) : (
                            <button 
                                onClick={() => handleAnalyzeDelay(vehicle)}
                                className="w-full py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-xs font-bold hover:bg-orange-100 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Icon name="Activity" size={14} /> Analyze Delay Cause
                            </button>
                        )}
                        
                        {/* Display Result Hack for Demo - ideally use state per ID */}
                        {delayReason && (
                            <div className="mt-2 bg-orange-50 border border-orange-100 p-3 rounded-lg text-xs text-orange-800 animate-fade-in relative">
                                <button onClick={() => setDelayReason(null)} className="absolute top-1 right-1 text-orange-400 hover:text-orange-600"><Icon name="X" size={12} /></button>
                                <strong>AI Insight:</strong> {delayReason}
                            </div>
                        )}
                     </div>
                 )}

                 <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-xs mt-auto">
                     <div className="flex items-center gap-2 text-gray-500">
                         <Icon name="User" size={14} />
                         <span>{vehicle.driver}</span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500">
                         <Icon name="Clock" size={14} />
                         <span>ETA: {vehicle.eta}</span>
                     </div>
                 </div>
                 
                 {onCompleteTrip && vehicle.status !== 'Delayed' && (
                     <button 
                        onClick={() => onCompleteTrip(vehicle)}
                        className="mt-4 w-full py-2 bg-green-50 text-green-700 font-semibold rounded-lg text-xs hover:bg-green-100 transition-colors flex items-center justify-center gap-2 border border-green-200"
                     >
                        <Icon name="CheckCircle" size={14} />
                        Mark Completed
                     </button>
                 )}
             </div>
            ))
         )}
      </div>
    </div>
  );
};