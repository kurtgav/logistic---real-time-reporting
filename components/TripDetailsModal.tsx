import React, { useState, useEffect, useRef } from 'react';
import { Vehicle, TollEntry, FuelEntry, AppSettings } from '../types';
import { Icon } from './Icon';
import { geminiService } from '../services/geminiService';

interface TripDetailsModalProps {
  vehicle: Vehicle;
  settings: AppSettings;
  onClose: () => void;
  onUpdate: (updatedVehicle: Vehicle) => void;
}

// Local interface for expenses since it's not in global types yet
interface ExpenseEntry {
    id: string;
    category: 'Maintenance' | 'Parking' | 'Fine' | 'Labor' | 'Other';
    description: string;
    amount: number;
    date: string;
}

// Local interface for Tire Data
interface Tire {
    id: number;
    position: string;
    pressure: number; // psi
    health: number; // percentage
    status: 'Good' | 'Warning' | 'Critical';
}

const commonGantries = [
  // NLEX
  "NLEX Balintawak", "NLEX Mindanao Ave", "NLEX Karuhatan", "NLEX Valenzuela", "NLEX Meycauayan", "NLEX Marilao", 
  "NLEX Ciudad de Victoria", "NLEX Bocaue", "NLEX Tambubong", "NLEX Balagtas", "NLEX Tabang", "NLEX Sta. Rita", 
  "NLEX Pulilan", "NLEX San Simon", "NLEX San Fernando", "NLEX Mexico", "NLEX Angeles", "NLEX Dau", "NLEX Sta. Ines",
  
  // SCTEX
  "SCTEX Tarlac", "SCTEX San Miguel", "SCTEX Luisita", "SCTEX Concepcion", "SCTEX Dolores", "SCTEX Clark North", 
  "SCTEX Clark South", "SCTEX Porac", "SCTEX Floridablanca", "SCTEX Dinalupihan", "SCTEX Tipo",
  
  // TPLEX
  "TPLEX Tarlac City", "TPLEX Victoria", "TPLEX Pura", "TPLEX Ramos", "TPLEX Anao", "TPLEX Carmen", 
  "TPLEX Urdaneta", "TPLEX Binalonan", "TPLEX Pozorrubio", "TPLEX Sison", "TPLEX Rosario",
  
  // SLEX & Skyway
  "Skyway Buendia", "Skyway Quirino", "Skyway Plaza Dilao", "Skyway Nagtahan", "Skyway Quezon Ave", "Skyway Balintawak",
  "SLEX Magallanes", "SLEX Nichols", "SLEX Merville", "SLEX Bicutan", "SLEX Sucat", "SLEX Alabang", "SLEX Filinvest", 
  "SLEX Susana Heights", "SLEX San Pedro", "SLEX Southwoods", "SLEX Carmona", "SLEX Mamplasan", "SLEX Sta. Rosa", 
  "SLEX ABI/Eton", "SLEX Cabuyao", "SLEX Silangan", "SLEX Calamba", "SLEX Sto. Tomas",
  
  // STAR Tollway
  "STAR Sto. Tomas", "STAR Tanauan", "STAR Malvar", "STAR Balete", "STAR Lipa", "STAR Ibaan", "STAR Batangas City",
  
  // CALAX
  "CALAX Mamplasan", "CALAX Laguna Technopark", "CALAX Laguna Blvd", "CALAX Sta. Rosa-Tagaytay", "CALAX Silang East", "CALAX Silang (Aguinaldo)",
  
  // CAVITEX
  "CAVITEX Parañaque", "CAVITEX Kawit", "CAVITEX C5 Link",
  
  // MCX & NAIAX
  "MCX Exit", "NAIAX Terminal 1/2", "NAIAX Terminal 3",
  
  // CLLEX
  "CLLEX Tarlac", "CLLEX Aliaga"
];

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({ vehicle, settings, onClose, onUpdate }) => {
  // Local state for toll & fuel entries
  const [tollEntries, setTollEntries] = useState<TollEntry[]>([]);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  
  // New State for Expenses and Tires
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [tires, setTires] = useState<Tire[]>([]);

  const [activeTab, setActiveTab] = useState<'details' | 'tolls' | 'fuel' | 'maintenance'>('details');
  
  // AI Analysis State
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // OCR/Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanType, setScanType] = useState<'fuel' | 'expense' | null>(null);

  // Initialize state when vehicle ID changes.
  useEffect(() => {
    setTollEntries(vehicle.costs?.tollEntries || []);
    setFuelEntries(vehicle.costs?.fuelEntries || []);
    setAnalysis(null);

    // Initialize Expenses (Mock data based on aggregate costs if entries don't exist)
    if (vehicle.costs && (!vehicle.costs.fuelEntries || vehicle.costs.fuelEntries.length === 0)) {
         // Create dummy expense entries if none exist to match the 'labor' and 'maintenance' costs for visualization
         const initialExpenses: ExpenseEntry[] = [];
         if (vehicle.costs.labor > 0) initialExpenses.push({ id: 'ex-1', category: 'Labor', description: 'Driver & Helper Allowance', amount: vehicle.costs.labor, date: 'Trip Start' });
         if (vehicle.costs.maintenance > 0) initialExpenses.push({ id: 'ex-2', category: 'Maintenance', description: 'Routine Checkup', amount: vehicle.costs.maintenance, date: 'Pre-trip' });
         if (vehicle.costs.miscellaneous > 0) initialExpenses.push({ id: 'ex-3', category: 'Other', description: 'Parking / Meals', amount: vehicle.costs.miscellaneous, date: 'En route' });
         setExpenseEntries(initialExpenses);
    } else {
        setExpenseEntries([]);
    }

    // Initialize Tires based on Vehicle Type
    const tireCount = vehicle.type.includes('10W') ? 10 : vehicle.type.includes('6W') ? 6 : 4;
    const newTires: Tire[] = Array.from({ length: tireCount }, (_, i) => ({
        id: i,
        position: `Tire ${i + 1}`,
        pressure: 110 - Math.floor(Math.random() * 10), // Random PSI between 100-110
        health: 95 - Math.floor(Math.random() * 15), // Random health
        status: 'Good'
    }));
    // Simulate one bad tire for demo
    if (newTires.length > 0) {
        newTires[newTires.length - 1].health = 45;
        newTires[newTires.length - 1].status = 'Warning';
    }
    setTires(newTires);

  }, [vehicle.id, vehicle.type]);

  // Calculate totals dynamically
  const totalTolls = tollEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const totalActualFuel = fuelEntries.reduce((sum, entry) => sum + (entry.totalCost || 0), 0);
  
  // Calculate expenses
  const totalMaintenance = expenseEntries.filter(e => e.category === 'Maintenance').reduce((sum, e) => sum + e.amount, 0);
  const totalLabor = expenseEntries.filter(e => e.category === 'Labor').reduce((sum, e) => sum + e.amount, 0);
  const totalMisc = expenseEntries.filter(e => e.category !== 'Maintenance' && e.category !== 'Labor').reduce((sum, e) => sum + e.amount, 0);

  // Logic: If there are actual fuel entries, use them. Otherwise use estimated fuel.
  const fuelCostToUse = totalActualFuel > 0 ? totalActualFuel : (vehicle.costs?.fuel || 0);

  const currentTotal = totalLabor + totalMaintenance + totalMisc + fuelCostToUse + totalTolls;

  // Get unique providers for the summary
  const providers = Array.from(new Set(tollEntries.map(t => t.provider))).join(' / ') || 'None';

  // Get unique stations and total liters for fuel summary
  const totalLiters = fuelEntries.reduce((sum, entry) => sum + (entry.liters || 0), 0);
  const stations = Array.from(new Set(fuelEntries.map(f => f.station))).filter(Boolean).join(' / ') || 'Estimated';

  // Sync changes back to parent
  useEffect(() => {
     if (!vehicle.costs) return;

     // This is a simplified check. In production, deep compare is better.
     // We trigger update if calculated totals differ from stored totals
     const totalsChanged = 
        totalTolls !== vehicle.costs.tolls || 
        fuelCostToUse !== vehicle.costs.fuel ||
        totalLabor !== vehicle.costs.labor ||
        totalMaintenance !== vehicle.costs.maintenance ||
        totalMisc !== vehicle.costs.miscellaneous;
     
     if (totalsChanged) {
         const updatedVehicle = {
             ...vehicle,
             costs: {
                 ...vehicle.costs,
                 tolls: totalTolls,
                 fuel: fuelCostToUse,
                 labor: totalLabor,
                 maintenance: totalMaintenance,
                 miscellaneous: totalMisc,
                 total: currentTotal,
                 tollEntries: tollEntries,
                 fuelEntries: fuelEntries
             }
         };
         onUpdate(updatedVehicle);
     }
  }, [tollEntries, fuelEntries, expenseEntries, totalTolls, fuelCostToUse, totalLabor, totalMaintenance, totalMisc, currentTotal, vehicle, onUpdate]);

  // -- Handlers --

  const handleTollChange = (id: string, field: keyof TollEntry, value: any) => {
    setTollEntries(prev => prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const addTollEntry = () => {
    const newEntry: TollEntry = {
      id: `new-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: '',
      provider: 'AutoSweep',
      amount: 0
    };
    setTollEntries([...tollEntries, newEntry]);
  };

  const removeTollEntry = (id: string) => {
    setTollEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleFuelChange = (id: string, field: keyof FuelEntry, value: any) => {
    setFuelEntries(prev => prev.map(entry => {
        if (entry.id !== id) return entry;
        const updated = { ...entry, [field]: value };
        // Auto-calc total if liters/price change
        if (field === 'liters' || field === 'pricePerLiter') {
            updated.totalCost = (updated.liters || 0) * (updated.pricePerLiter || 0);
        }
        return updated;
    }));
  };

  const addFuelEntry = (data?: Partial<FuelEntry>) => {
      const newEntry: FuelEntry = {
          id: `fuel-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          station: '',
          liters: 0,
          pricePerLiter: settings.costs.fuelPrice,
          totalCost: 0,
          odometer: 0,
          ...data
      };
      setFuelEntries([...fuelEntries, newEntry]);
  };

  const removeFuelEntry = (id: string) => {
      setFuelEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const addExpenseEntry = (data?: Partial<ExpenseEntry>) => {
      const newEntry: ExpenseEntry = {
          id: `ex-${Date.now()}`,
          category: 'Other',
          description: '',
          amount: 0,
          date: new Date().toLocaleDateString(),
          ...data
      };
      setExpenseEntries([...expenseEntries, newEntry]);
  };

  const removeExpenseEntry = (id: string) => {
      setExpenseEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleExpenseChange = (id: string, field: keyof ExpenseEntry, value: any) => {
      setExpenseEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleAnalyzeTrip = async () => {
    setIsAnalyzing(true);
    const tripData = {
        vehicle: vehicle.name,
        route: `${vehicle.origin} to ${vehicle.destination}`,
        costs: {
            fuel: fuelCostToUse,
            tolls: totalTolls,
            maintenance: totalMaintenance,
            labor: totalLabor,
            misc: totalMisc,
            total: currentTotal
        },
        logs: {
            tolls: tollEntries.length,
            fuel: fuelEntries.length,
            expenses: expenseEntries.length
        }
    };
    
    const result = await geminiService.generateCostSummary(tripData);
    setAnalysis(result || "Could not generate analysis at this time.");
    setIsAnalyzing(false);
  };

  // -- Receipt Scanner Logic --
  const handleUploadClick = (type: 'fuel' | 'expense') => {
      setScanType(type);
      if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && scanType) {
          setIsScanning(true);
          // Simulate reading file
          const result = await geminiService.parseReceiptImage(scanType);
          
          if (scanType === 'fuel') {
              addFuelEntry({
                  station: result.station,
                  liters: result.liters,
                  pricePerLiter: result.price,
                  totalCost: result.total
              });
          } else {
              addExpenseEntry({
                  category: result.category,
                  description: result.description,
                  amount: result.amount
              });
          }
          setIsScanning(false);
          setScanType(null);
      }
  };

  if (!vehicle.costs) return null;

  const renderDetails = () => (
      <div className="space-y-6">
          {/* Status Bar */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Trip Progress</span>
              <span className="text-sm font-bold text-blue-600">{vehicle.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
               <div className="h-full bg-blue-600 rounded-full" style={{ width: `${vehicle.progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex gap-1 items-center">
                <Icon name="Map" size={12} />
                {vehicle.origin}
              </div>
              <div className="flex gap-1 items-center">
                <Icon name="Flag" size={12} />
                {vehicle.destination}
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="CreditCard" size={20} className="text-green-600" />
              Trip Cost Breakdown (PHP)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* FUEL COST CARD */}
              <div className="bg-white border border-orange-100 p-4 rounded-xl shadow-sm ring-1 ring-orange-50 group relative flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase mb-1">
                            <Icon name="Fuel" size={14} className="text-orange-500"/> Fuel Cost
                        </span>
                        <div className="font-bold text-2xl text-orange-700 tracking-tight">₱{fuelCostToUse.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        {fuelEntries.length > 0 ? (
                            <span className="inline-block text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold mb-1">
                                {totalLiters.toFixed(1)} Liters
                            </span>
                        ) : (
                            <span className="inline-block text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold mb-1">
                                Estimated
                            </span>
                        )}
                        <div className="text-[10px] text-gray-500 font-medium max-w-[100px] truncate" title={stations}>
                            {stations}
                        </div>
                    </div>
                </div>
                
                {fuelEntries.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-orange-100 flex-1 min-h-[60px]">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5 px-1">
                        <span>TIME</span>
                        <span>STATION</span>
                        </div>
                        <div className="max-h-[80px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                            {[...fuelEntries].reverse().map((entry, idx) => (
                                <div key={entry.id || idx} className="flex justify-between items-center text-xs px-1 py-1 hover:bg-orange-50 rounded transition-colors group/item">
                                    <div className="text-gray-500 font-medium whitespace-nowrap font-mono">{entry.timestamp}</div>
                                    <div className="text-gray-800 font-medium truncate max-w-[120px] text-right" title={entry.station}>{entry.station || '-'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={() => { setActiveTab('fuel'); addFuelEntry(); }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-orange-50 hover:bg-orange-100 text-orange-600 p-1.5 rounded-lg"
                    title="Quick Add Fuel Log"
                >
                    <Icon name="Plus" size={14} />
                </button>
              </div>
              
              {/* RFID TOLL CARD */}
              <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm ring-1 ring-blue-50 group relative flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase mb-1">
                            <Icon name="CreditCard" size={14} className="text-blue-600"/> RFID Tolls
                        </span>
                        <div className="font-bold text-2xl text-blue-700 tracking-tight">₱{totalTolls.toLocaleString()}</div>
                    </div>
                     <div className="text-right">
                         {totalTolls > 0 && (
                            <span className="inline-block text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold mb-1">
                                {tollEntries.length} Exits
                            </span>
                         )}
                         <div className="text-[10px] text-gray-500 font-medium max-w-[100px] truncate" title={providers}>
                            {providers}
                         </div>
                    </div>
                </div>
                
                {tollEntries.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-blue-100 flex-1 min-h-[60px]">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5 px-1">
                           <span>TIME</span>
                           <span>GANTRY / LOCATION</span>
                        </div>
                        <div className="max-h-[80px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                            {[...tollEntries].reverse().map((entry, idx) => (
                                <div key={entry.id || idx} className="flex justify-between items-center text-xs px-1 py-1 hover:bg-blue-50 rounded transition-colors group/item">
                                     <div className="text-gray-500 font-medium whitespace-nowrap font-mono">{entry.timestamp}</div>
                                     <div className="text-gray-800 font-medium truncate max-w-[120px] text-right" title={entry.location}>{entry.location || '-'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={() => { setActiveTab('tolls'); addTollEntry(); }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-lg"
                    title="Quick Add Toll"
                >
                    <Icon name="Plus" size={14} />
                </button>
              </div>

              {/* MAINTENANCE & OTHER CARD */}
              <div className="bg-white border border-purple-100 p-4 rounded-xl shadow-sm ring-1 ring-purple-50 group relative flex flex-col h-full sm:col-span-2 lg:col-span-1">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase mb-1">
                            <Icon name="Wrench" size={14} className="text-purple-600"/> Maint. & Other
                        </span>
                        <div className="font-bold text-2xl text-purple-700 tracking-tight">₱{(totalMaintenance + totalLabor + totalMisc).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                         <span className="inline-block text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold mb-1">
                             {expenseEntries.length} Items
                         </span>
                         <div className="text-[10px] text-gray-500 font-medium">Labor • Repair • Misc</div>
                    </div>
                 </div>

                 {expenseEntries.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-purple-100 flex-1 min-h-[60px]">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5 px-1">
                           <span>TYPE</span>
                           <span>DESCRIPTION</span>
                        </div>
                        <div className="max-h-[80px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                            {[...expenseEntries].reverse().map((entry, idx) => (
                                <div key={entry.id || idx} className="flex justify-between items-center text-xs px-1 py-1 hover:bg-purple-50 rounded transition-colors group/item">
                                     <div className="text-gray-500 font-medium whitespace-nowrap">{entry.category}</div>
                                     <div className="text-gray-800 font-medium truncate max-w-[120px] text-right" title={entry.description}>{entry.description || '-'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}

                 <button 
                    onClick={() => { setActiveTab('maintenance'); addExpenseEntry(); }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-50 hover:bg-purple-100 text-purple-600 p-1.5 rounded-lg"
                    title="Quick Add Expense"
                >
                    <Icon name="Plus" size={14} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
              <span className="font-medium">Total Trip Cost</span>
              <span className="text-xl font-bold">₱{currentTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* AI Insight Section */}
          {analysis && (
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl animate-fade-in">
                  <h4 className="text-sm font-bold text-purple-800 flex items-center gap-2 mb-2">
                      <Icon name="Activity" size={16} />
                      AI Cost Efficiency Analysis
                  </h4>
                  <p className="text-xs text-purple-700 leading-relaxed">
                      {analysis}
                  </p>
              </div>
          )}
      </div>
  );

  const renderMaintenance = () => (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tire Visualizer */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white p-4">
             <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                 <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Icon name="Disc" size={14} className="text-gray-600"/> Tire Health Monitor
                 </h4>
                 <div className="flex gap-2 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Good</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Wear</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
                 </div>
             </div>
             
             <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-6 relative min-h-[250px] justify-center">
                 {/* Simple Truck Chassis Graphic */}
                 <div className="absolute inset-y-4 w-32 bg-gray-200 border-2 border-gray-300 rounded-lg left-1/2 transform -translate-x-1/2"></div>
                 
                 <div className="grid grid-cols-2 gap-x-24 gap-y-6 relative z-10 w-full max-w-xs">
                     {tires.map((tire) => (
                         <div key={tire.id} className="flex items-center gap-2 group cursor-pointer relative">
                             {/* Left side tires align right, Right side align left */}
                             <div className={`flex flex-col ${tire.id % 2 === 0 ? 'items-end text-right' : 'items-start order-2'}`}>
                                 <span className="text-[10px] font-bold text-gray-500">{tire.position}</span>
                                 <span className={`text-xs font-bold ${tire.pressure < 90 ? 'text-red-600' : 'text-gray-800'}`}>{tire.pressure} psi</span>
                             </div>
                             
                             <div className={`
                                w-8 h-12 rounded bg-gray-800 border-2 shadow-sm transition-colors hover:scale-105
                                ${tire.status === 'Critical' ? 'border-red-500 ring-2 ring-red-200' : 
                                  tire.status === 'Warning' ? 'border-yellow-500' : 'border-gray-600'}
                                ${tire.id % 2 === 1 ? 'order-1' : ''}
                             `} title={`Health: ${tire.health}%`}>
                                 {/* Tread Lines */}
                                 <div className="w-full h-full flex flex-col justify-between py-1 opacity-30">
                                     {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-white"></div>)}
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
             <p className="text-xs text-center text-gray-400 mt-2">Click tire to log measurement or replacement</p>
        </div>

        {/* Expenses Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Icon name="FileText" size={14} className="text-purple-600"/>
                Trip Expenses
                </h4>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleUploadClick('expense')}
                        disabled={isScanning}
                        className="bg-white border border-purple-200 text-purple-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-purple-50 transition-colors shadow-sm"
                    >
                        {isScanning ? (
                            <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Icon name="Lock" size={12} className="rotate-0" />
                        )}
                        Scan Receipt
                    </button>
                    <button 
                        onClick={() => addExpenseEntry()}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                    <Icon name="Plus" size={12} /> Add
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <tr>
                            <th className="px-3 py-2 font-medium text-xs w-24">Type</th>
                            <th className="px-3 py-2 font-medium text-xs">Description</th>
                            <th className="px-3 py-2 font-medium text-xs w-20 text-right">Cost (₱)</th>
                            <th className="px-2 py-2 w-8"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {expenseEntries.length === 0 && (
                             <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-xs italic">No additional expenses logged.</td></tr>
                        )}
                        {expenseEntries.map(entry => (
                            <tr key={entry.id} className="hover:bg-purple-50/30">
                                <td className="px-3 py-2">
                                    <select 
                                        value={entry.category}
                                        onChange={(e) => handleExpenseChange(entry.id, 'category', e.target.value)}
                                        className="w-full text-[10px] bg-transparent border-none focus:ring-0 font-medium text-gray-700"
                                    >
                                        <option>Maintenance</option>
                                        <option>Labor</option>
                                        <option>Parking</option>
                                        <option>Fine</option>
                                        <option>Other</option>
                                    </select>
                                </td>
                                <td className="px-3 py-2">
                                    <input 
                                        type="text" 
                                        value={entry.description}
                                        onChange={(e) => handleExpenseChange(entry.id, 'description', e.target.value)}
                                        placeholder="Description"
                                        className="w-full text-xs bg-transparent border-b border-transparent focus:border-purple-500 focus:outline-none"
                                    />
                                </td>
                                <td className="px-3 py-2 text-right">
                                    <input 
                                        type="number" 
                                        value={entry.amount}
                                        onChange={(e) => handleExpenseChange(entry.id, 'amount', parseFloat(e.target.value) || 0)}
                                        className="w-full text-xs text-right font-bold text-gray-700 bg-transparent border-b border-transparent focus:border-purple-500 focus:outline-none"
                                    />
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <button onClick={() => removeExpenseEntry(entry.id)} className="text-gray-300 hover:text-red-500 p-1"><Icon name="Trash2" size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {expenseEntries.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-right text-xs font-bold text-gray-700">
                    Total: ₱{expenseEntries.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                </div>
            )}
        </div>
     </div>
  );

  const renderTolls = () => (
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
               <Icon name="CreditCard" size={14} className="text-blue-600"/>
               RFID Usage Log
            </h4>
            <button 
               onClick={addTollEntry}
               className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Icon name="Plus" size={14} /> Add Entry
            </button>
          </div>
          <div className="overflow-x-auto">
            <datalist id="toll-locations">
                {commonGantries.map(gantry => <option key={gantry} value={gantry} />)}
            </datalist>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium text-xs w-24">Timestamp</th>
                  <th className="px-4 py-2 font-medium text-xs w-28">Provider</th>
                  <th className="px-4 py-2 font-medium text-xs">Location/Gantry</th>
                  <th className="px-4 py-2 font-medium text-xs w-24 text-right">Cost (₱)</th>
                  <th className="px-2 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tollEntries.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs italic">No toll entries.</td></tr>
                )}
                {tollEntries.map((toll) => (
                  <tr key={toll.id} className="hover:bg-blue-50/30">
                    <td className="px-4 py-2">
                        <input 
                            type="text" 
                            value={toll.timestamp}
                            onChange={(e) => handleTollChange(toll.id, 'timestamp', e.target.value)}
                            className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-xs text-gray-600 py-1"
                        />
                    </td>
                    <td className="px-4 py-2">
                        <select
                            value={toll.provider}
                            onChange={(e) => handleTollChange(toll.id, 'provider', e.target.value)}
                            className="w-full text-[10px] font-medium rounded border-none focus:ring-0 bg-transparent py-1 cursor-pointer"
                        >
                            <option value="AutoSweep">AutoSweep</option>
                            <option value="EasyTrip">EasyTrip</option>
                        </select>
                    </td>
                    <td className="px-4 py-2">
                        <input 
                            type="text" 
                            list="toll-locations"
                            value={toll.location}
                            onChange={(e) => handleTollChange(toll.id, 'location', e.target.value)}
                            className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-xs text-gray-800 font-medium py-1"
                            placeholder="Select Exit"
                        />
                    </td>
                    <td className="px-4 py-2 text-right">
                         <input 
                            type="number" 
                            value={toll.amount}
                            onChange={(e) => handleTollChange(toll.id, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-xs text-gray-700 font-bold text-right py-1"
                        />
                    </td>
                    <td className="px-2 py-2 text-center">
                        <button onClick={() => removeTollEntry(toll.id)} className="text-gray-300 hover:text-red-500 p-1"><Icon name="Trash2" size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
  );

  const renderFuel = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
             <Icon name="Fuel" size={14} className="text-orange-500"/>
             Fuel Logs
          </h4>
          <div className="flex gap-2">
              <button 
                onClick={() => handleUploadClick('fuel')}
                disabled={isScanning}
                className="bg-white border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-orange-50 transition-colors shadow-sm"
              >
                {isScanning ? (
                    <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Icon name="Lock" size={12} className="rotate-0" />
                )}
                Scan Receipt
              </button>
              <button 
                onClick={() => addFuelEntry()}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors"
              >
                <Icon name="Plus" size={12} /> Add Log
              </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 font-medium text-xs w-24">Date/Time</th>
                <th className="px-4 py-2 font-medium text-xs">Station</th>
                <th className="px-4 py-2 font-medium text-xs w-20 text-right">Liters</th>
                <th className="px-4 py-2 font-medium text-xs w-20 text-right">Price/L</th>
                <th className="px-4 py-2 font-medium text-xs w-24 text-right">Total (₱)</th>
                <th className="px-2 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fuelEntries.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs italic">No fuel logs recorded.</td></tr>
              )}
              {fuelEntries.map((fuel) => (
                <tr key={fuel.id} className="hover:bg-orange-50/30">
                  <td className="px-4 py-2">
                      <input 
                          type="text" 
                          value={fuel.timestamp}
                          onChange={(e) => handleFuelChange(fuel.id, 'timestamp', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none text-xs text-gray-600 py-1"
                      />
                  </td>
                  <td className="px-4 py-2">
                      <input 
                          type="text" 
                          value={fuel.station}
                          onChange={(e) => handleFuelChange(fuel.id, 'station', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none text-xs text-gray-800 font-medium py-1"
                          placeholder="e.g. Petron SLEX"
                      />
                  </td>
                  <td className="px-4 py-2 text-right">
                       <input 
                          type="number" 
                          value={fuel.liters}
                          onChange={(e) => handleFuelChange(fuel.id, 'liters', parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none text-xs text-gray-700 text-right py-1"
                      />
                  </td>
                  <td className="px-4 py-2 text-right">
                       <input 
                          type="number" 
                          value={fuel.pricePerLiter}
                          onChange={(e) => handleFuelChange(fuel.id, 'pricePerLiter', parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none text-xs text-gray-700 text-right py-1"
                      />
                  </td>
                  <td className="px-4 py-2 text-right">
                      <div className="text-xs font-bold text-gray-800 py-1">
                          ₱{(fuel.totalCost || 0).toLocaleString()}
                      </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                      <button onClick={() => removeFuelEntry(fuel.id)} className="text-gray-300 hover:text-red-500 p-1"><Icon name="Trash2" size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Hidden File Input for Scanner */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Icon name="Truck" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{vehicle.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold">{vehicle.type}</span>
                <span>•</span>
                <span>{vehicle.driver}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-100 flex gap-6 sticky top-[88px] bg-white z-10 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('details')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('tolls')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tolls' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                RFID Tolls <span className="ml-1 bg-gray-100 px-1.5 rounded-full text-xs">{tollEntries.length}</span>
            </button>
            <button 
                onClick={() => setActiveTab('fuel')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'fuel' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Fuel Logs <span className="ml-1 bg-gray-100 px-1.5 rounded-full text-xs">{fuelEntries.length}</span>
            </button>
            <button 
                onClick={() => setActiveTab('maintenance')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'maintenance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Maint. & Other <span className="ml-1 bg-gray-100 px-1.5 rounded-full text-xs">{expenseEntries.length}</span>
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'details' && renderDetails()}
          {activeTab === 'tolls' && renderTolls()}
          {activeTab === 'fuel' && renderFuel()}
          {activeTab === 'maintenance' && renderMaintenance()}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0 z-10">
           {activeTab === 'details' && (
               <button 
                  onClick={handleAnalyzeTrip}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2 mr-auto"
               >
                {isAnalyzing ? (
                    <>
                        <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs">Analyzing...</span>
                    </>
                ) : (
                    <>
                        <Icon name="BarChart2" size={16} />
                        <span>Analyze Efficiency</span>
                    </>
                )}
              </button>
           )}

          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Report Issue
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Icon name="FileText" size={16} />
            Export Log
          </button>
        </div>
      </div>
    </div>
  );
};