import React, { useState } from 'react';
import { Icon } from './Icon';

interface DemoControlsProps {
  onTriggerDelay: () => void;
  onTriggerFuelDrop: () => void;
  onTriggerMaintenance: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({ onTriggerDelay, onTriggerFuelDrop, onTriggerMaintenance }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
      return (
          <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white p-3 rounded-full shadow-xl border border-gray-700 hover:scale-110 transition-transform group"
            title="Open Demo Controls"
          >
              <Icon name="Activity" size={24} className="animate-pulse" />
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
                  Demo Controls
              </div>
          </button>
      );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-4 w-64 animate-fade-in text-white">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
                <Icon name="Activity" size={16} className="text-blue-400" /> Demo Triggers
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <Icon name="X" size={16} />
            </button>
        </div>
        
        <div className="space-y-2">
            <button 
                onClick={onTriggerDelay}
                className="w-full flex items-center gap-3 px-3 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500 rounded-lg transition-all group"
            >
                <div className="p-1.5 bg-red-500 rounded text-white group-hover:scale-110 transition-transform">
                    <Icon name="AlertCircle" size={14} />
                </div>
                <div className="text-left">
                    <div className="text-xs font-bold text-red-200">Force Delay</div>
                    <div className="text-[10px] text-red-400">Trigger traffic incident</div>
                </div>
            </button>

            <button 
                onClick={onTriggerFuelDrop}
                className="w-full flex items-center gap-3 px-3 py-2 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500 rounded-lg transition-all group"
            >
                <div className="p-1.5 bg-orange-500 rounded text-white group-hover:scale-110 transition-transform">
                    <Icon name="Fuel" size={14} />
                </div>
                <div className="text-left">
                    <div className="text-xs font-bold text-orange-200">Spike Fuel</div>
                    <div className="text-[10px] text-orange-400">Simulate theft/leak</div>
                </div>
            </button>

            <button 
                onClick={onTriggerMaintenance}
                className="w-full flex items-center gap-3 px-3 py-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500 rounded-lg transition-all group"
            >
                <div className="p-1.5 bg-blue-500 rounded text-white group-hover:scale-110 transition-transform">
                    <Icon name="Wrench" size={14} />
                </div>
                <div className="text-left">
                    <div className="text-xs font-bold text-blue-200">Maintenance</div>
                    <div className="text-[10px] text-blue-400">Trigger service alert</div>
                </div>
            </button>
        </div>
        
        <div className="mt-4 pt-2 border-t border-gray-700 text-[10px] text-gray-500 text-center">
            For Executive Presentation Only
        </div>
    </div>
  );
};