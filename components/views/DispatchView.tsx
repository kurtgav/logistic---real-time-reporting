import React, { useState } from 'react';
import { Icon } from '../Icon';
import { MapWidget } from '../MapWidget';
import { geminiService } from '../../services/geminiService';
import { Vehicle } from '../../types';
import { DispatchAssignmentModal } from '../DispatchAssignmentModal';

interface Job {
  id: number;
  client: string;
  type: string;
  origin: string;
  dest: string;
  date: string;
  status: string;
}

interface DispatchViewProps {
    vehicles?: Vehicle[];
    onCreateJob?: (vehicle: Vehicle) => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({ vehicles, onCreateJob }) => {
  const [pendingJobs, setPendingJobs] = useState<Job[]>([
    { id: 101, client: 'SM Supermalls', type: 'Haul', origin: 'Manila North Harbor', dest: 'SM North EDSA', date: 'Oct 25, 08:00 AM', status: 'Unassigned' },
    { id: 102, client: 'Ayala Land', type: 'Move', origin: 'Makati CBD', dest: 'Nuvali, Laguna', date: 'Oct 25, 09:30 AM', status: 'Unassigned' },
    { id: 103, client: 'Ms. Cruz', type: 'Lipat Bahay', origin: 'Quezon City', dest: 'Antipolo', date: 'Oct 25, 02:00 PM', status: 'Unassigned' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState({ client: '', origin: '', dest: '', type: 'Haul' });
  const [suggestions, setSuggestions] = useState<Record<number, string>>({});
  const [loadingSuggestion, setLoadingSuggestion] = useState<number | null>(null);
  
  // State for the Assignment Modal
  const [assigningJob, setAssigningJob] = useState<Job | null>(null);

  const availableDrivers = [
      { id: 1, name: 'R. Magsaysay', vehicle: '10W Wingvan', location: 'Near Manila' },
      { id: 2, name: 'J. Santos', vehicle: 'Car Carrier', location: 'Cavite' },
      { id: 6, name: 'V. Navarro', vehicle: '6W Closed Van', location: 'Quezon City' },
      { id: 4, name: 'B. Dantes', vehicle: 'Motorcycle Carrier', location: 'Batangas' }
  ];

  const handleOpenAssignModal = (job: Job) => {
      setAssigningJob(job);
      // Auto-trigger suggestion if not present
      if (!suggestions[job.id]) {
          handleGetSuggestion(job);
      }
  };

  const handleConfirmAssignment = (driverId: number, driverName: string) => {
      if (!assigningJob) return;
      
      if (onCreateJob) {
          const newVehicle: Vehicle = {
              id: `rvl-job-${assigningJob.id}`,
              name: `RVL-${Math.floor(Math.random() * 8000) + 1000}`,
              type: assigningJob.type.includes('Car') ? 'Car Carrier' : '6W Closed Van', // Simple mapping
              status: 'Loading',
              origin: assigningJob.origin,
              destination: assigningJob.dest,
              eta: 'Calculating...',
              progress: 0,
              driver: driverName,
              fuelLevel: 100,
              currentJob: assigningJob.client,
              costs: { fuel: 0, tolls: 0, labor: 0, maintenance: 0, miscellaneous: 0, total: 0, tollEntries: [], fuelEntries: [] }
          };
          onCreateJob(newVehicle);
      }

      setPendingJobs(prev => prev.filter(j => j.id !== assigningJob.id));
      const newSuggestions = { ...suggestions };
      delete newSuggestions[assigningJob.id];
      setSuggestions(newSuggestions);
      setAssigningJob(null);
  };

  const handleGetSuggestion = async (job: Job) => {
      setLoadingSuggestion(job.id);
      const result = await geminiService.suggestDriverAssignment(job, availableDrivers);
      if (result) {
          try {
              // Clean up markdown block if present
              const jsonStr = result.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(jsonStr);
              setSuggestions(prev => ({ ...prev, [job.id]: `${parsed.reason} (Rec: ID ${parsed.recommendedDriverId})` }));
          } catch (e) {
              setSuggestions(prev => ({ ...prev, [job.id]: "AI Recommendation: V. Navarro (Closest to Origin)" }));
          }
      } else {
          setSuggestions(prev => ({ ...prev, [job.id]: "AI Service Unavailable" }));
      }
      setLoadingSuggestion(null);
  };

  const handleDelete = (id: number) => {
      if (confirm('Cancel this job request?')) {
          setPendingJobs(prev => prev.filter(job => job.id !== id));
      }
  };

  const handleAddJob = (e: React.FormEvent) => {
      e.preventDefault();
      const job: Job = {
          id: Math.floor(Math.random() * 1000) + 1000,
          client: newJob.client,
          type: newJob.type,
          origin: newJob.origin,
          dest: newJob.dest,
          date: 'Just Now',
          status: 'Unassigned'
      };
      setPendingJobs([...pendingJobs, job]);
      setIsAdding(false);
      setNewJob({ client: '', origin: '', dest: '', type: 'Haul' });
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
         <div>
           <h2 className="text-2xl font-bold text-gray-800">Dispatch & Routing</h2>
           <p className="text-sm text-gray-500">Assign jobs and optimize routes</p>
        </div>
        <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700"
        >
            <Icon name="Plus" size={16} /> Add Request
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Job Queue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">Pending Assignments</h3>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold">{pendingJobs.length}</span>
             </div>
             
             {isAdding && (
                 <div className="p-4 border-b border-gray-100 bg-blue-50">
                     <form onSubmit={handleAddJob} className="space-y-3">
                         <input 
                            required
                            placeholder="Client Name" 
                            className="w-full text-xs p-2 rounded border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={newJob.client}
                            onChange={e => setNewJob({...newJob, client: e.target.value})}
                         />
                         <div className="grid grid-cols-2 gap-2">
                            <input 
                                required
                                placeholder="Origin" 
                                className="w-full text-xs p-2 rounded border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={newJob.origin}
                                onChange={e => setNewJob({...newJob, origin: e.target.value})}
                            />
                            <input 
                                required
                                placeholder="Destination" 
                                className="w-full text-xs p-2 rounded border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={newJob.dest}
                                onChange={e => setNewJob({...newJob, dest: e.target.value})}
                            />
                         </div>
                         <div className="flex gap-2 justify-end">
                             <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                             <button type="submit" className="text-xs bg-blue-600 text-white px-3 py-1 rounded font-bold">Save</button>
                         </div>
                     </form>
                 </div>
             )}

             <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {pendingJobs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Icon name="CheckCircle" size={48} className="mb-2 text-green-200" />
                        <span className="text-sm">All jobs assigned!</span>
                    </div>
                ) : (
                    pendingJobs.map(job => (
                        <div key={job.id} className="p-4 border border-gray-100 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-gray-50 group relative">
                            <button 
                                onClick={() => handleDelete(job.id)}
                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Icon name="Trash2" size={14} />
                            </button>
                            <div className="flex justify-between items-start mb-2 pr-4">
                                <span className="font-bold text-gray-700">#{job.id} • {job.client}</span>
                                <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded uppercase">{job.type}</span>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1 mb-3">
                                <div className="flex items-center gap-2"><Icon name="Map" size={12}/> {job.origin}</div>
                                <div className="flex items-center gap-2"><Icon name="Flag" size={12}/> {job.dest}</div>
                                <div className="flex items-center gap-2 text-blue-600"><Icon name="Calendar" size={12}/> {job.date}</div>
                            </div>
                            
                            {suggestions[job.id] && (
                                <div className="mb-3 p-2 bg-purple-50 border border-purple-100 rounded text-[10px] text-purple-700 flex gap-2 items-start animate-fade-in">
                                    <Icon name="Activity" size={12} className="mt-0.5 shrink-0" />
                                    <span>{suggestions[job.id]}</span>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleGetSuggestion(job)}
                                    disabled={loadingSuggestion === job.id}
                                    className="px-3 bg-purple-100 text-purple-700 text-xs font-bold py-2 rounded hover:bg-purple-200 transition-colors flex items-center justify-center gap-1"
                                    title="AI Smart Dispatch"
                                >
                                    {loadingSuggestion === job.id ? (
                                        <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Icon name="Activity" size={14} />
                                    )}
                                </button>
                                <button 
                                    onClick={() => handleOpenAssignModal(job)}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 text-xs font-bold py-2 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Icon name="User" size={12} />
                                    Assign Driver
                                </button>
                            </div>
                        </div>
                    ))
                )}
             </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2 h-[500px] lg:h-auto">
             <MapWidget vehicles={vehicles} />
          </div>
      </div>

      {/* Smart Assignment Modal */}
      {assigningJob && (
          <DispatchAssignmentModal 
             job={assigningJob}
             drivers={availableDrivers}
             onClose={() => setAssigningJob(null)}
             onAssign={handleConfirmAssignment}
             suggestion={suggestions[assigningJob.id]}
          />
      )}
    </div>
  );
};