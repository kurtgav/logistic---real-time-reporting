import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { OrderStatusData } from '../types';
import { Icon } from './Icon';

interface OrderStatusProps {
  data: OrderStatusData[];
  total: number;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ data, total }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Order status</h3>
        <button className="p-1 hover:bg-gray-50 rounded">
          <Icon name="MoreVertical" size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-3xl font-bold text-gray-800">{total.toLocaleString()}</span>
            <span className="text-xs text-gray-500">Total shipments</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
         {data.map((item) => (
             <div key={item.name} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                 <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{item.name}</span>
                    <span className="text-sm font-semibold text-gray-700">{Math.round((item.value / total) * 100)}% <span className="text-gray-400 font-normal">• {item.value}</span></span>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};