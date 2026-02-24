import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Driver } from '../types';

interface DriverModalProps {
  driver?: Driver | null;
  onClose: () => void;
  onSave: (driver: Driver) => void;
}

export const DriverModal: React.FC<DriverModalProps> = ({ driver, onClose, onSave }) => {
  const [formData, setFormData] = useState<Driver>({
    id: 0, // Will be set on save if new
    name: '',
    status: 'Available',
    vehicle: '-',
    rating: 5.0,
    trips: 0,
    phone: '',
    license: ''
  });

  useEffect(() => {
    if (driver) {
      setFormData(driver);
    }
  }, [driver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Icon name="Users" size={16} />
            </div>
            {driver ? 'Edit Driver' : 'Add New Driver'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Juan Dela Cruz"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">License No.</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.license || ''}
                  onChange={e => setFormData({...formData, license: e.target.value})}
                  placeholder="N01-..."
                />
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Vehicle Assignment</label>
             <input 
               type="text" 
               className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               value={formData.vehicle}
               onChange={e => setFormData({...formData, vehicle: e.target.value})}
               placeholder="e.g. RVL-402 or '-'"
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
                Save Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};