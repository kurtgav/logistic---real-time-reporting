import React, { useState } from 'react';
import { Icon } from './Icon';
import { Vehicle } from '../types';

interface NewJobModalProps {
  onClose: () => void;
  onCreate: (job: any) => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    client: '',
    origin: '',
    destination: '',
    vehicleType: '6W Closed Van',
    driver: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create a new vehicle/job entry based on form data
    const newVehicle: Vehicle = {
      id: `new-${Date.now()}`,
      name: `RVL-${Math.floor(Math.random() * 9000) + 1000}`, // Random ID
      type: formData.vehicleType as any,
      status: 'Loading',
      origin: formData.origin,
      destination: formData.destination,
      eta: 'Calculating...',
      progress: 0,
      driver: formData.driver || 'Unassigned',
      fuelLevel: 100,
      currentJob: `${formData.client} - Logistics`,
      costs: {
        fuel: 0,
        tolls: 0,
        labor: 0,
        maintenance: 0,
        miscellaneous: 0,
        total: 0,
        tollEntries: []
      }
    };
    onCreate(newVehicle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Icon name="Plus" size={16} />
            </div>
            Create New Job
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. Toyota Motors, Lazada, Private Individual"
              value={formData.client}
              onChange={e => setFormData({...formData, client: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Origin</label>
                <div className="relative">
                    <Icon name="Map" size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                    required
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Pickup Location"
                    value={formData.origin}
                    onChange={e => setFormData({...formData, origin: e.target.value})}
                    />
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Destination</label>
                <div className="relative">
                    <Icon name="Flag" size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                    required
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Dropoff Location"
                    value={formData.destination}
                    onChange={e => setFormData({...formData, destination: e.target.value})}
                    />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vehicle Type</label>
                <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.vehicleType}
                    onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                >
                    <option value="Car Carrier">Car Carrier</option>
                    <option value="Motorcycle Carrier">Motorcycle Carrier</option>
                    <option value="6W Closed Van">6W Closed Van</option>
                    <option value="10W Wingvan">10W Wingvan</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned Driver</label>
                <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.driver}
                    onChange={e => setFormData({...formData, driver: e.target.value})}
                >
                    <option value="">Auto-Assign</option>
                    <option value="R. Magsaysay">Ramon Magsaysay</option>
                    <option value="J. Santos">Juan Santos</option>
                    <option value="M. Reyes">Miguel Reyes</option>
                    <option value="B. Dantes">Dingdong Dantes</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
                <input 
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Time</label>
                <input 
                    type="time"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                />
             </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
                Confirm Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};