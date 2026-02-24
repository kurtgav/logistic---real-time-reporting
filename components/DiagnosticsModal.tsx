import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface DiagnosticsModalProps {
  onClose: () => void;
}

const mockLatencyData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  latency: Math.floor(Math.random() * 40) + 20 // 20-60ms
}));

const mockLogs = [
  { type: 'INFO', msg: 'Vehicle RVL-1005 sent telemetry packet (GPS, Fuel)', time: '10:42:05' },
  { type: 'SUCCESS', msg: 'Gemini AI analysis completed for Trip #102', time: '10:42:03' },
  { type: 'INFO', msg: 'Syncing offline data from Driver App (User: J. Santos)', time: '10:42:01' },
  { type: 'INFO', msg: 'Heartbeat received from Sta. Rosa Depot Gateway', time: '10:41:58' },
  { type: 'WARNING', msg: 'High latency detected on Cell Tower ID #9921 (Batangas)', time: '10:41:55' },
  { type: 'INFO', msg: 'AutoSweep API balance check: Success', time: '10:41:50' },
  { type: 'INFO', msg: 'Vehicle RVL-4101 entered geofence "Metro Manila Zone"', time: '10:41:48' },
];

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({ onClose }) => {
  const [logs, setLogs] = useState(mockLogs);
  const [latencyData, setLatencyData] = useState(mockLatencyData);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulate live logs
  useEffect(() => {
    const interval = setInterval(() => {
        const vehicles = ['RVL-1005', 'RVL-6022', 'RVL-4101', 'RVL-9003'];
        const actions = ['GPS Update', 'Fuel Sensor Read', 'Accelerometer Ping', 'API Sync'];
        const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const newLog = {
            type: 'INFO',
            msg: `[${randomVehicle}] ${randomAction} received via WebSocket`,
            time: new Date().toLocaleTimeString()
        };
        
        setLogs(prev => [newLog, ...prev].slice(0, 50));

        // Update latency chart
        setLatencyData(prev => [
            ...prev.slice(1),
            { time: Date.now(), latency: Math.floor(Math.random() * 40) + 20 }
        ]);

    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 text-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-fade-in border border-slate-700">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Icon name="Activity" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold font-mono tracking-tight">Pro Telematics Diagnostics</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        System Operational • v2.4.1-stable
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                <Icon name="X" size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Panel: Metrics */}
            <div className="w-full md:w-1/3 p-6 border-r border-slate-700 overflow-y-auto space-y-6">
                
                {/* System Status Cards */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">API Health Status</h3>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-3">
                            <Icon name="Map" size={18} className="text-blue-400" />
                            <span className="text-sm font-medium">Google Maps Platform</span>
                        </div>
                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">Operational</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-3">
                            <Icon name="Moon" size={18} className="text-purple-400" />
                            <span className="text-sm font-medium">Gemini AI Engine</span>
                        </div>
                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">Operational</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-3">
                            <Icon name="CreditCard" size={18} className="text-orange-400" />
                            <span className="text-sm font-medium">RFID Payment Gateways</span>
                        </div>
                        <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Degraded</span>
                    </div>
                </div>

                {/* Server Load */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Server Uplink</h3>
                    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 h-40">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Latency (ms)</span>
                            <span className="text-green-400 font-mono">32ms avg</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={latencyData}>
                                <Area type="monotone" dataKey="latency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} isAnimationActive={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 100]} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
                        <div className="text-2xl font-bold text-white font-mono">84</div>
                        <div className="text-[10px] text-slate-400 uppercase">Active Sockets</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
                        <div className="text-2xl font-bold text-green-400 font-mono">99.9%</div>
                        <div className="text-[10px] text-slate-400 uppercase">Uptime</div>
                    </div>
                </div>

            </div>

            {/* Right Panel: Terminal */}
            <div className="flex-1 bg-black p-6 font-mono text-xs overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                    <h3 className="font-bold text-slate-400 uppercase tracking-wider">Live Ingestion Log</h3>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                    {logs.map((log, idx) => (
                        <div key={idx} className="flex gap-3 animate-fade-in">
                            <span className="text-slate-500">[{log.time}]</span>
                            <span className={`font-bold ${
                                log.type === 'INFO' ? 'text-blue-400' : 
                                log.type === 'SUCCESS' ? 'text-green-400' :
                                log.type === 'WARNING' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {log.type}
                            </span>
                            <span className="text-slate-300">{log.msg}</span>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500">
                        <span className="animate-pulse">_</span>
                        <span>Listening for incoming telemetry...</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};