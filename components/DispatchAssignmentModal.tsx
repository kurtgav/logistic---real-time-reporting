import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Driver } from '../types';

interface Job {
  id: number;
  client: string;
  type: string;
  origin: string;
  dest: string;
}

interface DispatchAssignmentModalProps {
  job: Job;
  drivers: any[]; // Using any to accommodate the simplified driver object in DispatchView
  onClose: () => void;
  onAssign: (driverId: number, driverName: string) => void;
  suggestion?: string; // AI Suggestion text
}

export const DispatchAssignmentModal: React.FC<DispatchAssignmentModalProps> = ({ job, drivers, onClose, onAssign, suggestion }) => {
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  
  // Parse suggestion to get ID if possible
  useEffect(() => {
      if (suggestion) {
          const match = suggestion.match(/ID (\d+)/);
          if (match && match[1]) {
              setSelectedDriverId(parseInt(match[1]));
          }
      }
  }, [suggestion]);

  // Enriched driver data for the modal simulation
  const enrichedDrivers = drivers.map(d => ({
      ...d,
      distance: Math.floor(Math.random() * 15) + 2 + ' km',
      matchScore: Math.floor(Math.random() * 20) + 75, // 75-95%
      status: 'Available',
      capacity: 'Matched'
  })).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
           <div>
               <h2 className="text-xl font-bold text-gray-800">Assign Driver</h2>
               <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                   <Icon name="Package" size={14} /> Job #{job.id} • {job.client}
               </p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
               <Icon name="X" size={20} />
           </button>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-full text-purple-600 shrink-0">
                <Icon name="Activity" size={16} />
            </div>
            <div>
                <h4 className="text-xs font-bold text-purple-800 uppercase mb-1">AI Recommendation</h4>
                <p className="text-sm text-purple-900 font-medium">
                    {suggestion || "Based on traffic and HOS logs, R. Magsaysay is the optimal choice due to proximity to pickup."}
                </p>
            </div>
        </div>

        {/* Driver List */}
        <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Available Drivers near {job.origin}</h3>
            <div className="space-y-3">
                {enrichedDrivers.map((driver, idx) => (
                    <div 
                        key={driver.id}
                        onClick={() => setSelectedDriverId(driver.id)}
                        className={`
                            border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all
                            ${selectedDriverId === driver.id 
                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {driver.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-gray-800 flex items-center gap-2">
                                    {driver.name}
                                    {idx === 0 && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded uppercase">Best Match</span>}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                                    <span className="flex items-center gap-1"><Icon name="Truck" size={12} /> {driver.vehicle}</span>
                                    <span className="flex items-center gap-1"><Icon name="Map" size={12} /> {driver.distance} away</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                             <div className="text-lg font-bold text-gray-800">{driver.matchScore}%</div>
                             <div className="text-[10px] text-gray-400 font-medium uppercase">Match Score</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 text-sm">
                Cancel
            </button>
            <button 
                onClick={() => selectedDriverId && onAssign(selectedDriverId, enrichedDrivers.find(d => d.id === selectedDriverId)?.name || '')}
                disabled={!selectedDriverId}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 text-sm flex items-center gap-2"
            >
                Confirm Assignment <Icon name="ChevronRight" size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};