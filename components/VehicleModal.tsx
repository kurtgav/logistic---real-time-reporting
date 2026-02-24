import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Vehicle } from '../types';

interface VehicleModalProps {
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState<Vehicle>({
    id: '',
    name: '',
    type: '6W Closed Van',
    status: 'Stationary',
    origin: 'Cupang HQ',
    destination: '-',
    eta: '-',
    progress: 0,
    driver: 'Unassigned',
    fuelLevel: 100,
    currentJob: 'Available',
    costs: {
        fuel: 0, tolls: 0, labor: 0, maintenance: 0, miscellaneous: 0, total: 0
    }
  });

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Icon name="Truck" size={16} />
            </div>
            {vehicle ? 'Edit Vehicle Asset' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vehicle Name/ID</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. RVL-1005"
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vehicle Type</label>
                <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                    <option value="Car Carrier">Car Carrier</option>
                    <option value="Motorcycle Carrier">Motorcycle Carrier</option>
                    <option value="6W Closed Van">6W Closed Van</option>
                    <option value="10W Wingvan">10W Wingvan</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Operational Status</label>
                <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                    <option value="Stationary">Stationary</option>
                    <option value="In transit">In transit</option>
                    <option value="Loading">Loading</option>
                    <option value="Unloading">Unloading</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Delayed">Delayed</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned Driver</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.driver}
                  onChange={e => setFormData({...formData, driver: e.target.value})}
                  placeholder="Driver Name"
                />
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Hub/Location</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.origin}
              onChange={e => setFormData({...formData, origin: e.target.value})}
              placeholder="e.g. Cupang HQ, Sta. Rosa Depot"
            />
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
                Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};