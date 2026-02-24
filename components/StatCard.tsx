import React from 'react';
import { Icon } from './Icon';
import { StatMetric } from '../types';

interface StatCardProps {
  metric: StatMetric;
}

export const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  const isPositive = metric.trend === 'up';

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm font-medium mb-1">{metric.title}</span>
          <h3 className="text-2xl font-bold text-gray-800">{metric.value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          <Icon name={metric.iconName} size={20} />
        </div>
      </div>
      
      <div className="flex items-center text-xs">
        <span className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'} mr-2`}>
          {isPositive ? '+' : ''}{metric.change}%
        </span>
        <span className="text-gray-400">{metric.period}</span>
      </div>
    </div>
  );
};