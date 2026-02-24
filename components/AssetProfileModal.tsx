import React, { useState } from 'react';
import { Vehicle } from '../types';
import { Icon } from './Icon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AssetProfileModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onEdit: () => void;
}

// Mock Data for charts
const efficiencyData = [
  { month: 'May', efficiency: 8.2 },
  { month: 'Jun', efficiency: 8.5 },
  { month: 'Jul', efficiency: 8.1 },
  { month: 'Aug', efficiency: 7.8 },
  { month: 'Sep', efficiency: 8.4 },
  { month: 'Oct', efficiency: 8.6 },
];

const costData = [
  { category: 'Fuel', amount: 45000 },
  { category: 'Maint.', amount: 12500 },
  { category: 'Tolls', amount: 8200 },
  { category: 'Ins.', amount: 5000 },
];

export const AssetProfileModal: React.FC<AssetProfileModalProps> = ({ vehicle, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'financials'>('overview');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In transit': return 'bg-green-100 text-green-700 border-green-200';
      case 'Maintenance': return 'bg-red-100 text-red-700 border-red-200';
      case 'Stationary': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Odometer</div>
                <div className="text-xl font-bold text-gray-800">{vehicle.totalDistance ? vehicle.totalDistance.toLocaleString() : '124,592'} <span className="text-xs font-medium text-gray-400">km</span></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Engine Hours</div>
                <div className="text-xl font-bold text-gray-800">4,210 <span className="text-xs font-medium text-gray-400">hrs</span></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Avg Efficiency</div>
                <div className="text-xl font-bold text-green-600">8.4 <span className="text-xs font-medium text-gray-400">km/L</span></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Health Score</div>
                <div className="text-xl font-bold text-blue-600">94<span className="text-xs font-medium text-gray-400">/100</span></div>
            </div>
        </div>

        {/* Efficiency Chart */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2">
                <Icon name="Activity" size={16} /> Fuel Efficiency Trend (6 Months)
            </h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={efficiencyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="efficiency" stroke="#22c55e" fillOpacity={1} fill="url(#colorEff)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Specs */}
        <div className="border-t border-gray-100 pt-4">
             <h3 className="font-bold text-gray-800 mb-3 text-sm">Technical Specifications</h3>
             <div className="grid grid-cols-2 gap-y-2 text-sm">
                 <div className="flex justify-between border-b border-gray-50 pb-1">
                     <span className="text-gray-500">Make/Model</span>
                     <span className="font-medium">Isuzu Giga 10W</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-50 pb-1 ml-4">
                     <span className="text-gray-500">Plate Number</span>
                     <span className="font-medium">NBC-1234</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-50 pb-1">
                     <span className="text-gray-500">Transmission</span>
                     <span className="font-medium">Manual 7-Speed</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-50 pb-1 ml-4">
                     <span className="text-gray-500">Fuel Type</span>
                     <span className="font-medium">Diesel</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-50 pb-1">
                     <span className="text-gray-500">Tire Config</span>
                     <span className="font-medium">10-Wheeler</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-50 pb-1 ml-4">
                     <span className="text-gray-500">Load Capacity</span>
                     <span className="font-medium">15,000 kg</span>
                 </div>
             </div>
        </div>
    </div>
  );

  const renderMaintenance = () => (
      <div className="space-y-4 animate-fade-in">
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex justify-between items-center">
               <div className="flex gap-3 items-center">
                   <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                       <Icon name="AlertCircle" size={20} />
                   </div>
                   <div>
                       <h4 className="font-bold text-yellow-800 text-sm">Next Service Due</h4>
                       <p className="text-xs text-yellow-600">Oil Change & Filter Replacement</p>
                   </div>
               </div>
               <div className="text-right">
                   <div className="font-bold text-gray-800">Oct 30</div>
                   <div className="text-xs text-gray-500">in 5 days</div>
               </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50 border-b border-gray-200">
                       <tr>
                           <th className="px-4 py-3 font-bold text-gray-500 text-xs uppercase">Date</th>
                           <th className="px-4 py-3 font-bold text-gray-500 text-xs uppercase">Service</th>
                           <th className="px-4 py-3 font-bold text-gray-500 text-xs uppercase">Mechanic</th>
                           <th className="px-4 py-3 font-bold text-gray-500 text-xs uppercase text-right">Cost</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                       {[
                           { date: 'Sep 15, 2024', service: 'Brake Pad Replacement', mech: 'Mike M.', cost: 4500 },
                           { date: 'Aug 01, 2024', service: 'Quarterly PMS', mech: 'External (Toyota)', cost: 12000 },
                           { date: 'Jun 12, 2024', service: 'Tire Change (Rear-L)', mech: 'Mike M.', cost: 8500 },
                           { date: 'Mar 10, 2024', service: 'Aircon Cleaning', mech: 'Mike M.', cost: 2500 },
                       ].map((rec, idx) => (
                           <tr key={idx} className="hover:bg-gray-50">
                               <td className="px-4 py-3 text-gray-600">{rec.date}</td>
                               <td className="px-4 py-3 font-medium text-gray-800">{rec.service}</td>
                               <td className="px-4 py-3 text-gray-600">{rec.mech}</td>
                               <td className="px-4 py-3 text-right font-medium text-gray-800">₱{rec.cost.toLocaleString()}</td>
                           </tr>
                       ))}
                   </tbody>
               </table>
          </div>
      </div>
  );

  const renderFinancials = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="text-blue-600 text-xs font-bold uppercase mb-1">Total Lifetime Cost</div>
                  <div className="text-2xl font-bold text-blue-900">₱452,100</div>
                  <div className="text-xs text-blue-400 mt-1">Acquired Jan 2022</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="text-purple-600 text-xs font-bold uppercase mb-1">Cost Per KM</div>
                  <div className="text-2xl font-bold text-purple-900">₱32.40</div>
                  <div className="text-xs text-purple-400 mt-1">vs Fleet Avg: ₱35.10</div>
              </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Expense Breakdown (YTD)</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={50} />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                formatter={(value: number) => `₱${value.toLocaleString()}`}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
            <div className="flex gap-4">
                <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-2 shadow-sm">
                    <Icon name="Truck" size={32} className="text-gray-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{vehicle.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getStatusBadge(vehicle.status)}`}>
                            {vehicle.status}
                        </span>
                        <span className="text-sm text-gray-500">• {vehicle.type}</span>
                        <span className="text-sm text-gray-500">• {vehicle.origin}</span>
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
                <Icon name="X" size={24} />
            </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-100 flex gap-6 bg-white shrink-0">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Asset Overview
            </button>
            <button 
                onClick={() => setActiveTab('maintenance')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'maintenance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Maintenance Log
            </button>
            <button 
                onClick={() => setActiveTab('financials')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'financials' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                TCO & Financials
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'maintenance' && renderMaintenance()}
            {activeTab === 'financials' && renderFinancials()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100"
            >
                Close
            </button>
            <button 
                onClick={onEdit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"
            >
                <Icon name="Edit" size={16} /> Edit Asset Details
            </button>
        </div>
      </div>
    </div>
  );
};