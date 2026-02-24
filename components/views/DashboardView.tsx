import React from 'react';
import { StatCard } from '../StatCard';
import { DeliveryChart } from '../DeliveryChart';
import { MapWidget } from '../MapWidget';
import { ActiveFleet } from '../ActiveFleet';
import { FleetComposition } from '../FleetComposition';
import { OrderStatus } from '../OrderStatus';
import { Icon } from '../Icon';
import { StatMetric, ChartDataPoint, Vehicle, FleetTypeData, OrderStatusData } from '../../types';

interface DashboardViewProps {
  stats: StatMetric[];
  chartData: ChartDataPoint[];
  vehicles: Vehicle[];
  fleetInventory: FleetTypeData[];
  orderStatusData: OrderStatusData[];
  onVehicleClick: (vehicle: Vehicle) => void;
  apiKey?: string; // Added apiKey prop
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  chartData,
  vehicles,
  fleetInventory,
  orderStatusData,
  onVehicleClick,
  apiKey
}) => {
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 space-y-6">
      {/* Intro/Breadcrumb Area */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-800">Operations Snapshot</h2>
          <p className="text-sm text-gray-500">Real-time telematics and job tracking (Philippines)</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Live Data
          </div>
          <button><Icon name="MoreVertical" size={14} /></button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => <StatCard key={idx} metric={stat} />)}
      </div>

      {/* Middle Row: Chart & Map */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 h-[350px]">
          <DeliveryChart data={chartData} />
        </div>
        <div className="xl:col-span-2 h-[350px]">
          <MapWidget vehicles={vehicles} apiKey={apiKey} />
        </div>
      </div>

      {/* Bottom Row: Lists & Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="h-[400px]">
          <ActiveFleet vehicles={vehicles} onVehicleClick={onVehicleClick} />
        </div>
        <div className="h-[400px]">
          <FleetComposition data={fleetInventory} />
        </div>
        <div className="h-[400px]">
          <OrderStatus data={orderStatusData} total={282} />
        </div>
      </div>
    </div>
  );
};