import React from 'react';
import { Icon } from '../Icon';
import { Driver } from '../../types';

interface DriversViewProps {
  drivers: Driver[];
  onAdd: () => void;
  onEdit: (driver: Driver) => void;
  onDelete: (id: number) => void;
  onViewProfile?: (driver: Driver) => void;
  onSimulateApp?: (driver: Driver) => void;
}

export const DriversView: React.FC<DriversViewProps> = ({ drivers, onAdd, onEdit, onDelete, onViewProfile, onSimulateApp }) => {
  return (
    <div className="p-6 space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-bold text-gray-800">Driver Management</h2>
           <p className="text-sm text-gray-500">Track performance, manage profiles and availability</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
            <Icon name="Plus" size={16} /> Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Icon name="Users" size={24} />
              </div>
              <div>
                  <div className="text-2xl font-bold text-gray-800">{drivers.length}</div>
                  <div className="text-xs text-gray-500">Total Drivers</div>
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <Icon name="CheckCircle" size={24} />
              </div>
              <div>
                  <div className="text-2xl font-bold text-gray-800">{drivers.filter(d => d.status !== 'Off Duty' && d.status !== 'On Leave').length}</div>
                  <div className="text-xs text-gray-500">Active Now</div>
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                  <Icon name="Clock" size={24} />
              </div>
              <div>
                  <div className="text-2xl font-bold text-gray-800">{drivers.filter(d => d.status === 'On Leave').length}</div>
                  <div className="text-xs text-gray-500">On Leave</div>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Current Vehicle</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Performance</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total Trips</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {drivers.map(driver => (
                      <tr 
                        key={driver.id} 
                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                        onClick={() => onViewProfile && onViewProfile(driver)}
                      >
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                      {driver.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-800 text-sm">{driver.name}</div>
                                    <div className="text-[10px] text-gray-400">{driver.license || 'No License'}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  driver.status === 'On Trip' ? 'bg-blue-100 text-blue-700' :
                                  driver.status === 'Available' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-600'
                              }`}>
                                  {driver.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{driver.vehicle}</td>
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-sm text-gray-700">
                                  <span className="text-yellow-500"><Icon name="Activity" size={14} /></span>
                                  <span className="font-bold">{driver.rating}</span>/5.0
                              </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{driver.trips}</td>
                          <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onSimulateApp && onSimulateApp(driver); }}
                                    className="text-gray-400 hover:text-purple-600 p-1 transition-colors"
                                    title="Launch Mobile App Simulator"
                                >
                                    <Icon name="Navigation" size={16} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEdit(driver); }}
                                    className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                                    title="Edit"
                                >
                                    <Icon name="Settings" size={16} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDelete(driver.id); }}
                                    className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                    title="Delete"
                                >
                                    <Icon name="Trash2" size={16} />
                                </button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};