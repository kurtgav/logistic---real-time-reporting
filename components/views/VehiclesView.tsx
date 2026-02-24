import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { Icon } from '../Icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { geminiService } from '../../services/geminiService';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  mode?: 'inventory' | 'maintenance' | 'telematics';
  onAdd: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onViewProfile?: (vehicle: Vehicle) => void;
}

// Simulated Telematics Data
const telematicsData = [
  { time: '08:00', consumption: 12, speed: 45 },
  { time: '10:00', consumption: 18, speed: 60 },
  { time: '12:00', consumption: 8, speed: 0 },
  { time: '14:00', consumption: 22, speed: 75 },
  { time: '16:00', consumption: 20, speed: 65 },
  { time: '18:00', consumption: 15, speed: 40 },
];

export const VehiclesView: React.FC<VehiclesViewProps> = ({ vehicles, mode = 'inventory', onAdd, onEdit, onDelete, onViewProfile }) => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const maintenanceSchedule = [
    { id: 'm1', vehicle: 'RVL-801', service: 'Quarterly PMS', dueDate: 'Today', status: 'Urgent', cost: '₱12,500' },
    { id: 'm2', vehicle: 'RVL-402', service: 'Oil Change', dueDate: 'Oct 28', status: 'Upcoming', cost: '₱4,500' },
    { id: 'm3', vehicle: 'RVL-105', service: 'Tire Rotation', dueDate: 'Oct 30', status: 'Upcoming', cost: '₱2,000' },
    { id: 'm4', vehicle: 'RVL-550', service: 'Brake Inspection', dueDate: 'Nov 05', status: 'Scheduled', cost: '₱3,500' },
  ];

  const handlePredict = async (vehicleName: string) => {
      setAnalyzingId(vehicleName);
      setPrediction(null);
      const result = await geminiService.predictMaintenance(vehicleName, telematicsData);
      setPrediction(result);
      setAnalyzingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In transit': return 'bg-green-100 text-green-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      case 'Loading': return 'bg-blue-100 text-blue-700';
      case 'Unloading': return 'bg-purple-100 text-purple-700';
      case 'Maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderContent = () => {
    switch(mode) {
      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-red-700">1</div>
                        <div className="text-sm text-red-600">Urgent Service</div>
                    </div>
                    <div className="bg-red-200 p-2 rounded-lg text-red-700"><Icon name="AlertCircle" size={24} /></div>
                </div>
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-orange-700">3</div>
                        <div className="text-sm text-orange-600">Due This Week</div>
                    </div>
                    <div className="bg-orange-200 p-2 rounded-lg text-orange-700"><Icon name="Clock" size={24} /></div>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-green-700">92%</div>
                        <div className="text-sm text-green-600">Fleet Health</div>
                    </div>
                    <div className="bg-green-200 p-2 rounded-lg text-green-700"><Icon name="CheckCircle" size={24} /></div>
                </div>
            </div>
            
            {/* AI Prediction Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 p-6 rounded-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
                        <Icon name="Activity" size={20} /> AI Predictive Diagnostics
                    </h3>
                    <p className="text-sm text-indigo-700 mb-4 max-w-2xl">
                        Analyze recent telematics data (vibration, heat maps, fuel spikes) to detect component failure before it happens.
                    </p>
                    
                    <div className="flex gap-4 items-center">
                        <button 
                            onClick={() => handlePredict('RVL-Fleet-Aggregate')} 
                            disabled={!!analyzingId}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            {analyzingId ? (
                                <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> Running Analysis...</span>
                            ) : (
                                <>Run Fleet Diagnosis <Icon name="ChevronRight" size={16} /></>
                            )}
                        </button>
                        {prediction && (
                            <div className="flex-1 bg-white/60 p-3 rounded-lg border border-indigo-100 text-sm text-indigo-800 font-medium animate-fade-in">
                                {prediction}
                            </div>
                        )}
                    </div>
                </div>
                <Icon name="Wrench" size={120} className="absolute -right-6 -bottom-6 text-indigo-100/50 rotate-12" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Scheduled Maintenance</h3>
                    <button className="text-blue-600 text-sm font-medium hover:underline">Download Report</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vehicle</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Service Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Due Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Est. Cost</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {maintenanceSchedule.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-gray-800">{item.vehicle}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.service}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.dueDate}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.cost}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase">Schedule</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        );
      case 'telematics':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-gray-800">Fleet Efficiency Analytics</h3>
                   <div className="flex gap-2 text-xs">
                      <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Avg Consumption (L/100km)</div>
                      <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Avg Speed (km/h)</div>
                   </div>
                </div>
                <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={telematicsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="speed" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                     </ResponsiveContainer>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.slice(0, 4).map(v => (
                    <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-gray-800">{v.name}</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{v.type}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-xs text-gray-500">Current Fuel</div>
                                <div className={`font-bold ${v.fuelLevel < 20 ? 'text-red-600' : 'text-green-600'}`}>{v.fuelLevel}%</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Avg Consumption</div>
                                <div className="font-bold text-gray-800">8.4 km/L</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Odometer</div>
                                <div className="font-bold text-gray-800">124,592 km</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Engine Health</div>
                                <div className="font-bold text-green-600">Good</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        );
      default:
        // Inventory View
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vehicle ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Driver</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fuel</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vehicles.map((v: any) => (
                            <tr 
                                key={v.id} 
                                className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                onClick={() => onViewProfile && onViewProfile(v)}
                            >
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{v.name}</div>
                                    <div className="text-xs text-gray-400">Plate: ABC-{123 + parseInt(v.id.replace(/\D/g,'') || '0')}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{v.type}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {v.driver.charAt(0)}
                                        </div>
                                        <span className="text-sm text-gray-700">{v.driver}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(v.status)}`}>
                                        {v.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{v.origin}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${v.fuelLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                                                style={{ width: `${v.fuelLevel}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{v.fuelLevel}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onEdit(v); }}
                                            className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                                            title="Edit Asset"
                                        >
                                            <Icon name="Settings" size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDelete(v.id); }}
                                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                            title="Delete Asset"
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
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">
             {mode === 'maintenance' ? 'Maintenance Schedule' : mode === 'telematics' ? 'Fuel & Telematics' : 'Fleet Inventory'}
           </h2>
           <p className="text-sm text-gray-500">Manage your fleet assets effectively</p>
        </div>
        {mode === 'inventory' && (
            <button 
                onClick={onAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
                <Icon name="Plus" size={16} /> Add Vehicle
            </button>
        )}
      </div>
      
      {renderContent()}
    </div>
  );
};