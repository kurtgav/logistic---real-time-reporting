import React from 'react';
import { Driver, Vehicle } from '../types';
import { Icon } from './Icon';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';

interface DriverProfileModalProps {
  driver: Driver;
  currentVehicle?: Vehicle;
  onClose: () => void;
}

const performanceData = [
  { month: 'May', rating: 4.5, onTime: 92 },
  { month: 'Jun', rating: 4.7, onTime: 95 },
  { month: 'Jul', rating: 4.6, onTime: 94 },
  { month: 'Aug', rating: 4.8, onTime: 98 },
  { month: 'Sep', rating: 4.9, onTime: 99 },
  { month: 'Oct', rating: 4.9, onTime: 97 },
];

export const DriverProfileModal: React.FC<DriverProfileModalProps> = ({ driver, currentVehicle, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shrink-0">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
                <Icon name="X" size={20} />
            </button>
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-white/30 flex items-center justify-center text-blue-600 text-2xl font-bold shadow-lg">
                    {driver.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{driver.name}</h2>
                    <div className="flex items-center gap-4 text-blue-100 text-sm mt-1">
                        <span className="flex items-center gap-1"><Icon name="CreditCard" size={14} /> {driver.license || 'N/A'}</span>
                        <span className="flex items-center gap-1"><Icon name="Phone" size={14} /> {driver.phone || '+63 917 123 4567'}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold bg-white/20 border border-white/20`}>
                            {driver.status}
                        </span>
                        {currentVehicle && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 border border-green-400/30 text-green-100 flex items-center gap-1">
                                <Icon name="Truck" size={12} /> {currentVehicle.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-500 text-xs font-bold uppercase mb-1">Safety Score</div>
                    <div className="text-2xl font-bold text-gray-800 flex items-end gap-2">
                        98<span className="text-sm text-green-600 mb-1">/100</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '98%' }}></div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-500 text-xs font-bold uppercase mb-1">Lifetime Trips</div>
                    <div className="text-2xl font-bold text-gray-800">{driver.trips}</div>
                    <div className="text-xs text-gray-400 mt-1">Since Jan 2024</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-500 text-xs font-bold uppercase mb-1">Avg Rating</div>
                    <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {driver.rating} <Icon name="Activity" size={20} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Top 5% of fleet</div>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">On-Time Performance (Last 6 Months)</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{fill: '#f8fafc'}}
                            />
                            <Bar dataKey="onTime" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm">Recent Trip History</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    {[
                        { date: 'Oct 23', route: 'Sta. Rosa to Batangas', earn: 1850, status: 'Completed' },
                        { date: 'Oct 21', route: 'Manila to QC', earn: 1200, status: 'Completed' },
                        { date: 'Oct 19', route: 'Cavite to Laguna', earn: 1500, status: 'Late' },
                    ].map((trip, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="font-bold text-gray-700 text-sm">{trip.route}</div>
                                <div className="text-xs text-gray-400">{trip.date}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-800 text-sm">₱{trip.earn.toLocaleString()}</div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${trip.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {trip.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100">
                Download Records
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm">
                Contact Driver
            </button>
        </div>
      </div>
    </div>
  );
};