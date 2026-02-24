import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import { FuelEntry, TollEntry, Driver } from '../../types';

interface DriverMobileViewProps {
  driver?: Driver | null;
  onStatusChange?: (status: 'In transit' | 'Stationary') => void;
  onLogFuel?: (entry: FuelEntry) => void;
  onLogToll?: (entry: TollEntry) => void;
  onReportIssue?: (type: string, description: string) => void;
  onExit?: () => void;
}

// This component simulates the Mobile App view for drivers
export const DriverMobileView: React.FC<DriverMobileViewProps> = ({ 
    driver,
    onStatusChange, 
    onLogFuel, 
    onLogToll, 
    onReportIssue,
    onExit
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'log' | 'history'>('home');
  const [tripStatus, setTripStatus] = useState<'idle' | 'started'>('idle');
  const [showLogModal, setShowLogModal] = useState<'fuel' | 'toll' | 'issue' | null>(null);
  
  // Form states
  const [fuelForm, setFuelForm] = useState({ liters: '', cost: '', odometer: '' });
  const [tollForm, setTollForm] = useState({ location: '', amount: '' });
  const [issueForm, setIssueForm] = useState({ type: 'Mechanical Breakdown', description: '' });

  const [currentTrip, setCurrentTrip] = useState({
      id: '#JB-9921',
      origin: 'Cupang HQ',
      dest: 'Batangas Port',
      cargo: 'Toyota Parts',
      vehicle: driver?.vehicle || 'RVL-1005'
  });

  // Reset state when driver changes
  useEffect(() => {
      if (driver) {
          setCurrentTrip(prev => ({ ...prev, vehicle: driver.vehicle }));
          // If driver is already "On Trip" in dashboard, reflect that here
          if (driver.status === 'On Trip') setTripStatus('started');
          else setTripStatus('idle');
      }
  }, [driver]);

  const handleSwipe = () => {
      if (tripStatus === 'idle') {
          setTripStatus('started');
          if (onStatusChange) onStatusChange('In transit');
      } else {
          setTripStatus('idle'); 
          if (onStatusChange) onStatusChange('Stationary');
      }
  };

  const handleSaveFuel = () => {
      if (onLogFuel && fuelForm.liters && fuelForm.cost) {
          const entry: FuelEntry = {
              id: `f-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              station: 'Petron SLEX', // hardcoded for demo simplicity
              liters: parseFloat(fuelForm.liters),
              pricePerLiter: parseFloat(fuelForm.cost) / parseFloat(fuelForm.liters),
              totalCost: parseFloat(fuelForm.cost),
              odometer: parseFloat(fuelForm.odometer) || 0
          };
          onLogFuel(entry);
          setFuelForm({ liters: '', cost: '', odometer: '' });
          setShowLogModal(null);
          alert('Fuel Log Synced to HQ!');
      }
  };

  const handleSaveToll = () => {
      if (onLogToll && tollForm.amount) {
          const entry: TollEntry = {
              id: `t-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              location: tollForm.location || 'SLEX Exit',
              provider: 'AutoSweep',
              amount: parseFloat(tollForm.amount)
          };
          onLogToll(entry);
          setTollForm({ location: '', amount: '' });
          setShowLogModal(null);
          alert('Toll Expense Synced!');
      }
  };

  const handleReportIssue = () => {
      if (onReportIssue) {
          onReportIssue(issueForm.type, issueForm.description);
          setIssueForm({ type: 'Mechanical Breakdown', description: '' });
          setShowLogModal(null);
          alert('Dispatch Alerted! Status updated to Delayed.');
      }
  };

  const renderLogModal = () => {
      if (!showLogModal) return null;
      const modalType = showLogModal;
      
      let title = '';
      if(modalType === 'fuel') title = 'Log Fuel Refill';
      if(modalType === 'toll') title = 'Log Toll Expense';
      if(modalType === 'issue') title = 'Report Issue';

      return (
          <div className="absolute inset-0 bg-black/50 z-20 flex items-end animate-fade-in">
              <div className="bg-white w-full rounded-t-3xl p-6 pb-8">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                      <button onClick={() => setShowLogModal(null)} className="p-2 bg-gray-100 rounded-full text-gray-500"><Icon name="X" size={20} /></button>
                  </div>
                  
                  <div className="space-y-4">
                      {modalType === 'fuel' && (
                          <>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Liters</label>
                                <input 
                                    type="number" 
                                    value={fuelForm.liters}
                                    onChange={e => setFuelForm({...fuelForm, liters: e.target.value})}
                                    className="w-full text-2xl font-bold border-b border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    placeholder="0.0" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Cost (PHP)</label>
                                <input 
                                    type="number" 
                                    value={fuelForm.cost}
                                    onChange={e => setFuelForm({...fuelForm, cost: e.target.value})}
                                    className="w-full text-2xl font-bold border-b border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    placeholder="₱0.00" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Odometer</label>
                                <input 
                                    type="number" 
                                    value={fuelForm.odometer}
                                    onChange={e => setFuelForm({...fuelForm, odometer: e.target.value})}
                                    className="w-full text-xl border-b border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    placeholder="124000" 
                                />
                            </div>
                            <button 
                                onClick={handleSaveFuel}
                                className="w-full font-bold py-4 rounded-xl shadow-lg mt-4 text-white bg-blue-600"
                            >
                                Save Entry
                            </button>
                          </>
                      )}
                      
                      {modalType === 'toll' && (
                          <>
                             <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Location/Gantry</label>
                                <input 
                                    type="text" 
                                    value={tollForm.location}
                                    onChange={e => setTollForm({...tollForm, location: e.target.value})}
                                    className="w-full text-xl font-bold border-b border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    placeholder="e.g. SLEX Mamplasan" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Amount (PHP)</label>
                                <input 
                                    type="number" 
                                    value={tollForm.amount}
                                    onChange={e => setTollForm({...tollForm, amount: e.target.value})}
                                    className="w-full text-2xl font-bold border-b border-gray-200 py-2 focus:border-blue-600 outline-none" 
                                    placeholder="₱0.00" 
                                />
                            </div>
                            <button 
                                onClick={handleSaveToll}
                                className="w-full font-bold py-4 rounded-xl shadow-lg mt-4 text-white bg-blue-600"
                            >
                                Save Entry
                            </button>
                          </>
                      )}

                      {modalType === 'issue' && (
                          <>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Issue Type</label>
                                <select 
                                    value={issueForm.type}
                                    onChange={e => setIssueForm({...issueForm, type: e.target.value})}
                                    className="w-full text-lg border-b border-gray-200 py-2 focus:border-blue-600 outline-none bg-white"
                                >
                                    <option>Mechanical Breakdown</option>
                                    <option>Flat Tire</option>
                                    <option>Accident / Collision</option>
                                    <option>Delay / Traffic</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                <textarea 
                                    value={issueForm.description}
                                    onChange={e => setIssueForm({...issueForm, description: e.target.value})}
                                    className="w-full border border-gray-200 rounded-lg p-3 h-24 mt-2 text-sm focus:border-blue-600 outline-none" 
                                    placeholder="Describe what happened..."
                                ></textarea>
                            </div>
                            <button className="w-full border border-gray-300 border-dashed rounded-lg p-4 text-gray-500 text-sm font-medium flex items-center justify-center gap-2">
                                <Icon name="Plus" size={16} /> Add Photo
                            </button>
                            <button 
                                onClick={handleReportIssue}
                                className="w-full font-bold py-4 rounded-xl shadow-lg mt-4 text-white bg-red-600"
                            >
                                Report Issue
                            </button>
                          </>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const renderHome = () => (
      <div className="flex flex-col h-full relative">
          <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg pb-12">
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 text-lg">
                          <span className="font-bold">{driver ? driver.name.split(' ')[0].substring(0, 2).toUpperCase() : 'RM'}</span>
                      </div>
                      <div>
                          <h2 className="font-bold text-lg leading-tight">Hi, {driver ? driver.name.split(' ')[0] : 'Ramon'}</h2>
                          <p className="text-xs text-blue-100">{driver?.vehicle || 'No Vehicle'} • {driver ? 'Driver' : '10W Wingvan'}</p>
                      </div>
                  </div>
                  <div className="bg-green-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Online
                  </div>
              </div>
              
              <div className="text-center mb-2">
                  <p className="text-blue-100 text-xs font-medium mb-1 uppercase tracking-wide opacity-80">Today's Earnings (Est.)</p>
                  <h1 className="text-4xl font-bold tracking-tight">₱{(driver ? driver.trips * 150 : 1850).toLocaleString()}.00</h1>
              </div>
          </div>

          <div className="flex-1 px-6 -mt-8 flex flex-col gap-4 overflow-y-auto pb-4 scrollbar-hide">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider">Current Job</span>
                          <h3 className="text-xl font-bold text-gray-800 mt-2">{currentTrip.dest}</h3>
                          <p className="text-sm text-gray-500">from {currentTrip.origin}</p>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-full border border-gray-100">
                          <Icon name="Navigation" size={24} className="text-blue-600" />
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <Icon name="Box" size={18} className="text-gray-400" />
                          <span className="font-medium">{currentTrip.cargo}</span>
                      </div>
                      
                      {/* Swipe Button Simulation */}
                      <button 
                        onClick={handleSwipe}
                        className={`w-full h-14 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-between px-2 overflow-hidden relative group ${tripStatus === 'idle' ? 'bg-blue-600' : 'bg-red-500'}`}
                      >
                          <div className="bg-white/20 h-10 w-10 rounded-lg flex items-center justify-center ml-1">
                              <Icon name={tripStatus === 'idle' ? "ChevronRight" : "X"} size={20} />
                          </div>
                          <span className="absolute left-1/2 transform -translate-x-1/2 text-sm uppercase tracking-wider font-extrabold">
                              {tripStatus === 'idle' ? 'Swipe to Start' : 'Swipe to End'}
                          </span>
                          <div className="w-10"></div> {/* Spacer for centering */}
                      </button>
                  </div>
              </div>

              {tripStatus === 'started' ? (
                  <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setShowLogModal('fuel')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 active:scale-95 transition-transform">
                          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center border border-orange-100">
                              <Icon name="Fuel" size={22} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">Log Gas</span>
                      </button>
                      <button onClick={() => setShowLogModal('toll')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 active:scale-95 transition-transform">
                          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center border border-purple-100">
                              <Icon name="CreditCard" size={22} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">Log Toll</span>
                      </button>
                      <button onClick={() => setShowLogModal('issue')} className="col-span-2 bg-white p-4 rounded-xl shadow-sm border border-red-100 flex flex-row items-center justify-center gap-3 hover:bg-red-50 active:scale-95 transition-transform group">
                           <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <Icon name="AlertCircle" size={18} />
                          </div>
                          <span className="text-sm font-bold text-red-700">Report Issue / Delay</span>
                      </button>
                  </div>
              ) : (
                  <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Icon name="Lock" size={24} className="text-gray-300" />
                      <span className="text-sm font-medium">Start trip to access tools</span>
                  </div>
              )}
          </div>
      </div>
  );

  return (
    <div className="flex flex-col justify-center items-center h-full bg-gray-900 relative">
        {/* Floating Exit Button */}
        {onExit && (
            <div className="absolute top-6 right-6 z-50">
                <button 
                    onClick={onExit}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-red-900/50 transition-all hover:scale-105 active:scale-95"
                >
                    <Icon name="X" size={18} />
                    <span>Exit Simulator</span>
                </button>
            </div>
        )}

        <div className="text-white/50 text-xs font-mono mb-4 uppercase tracking-widest">
            {driver ? `Simulating: ${driver.name} (${driver.vehicle})` : 'Simulating: Default Driver'}
        </div>

        {/* Phone Frame Simulator */}
        <div className="w-full max-w-[375px] h-[90vh] max-h-[812px] bg-white rounded-[40px] shadow-2xl border-8 border-gray-800 overflow-hidden relative flex flex-col ring-4 ring-gray-700/50">
            {/* Status Bar */}
            <div className="h-10 bg-black text-white px-6 flex justify-between items-center text-xs font-bold shrink-0">
                <span>9:41</span>
                <div className="flex gap-1.5">
                    <Icon name="Activity" size={12} />
                    <Icon name="Headphones" size={12} />
                    <div className="w-5 h-3 border border-white/50 rounded-sm relative ml-1">
                        <div className="absolute inset-0.5 bg-white w-3/4"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide relative">
                {activeTab === 'home' && renderHome()}
                {activeTab === 'log' && (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip History</h2>
                        {[1,2,3].map(i => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 mb-3 shadow-sm flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-800">Batangas Port</div>
                                    <div className="text-xs text-gray-500">Yesterday • 4h 30m</div>
                                </div>
                                <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">₱450.00</span>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'history' && (
                    <div className="p-6 flex flex-col items-center justify-center h-full text-gray-400 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Icon name="User" size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800">Driver Profile</h3>
                        <p className="text-sm">Performance stats coming soon</p>
                    </div>
                )}
                {renderLogModal()}
            </div>

            {/* Bottom Nav */}
            <div className="h-20 bg-white border-t border-gray-100 flex justify-around items-center px-2 shrink-0 pb-6 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button onClick={() => setActiveTab('home')} className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Icon name="Truck" size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Drive</span>
                </button>
                <button onClick={() => setActiveTab('log')} className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'log' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Icon name="FileText" size={24} strokeWidth={activeTab === 'log' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">History</span>
                </button>
                <button onClick={() => setActiveTab('history')} className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Icon name="User" size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </div>
            
            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gray-900 rounded-full z-20"></div>
        </div>
    </div>
  );
};