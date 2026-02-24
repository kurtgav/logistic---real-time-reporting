import React, { useState } from 'react';
import { DeliveryChart } from '../DeliveryChart';
import { ChartDataPoint, Vehicle, Driver } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Icon } from '../Icon';
import { geminiService } from '../../services/geminiService';

interface ReportsViewProps {
  data: ChartDataPoint[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onDriverClick?: (driver: Driver) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ data, vehicles, drivers, onDriverClick }) => {
  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  // Calculate total costs from active vehicles
  const totalCosts = vehicles.reduce((acc, v) => {
      if (v.costs) {
          acc.fuel += v.costs.fuel;
          acc.labor += v.costs.labor;
          acc.maintenance += v.costs.maintenance;
          acc.tolls += v.costs.tolls;
      }
      return acc;
  }, { fuel: 0, labor: 0, maintenance: 0, tolls: 0 });

  const totalValue = totalCosts.fuel + totalCosts.labor + totalCosts.maintenance + totalCosts.tolls;
  
  const costData = [
      { name: 'Fuel', value: totalCosts.fuel, color: '#3b82f6' }, // Blue
      { name: 'Labor', value: totalCosts.labor, color: '#a855f7' }, // Purple
      { name: 'Maintenance', value: totalCosts.maintenance, color: '#22c55e' }, // Green
      { name: 'Tolls', value: totalCosts.tolls, color: '#f97316' }, // Orange
  ].filter(d => d.value > 0);

  // Sort drivers by rating descending
  const sortedDrivers = [...drivers].sort((a, b) => b.rating - a.rating);

  const handleGenerateReport = async () => {
      setIsGenerating(true);
      const metrics = {
          totalCost: totalValue,
          breakdown: totalCosts,
          activeVehicles: vehicles.filter(v => v.status === 'In transit').length,
          topDriver: sortedDrivers[0]?.name
      };
      const result = await geminiService.analyzeFleetPerformance(metrics);
      setReport(result);
      setIsGenerating(false);
  };

  const handleExportCSV = () => {
      const headers = ['Vehicle ID', 'Driver', 'Status', 'Fuel Cost', 'Toll Cost', 'Maint Cost', 'Labor Cost', 'Total Trip Cost'];
      const rows = vehicles.map(v => [
          v.name,
          v.driver,
          v.status,
          v.costs?.fuel.toFixed(2) || '0.00',
          v.costs?.tolls.toFixed(2) || '0.00',
          v.costs?.maintenance.toFixed(2) || '0.00',
          v.costs?.labor.toFixed(2) || '0.00',
          v.costs?.total.toFixed(2) || '0.00'
      ]);

      const csvContent = [
          headers.join(','),
          ...rows.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `RVL_Fleet_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Generate extended forecast data if toggle is on
  const displayData = showForecast 
    ? [
        ...data, 
        { time: 'Next Mon', completed: 0, scheduled: 50, forecast: 50 },
        { time: 'Next Tue', completed: 0, scheduled: 58, forecast: 58 },
        { time: 'Next Wed', completed: 0, scheduled: 72, forecast: 75 },
      ]
    : data;

  return (
    <div className="p-6 space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-bold text-gray-800">Performance Analytics</h2>
           <p className="text-sm text-gray-500">Key Performance Indicators (KPIs) & Cost Analysis</p>
        </div>
        <div className="flex gap-3">
             <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2 mr-2">
                 <span className="text-xs font-bold text-gray-500 mr-2 uppercase">AI Forecast</span>
                 <button 
                    onClick={() => setShowForecast(!showForecast)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${showForecast ? 'bg-purple-600' : 'bg-gray-200'}`}
                 >
                     <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${showForecast ? 'translate-x-4.5' : 'translate-x-1'}`} />
                 </button>
             </div>

             <button 
                onClick={handleExportCSV}
                className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                title="Export Data"
             >
                <Icon name="Download" size={16} /> Export CSV
             </button>
             <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-70"
             >
                {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <Icon name="Activity" size={16} />
                )}
                AI Executive Summary
             </button>
            <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
            </select>
        </div>
      </div>
      
      {report && (
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl animate-fade-in relative overflow-hidden">
               <Icon name="BarChart2" size={100} className="absolute -right-4 -bottom-4 text-purple-100 rotate-12" />
               <div className="relative z-10">
                   <h3 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
                       <Icon name="Activity" size={20} /> Executive Report (Week 42)
                   </h3>
                   <div className="prose text-purple-800 text-sm max-w-none whitespace-pre-wrap font-medium">
                       {report}
                   </div>
               </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[350px]">
              <DeliveryChart data={displayData} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px] flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Operational Cost Distribution</h3>
              <div className="flex-1 min-h-0 relative">
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-0">
                      <div className="text-xl font-bold text-gray-800">₱{(totalValue / 1000).toFixed(1)}k</div>
                      <div className="text-xs text-gray-500">Total Est.</div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={costData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {costData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => `₱${value.toLocaleString()}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
               <Icon name="Users" size={20} /> Driver Performance Leaderboard
           </h3>
           <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50 text-gray-500">
                       <tr>
                           <th className="px-4 py-3 rounded-l-lg">Rank</th>
                           <th className="px-4 py-3">Driver Name</th>
                           <th className="px-4 py-3">Status</th>
                           <th className="px-4 py-3">Trips Completed</th>
                           <th className="px-4 py-3">Rating</th>
                           <th className="px-4 py-3 rounded-r-lg">Calculated Bonus (Est.)</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                       {sortedDrivers.map((driver, index) => (
                           <tr 
                                key={driver.id} 
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => onDriverClick && onDriverClick(driver)}
                           >
                               <td className={`px-4 py-3 font-bold ${index === 0 ? 'text-yellow-600 text-base' : index === 1 ? 'text-gray-500' : index === 2 ? 'text-orange-700' : 'text-gray-400'}`}>
                                   #{index + 1}
                               </td>
                               <td className="px-4 py-3 font-medium text-gray-800">{driver.name}</td>
                               <td className="px-4 py-3">
                                   <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                       driver.status === 'On Trip' ? 'bg-blue-100 text-blue-700' :
                                       driver.status === 'Available' ? 'bg-green-100 text-green-700' : 
                                       'bg-gray-100 text-gray-600'
                                   }`}>
                                       {driver.status}
                                   </span>
                               </td>
                               <td className="px-4 py-3 text-gray-600">{driver.trips}</td>
                               <td className="px-4 py-3">
                                   <div className="flex items-center gap-1 font-bold text-gray-700">
                                       <span className="text-yellow-500"><Icon name="Activity" size={14} /></span>
                                       {driver.rating}
                                   </div>
                               </td>
                               <td className="px-4 py-3 text-green-600 font-medium">
                                   ₱{((driver.trips * 150) + (driver.rating * 500)).toLocaleString()}
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
      </div>
    </div>
  );
};