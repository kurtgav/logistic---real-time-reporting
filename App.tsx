import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { VehiclesView } from './components/views/VehiclesView';
import { ActiveMovesView } from './components/views/ActiveMovesView';
import { DispatchView } from './components/views/DispatchView';
import { WarehouseView } from './components/views/WarehouseView';
import { ReportsView } from './components/views/ReportsView';
import { DriversView } from './components/views/DriversView';
import { SupportView } from './components/views/SupportView';
import { SettingsView } from './components/views/SettingsView';
import { DriverMobileView } from './components/views/DriverMobileView';
import { TripDetailsModal } from './components/TripDetailsModal';
import { NewJobModal } from './components/NewJobModal';
import { DriverModal } from './components/DriverModal';
import { VehicleModal } from './components/VehicleModal';
import { AssetProfileModal } from './components/AssetProfileModal';
import { DriverProfileModal } from './components/DriverProfileModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { LoginView } from './components/LoginView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DemoControls } from './components/DemoControls';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { Icon } from './components/Icon';
import { geminiService } from './services/geminiService';
import { StatMetric, ChartDataPoint, Vehicle, FleetTypeData, OrderStatusData, Driver, AppSettings, AppNotification, FuelEntry, TollEntry } from './types';

// --- RVL MOVERS CORPORATION DATA ---
const stats: StatMetric[] = [
  { title: 'Active Operations', value: '84', change: 12.5, trend: 'up', period: 'units deployed', iconName: 'Truck' },
  { title: 'On-Time Delivery Rate', value: '98.2%', change: 1.1, trend: 'up', period: 'vs target (95%)', iconName: 'CheckCircle' },
  { title: 'Est. Daily Fuel Cost', value: '₱342,500', change: -2.4, trend: 'down', period: 'efficiency gain', iconName: 'Fuel' }, 
  { title: 'Crew Availability', value: '312/438', change: 0, trend: 'up', period: 'personnel ready', iconName: 'Users' },
];

const chartData: ChartDataPoint[] = [
  { time: 'Mon', completed: 45, scheduled: 48 },
  { time: 'Tue', completed: 52, scheduled: 55 },
  { time: 'Wed', completed: 68, scheduled: 70 },
  { time: 'Thu', completed: 62, scheduled: 65 },
  { time: 'Fri', completed: 85, scheduled: 88 },
  { time: 'Sat', completed: 92, scheduled: 95 },
  { time: 'Sun', completed: 25, scheduled: 30 },
];

const fleetInventory: FleetTypeData[] = [
  { type: 'Car Carrier', count: 25, active: 18, capacity: '6-8 Units', description: 'Vehicle Transport' },
  { type: 'Motorcycle Carrier', count: 15, active: 12, capacity: '30-40 Units', description: 'Two-wheel Transport' },
  { type: '6W Closed Van', count: 55, active: 45, capacity: '3,500 kg', description: 'General Cargo' },
  { type: '10W Wingvan', count: 40, active: 32, capacity: '15,000 kg', description: 'Bulk / Long-haul' },
];

const initialActiveVehicles: Vehicle[] = [
  { id: '1', name: 'RVL-1005', type: "10W Wingvan", status: 'In transit', origin: 'Sta. Rosa Depot', destination: 'Batangas Port', eta: '16:45', progress: 65, driver: 'R. Magsaysay', fuelLevel: 58, currentJob: 'Bulk Parts - Toyota', costs: { fuel: 4200, tolls: 840, labor: 2500, maintenance: 500, miscellaneous: 200, total: 8240, tollEntries: [{ id: 't1', timestamp: '09:30 AM', location: 'SLEX Sta. Rosa', provider: 'AutoSweep', amount: 0 }, { id: 't2', timestamp: '10:15 AM', location: 'STAR Tollway Lipa', provider: 'AutoSweep', amount: 340 }], fuelEntries: [] } },
  { id: '2', name: 'RVL-6022', type: "Car Carrier", status: 'Loading', origin: 'Cupang HQ', destination: 'Cebu Dealership', eta: 'Pending', progress: 15, driver: 'J. Santos', fuelLevel: 95, currentJob: 'New Vehicle Distribution (8 Units)', costs: { fuel: 0, tolls: 0, labor: 1200, maintenance: 0, miscellaneous: 0, total: 1200, tollEntries: [], fuelEntries: [] } },
  { id: '3', name: 'RVL-4101', type: "6W Closed Van", status: 'In transit', origin: 'Cavite Hub', destination: 'Parañaque City', eta: '13:00', progress: 80, driver: 'M. Reyes', fuelLevel: 42, currentJob: 'Lazada Logistics Haul', costs: { fuel: 1500, tolls: 184, labor: 1500, maintenance: 200, miscellaneous: 100, total: 3484, tollEntries: [{ id: 't3', timestamp: '08:00 AM', location: 'CAVITEX', provider: 'EasyTrip', amount: 184 }], fuelEntries: [] } },
  { id: '4', name: 'RVL-9003', type: "Motorcycle Carrier", status: 'Unloading', origin: 'Batangas (Soro-Soro)', destination: 'Laguna Technopark', eta: 'Arrived', progress: 100, driver: 'B. Dantes', fuelLevel: 30, currentJob: 'Honda MC Delivery (35 Units)', costs: { fuel: 2800, tolls: 450, labor: 1800, maintenance: 150, miscellaneous: 50, total: 5250, tollEntries: [], fuelEntries: [] } },
  { id: '5', name: 'RVL-1012', type: "10W Wingvan", status: 'Delayed', origin: 'Manila North Harbor', destination: 'Sta. Rosa Depot', eta: '19:30', progress: 25, driver: 'E. Manzano', fuelLevel: 68, currentJob: 'Raw Materials Import', costs: { fuel: 1200, tolls: 0, labor: 1800, maintenance: 300, miscellaneous: 150, total: 3450, tollEntries: [], fuelEntries: [] } },
  { id: '6', name: 'RVL-6055', type: 'Car Carrier', status: 'Maintenance', origin: 'Sta. Rosa Motorpool', destination: '-', eta: '-', progress: 0, driver: 'Unassigned', fuelLevel: 0, currentJob: 'Hydraulic Repair' },
  { id: '7', name: 'RVL-4088', type: '6W Closed Van', status: 'Stationary', origin: 'Cupang HQ', destination: '-', eta: '-', progress: 0, driver: 'K. Yap', fuelLevel: 100, currentJob: 'Available' },
  { id: '8', name: 'RVL-9010', type: 'Motorcycle Carrier', status: 'Stationary', origin: 'Cavite Hub', destination: '-', eta: '-', progress: 0, driver: 'A. Muhlach', fuelLevel: 85, currentJob: 'Available' },
  { id: '9', name: 'RVL-1025', type: '10W Wingvan', status: 'Stationary', origin: 'Batangas (Soro-Soro)', destination: '-', eta: '-', progress: 0, driver: 'P. Pascual', fuelLevel: 78, currentJob: 'Available' },
];

const initialDrivers: Driver[] = [
  { id: 1, name: 'Ramon Magsaysay', status: 'On Trip', vehicle: 'RVL-1005', rating: 4.9, trips: 312, license: 'N01-15-001234' },
  { id: 2, name: 'Juan Santos', status: 'On Trip', vehicle: 'RVL-6022', rating: 4.8, trips: 205, license: 'N02-16-005678' },
  { id: 3, name: 'Miguel Reyes', status: 'On Trip', vehicle: 'RVL-4101', rating: 4.7, trips: 188, license: 'N03-18-009012' },
  { id: 4, name: 'Dingdong Dantes', status: 'On Trip', vehicle: 'RVL-9003', rating: 5.0, trips: 420, license: 'N01-12-003456' },
  { id: 5, name: 'Edu Manzano', status: 'On Trip', vehicle: 'RVL-1012', rating: 4.6, trips: 150, license: 'N04-19-007890' },
  { id: 6, name: 'Vhong Navarro', status: 'Available', vehicle: '-', rating: 4.5, trips: 95, license: 'N02-20-002345' },
  { id: 7, name: 'Coco Martin', status: 'Off Duty', vehicle: '-', rating: 4.9, trips: 280, license: 'N01-14-006789' },
];

const orderStatusData: OrderStatusData[] = [
  { name: 'On Schedule', value: 185, color: '#3b82f6' },
  { name: 'Completed', value: 142, color: '#22c55e' },
  { name: 'Delayed', value: 23, color: '#ef4444' },
  { name: 'Pending', value: 45, color: '#eab308' },
  { name: 'Maintenance', value: 12, color: '#64748b' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // -- Global State --
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialActiveVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);

  // -- Global Settings State --
  const [appSettings, setAppSettings] = useState<AppSettings>({
      general: {
          companyName: 'RVL Movers Corporation',
          address: 'Km 23 East Service Road, Brgy. Cupang, Muntinlupa',
          contact: '(02) 8850-3066',
          timezone: 'Asia/Manila (GMT+8)',
          tin: '123-456-789-000'
      },
      costs: {
          fuelPrice: 68.50,
          perDiem: 500.00,
          autosweepAccount: 'AS-8821-9921',
          easytripAccount: 'ET-1123-4451',
          apiKey: ''
      },
      notifications: {
          emailAlerts: true,
          smsAlerts: false,
          maintenanceAlerts: true,
          delayAlerts: true,
          alertRecipients: 'operations@rvlmovers.com'
      }
  });

  // -- Notifications & Toasts --
  const [notifications, setNotifications] = useState<AppNotification[]>([
      { id: 1, title: 'Maintenance Alert', message: 'RVL-801 is due for PMS today.', type: 'alert', time: '10m ago', read: false },
      { id: 2, title: 'Trip Started', message: 'RVL-402 started trip to QC.', type: 'info', time: '1h ago', read: false },
      { id: 3, title: 'Fuel Threshold', message: 'RVL-550 fuel low (18%).', type: 'warning', time: '2h ago', read: false },
      { id: 4, title: 'Job Completed', message: 'RVL-105 arrived at BGC.', type: 'success', time: '3h ago', read: true },
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // -- Modal States --
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewingAssetProfile, setViewingAssetProfile] = useState<Vehicle | null>(null);
  
  const [newJobModalOpen, setNewJobModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  
  // -- Simulation State --
  const [simulatedDriver, setSimulatedDriver] = useState<Driver | null>(null);

  // -- Simulation Refs --
  const simulationInterval = useRef<number | null>(null);

  // -- Side Effects --
  useEffect(() => {
    // Update Gemini Service when API Key changes
    geminiService.updateApiKey(appSettings.costs.apiKey);
  }, [appSettings.costs.apiKey]);

  // -- Real-time Simulation Engine --
  useEffect(() => {
    if (isAuthenticated) {
        // Run simulation faster (every 1.5s) for smoother demo visuals on map
        simulationInterval.current = window.setInterval(() => {
            setVehicles(prevVehicles => prevVehicles.map(v => {
                // Logic to simulate random delay
                const randomChance = Math.random();
                if (v.status === 'In transit' && randomChance > 0.999) { // Lower prob due to higher frequency
                    addNotification('Trip Delayed', `${v.name} encountered unexpected delay`, 'warning');
                    addToast(`${v.name} reported a delay`, 'warning');
                    return { ...v, status: 'Delayed' };
                }

                if ((v.status === 'In transit' || v.status === 'Delayed') && v.progress < 100) {
                    // Slower increments due to higher frequency
                    const progressIncrement = v.status === 'Delayed' ? 0.05 : 0.3;
                    const newProgress = Math.min(100, v.progress + progressIncrement);
                    const newFuel = Math.max(0, v.fuelLevel - 0.05); 
                    
                    const fuelConsumedLiters = 0.1;
                    const addedFuelCost = fuelConsumedLiters * appSettings.costs.fuelPrice;
                    
                    const newTotal = (v.costs?.total || 0) + addedFuelCost;

                    return {
                        ...v,
                        progress: parseFloat(newProgress.toFixed(2)),
                        fuelLevel: parseFloat(newFuel.toFixed(2)),
                        costs: v.costs ? {
                            ...v.costs,
                            fuel: parseFloat((v.costs.fuel + addedFuelCost).toFixed(2)),
                            total: parseFloat(newTotal.toFixed(2))
                        } : v.costs
                    };
                }
                return v;
            }));
        }, 1500); 
    }

    return () => {
        if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, [isAuthenticated, appSettings.costs.fuelPrice]);


  // -- Helpers --
  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
      const newNotif: AppNotification = {
          id: Date.now(),
          title,
          message,
          type,
          time: 'Just now',
          read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
      const newToast: ToastMessage = { id: Date.now(), message, type };
      setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
      setIsAuthenticated(false);
      setCurrentView('dashboard');
      addToast('Logged out successfully', 'info');
  };

  const handleNavigation = (view: string) => {
      if (view === 'logout') {
          handleLogout();
      } else {
          setCurrentView(view);
      }
  };

  const handleGlobalSearch = (query: string) => {
      const term = query.toLowerCase();
      // Search vehicles
      const foundVehicle = vehicles.find(v => 
          v.name.toLowerCase().includes(term) || 
          v.driver.toLowerCase().includes(term) ||
          v.id.toLowerCase().includes(term)
      );

      if (foundVehicle) {
          setSelectedVehicle(foundVehicle);
          addToast(`Found vehicle: ${foundVehicle.name}`, 'success');
      } else {
          // Search drivers
          const foundDriver = drivers.find(d => d.name.toLowerCase().includes(term));
          if (foundDriver) {
              setSelectedDriver(foundDriver);
              addToast(`Found driver: ${foundDriver.name}`, 'success');
          } else {
              addToast('No matching records found', 'error');
          }
      }
  };

  const handleSimulateDriver = (driver: Driver) => {
      setSimulatedDriver(driver);
      setCurrentView('driver-app');
      addToast(`Simulating mobile view for ${driver.name}`, 'info');
  };

  // --- Handlers: Demo Controls ---
  const handleTriggerDelay = () => {
      // Find an active vehicle and delay it
      const active = vehicles.find(v => v.status === 'In transit');
      if (active) {
          setVehicles(prev => prev.map(v => v.id === active.id ? { ...v, status: 'Delayed' } : v));
          addNotification('Critical Alert', `Accident reported for ${active.name}. Traffic halted.`, 'alert');
          addToast(`${active.name} status updated to DELAYED`, 'error');
      } else {
          addToast('No active vehicles to delay', 'warning');
      }
  };

  const handleTriggerFuelDrop = () => {
      // Find a vehicle and drop fuel
      const target = vehicles.find(v => v.status !== 'Maintenance');
      if (target) {
          setVehicles(prev => prev.map(v => v.id === target.id ? { ...v, fuelLevel: Math.max(5, v.fuelLevel - 25) } : v));
          addNotification('Fuel Theft Alert', `Abnormal fuel drop detected on ${target.name}`, 'warning');
          addToast('Fuel anomaly detected', 'warning');
      }
  };

  const handleTriggerMaintenance = () => {
      // Find a vehicle and mark maintenance
      const target = vehicles.find(v => v.status === 'Stationary');
      if (target) {
           setVehicles(prev => prev.map(v => v.id === target.id ? { ...v, status: 'Maintenance' } : v));
           addNotification('Diagnostics Alert', `Engine code P0300 detected on ${target.name}`, 'warning');
           addToast('Vehicle marked for maintenance', 'warning');
      } else {
          addToast('No stationary vehicles available for maintenance', 'warning');
      }
  };

  // --- Handlers: Vehicles ---
  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    setSelectedVehicle(updatedVehicle);
    addToast('Vehicle details updated', 'success');
  };

  // Status updates from Warehouse View
  const handleWarehouseStatusUpdate = (vehicleId: string, newStatus: Vehicle['status'], progress: number = 0) => {
      setVehicles(prev => prev.map(v => {
          if (v.id === vehicleId) {
             const updated = { ...v, status: newStatus, progress };
             if (newStatus === 'In transit') {
                 addNotification('Vehicle Dispatched', `${v.name} left the hub for ${v.destination}`, 'info');
                 addToast(`${v.name} dispatched`, 'success');
             }
             return updated;
          }
          return v;
      }));
  };

  const handleCreateJob = (newVehicle: Vehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
    addNotification('New Job Created', `Job created for ${newVehicle.name}. Awaiting loading at Warehouse.`, 'info');
    addToast(`Job created: ${newVehicle.name}`, 'success');
    setCurrentView('warehouse'); 
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleModalOpen(true);
  };

  const handleViewAssetProfile = (vehicle: Vehicle) => {
      setViewingAssetProfile(vehicle);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setViewingAssetProfile(null); // Close profile if open
    setEditingVehicle(vehicle);
    setVehicleModalOpen(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if(confirm('Are you sure you want to delete this vehicle asset?')) {
        setVehicles(prev => prev.filter(v => v.id !== id));
        addNotification('Asset Deleted', 'Vehicle removed from fleet inventory', 'warning');
        addToast('Vehicle deleted', 'info');
    }
  };

  const handleSaveVehicle = (vehicleData: Vehicle) => {
    if (editingVehicle) {
        setVehicles(prev => prev.map(v => v.id === vehicleData.id ? vehicleData : v));
        addNotification('Asset Updated', `Details for ${vehicleData.name} saved`, 'success');
        addToast('Vehicle updated', 'success');
    } else {
        const newVehicle = { ...vehicleData, id: `rvl-${Date.now()}` };
        setVehicles(prev => [...prev, newVehicle]);
        addNotification('Asset Added', `New vehicle ${vehicleData.name} added to fleet`, 'success');
        addToast('Vehicle added', 'success');
    }
    setVehicleModalOpen(false);
  };

  // --- Handlers: Driver App Interactions ---
  // Simulate interactions from the Driver App updating the main Dashboard state
  const handleDriverStatusChange = (status: 'In transit' | 'Stationary') => {
      // If we are simulating a specific driver, find their vehicle and update it
      const driverName = simulatedDriver ? simulatedDriver.name : 'R. Magsaysay'; // Fallback to default
      
      setVehicles(prev => prev.map(v => {
          if (v.driver === driverName || (v.driver.charAt(0) === driverName.charAt(0) && v.driver.includes(driverName.split(' ')[1]))) {
             return { ...v, status };
          }
          return v;
      }));
      addNotification('Driver Update', `${driverName} status changed to ${status}`, 'info');
      addToast(`Driver status: ${status}`, 'info');
  };

  const handleDriverLogFuel = (entry: FuelEntry) => {
      const driverName = simulatedDriver ? simulatedDriver.name : 'R. Magsaysay';
      
      setVehicles(prev => prev.map(v => {
          if ((v.driver === driverName || v.name === simulatedDriver?.vehicle || v.id === '1') && v.costs) {
              const newFuelCost = v.costs.fuel + entry.totalCost;
              const newTotal = v.costs.total + entry.totalCost;
              return {
                  ...v,
                  fuelLevel: 100, // Refilled
                  costs: {
                      ...v.costs,
                      fuel: newFuelCost,
                      total: newTotal,
                      fuelEntries: [...(v.costs.fuelEntries || []), entry]
                  }
              };
          }
          return v;
      }));
      addNotification('Fuel Log Received', `${driverName} logged fuel: ₱${entry.totalCost}`, 'info');
      addToast('Fuel log synced', 'success');
  };

  const handleDriverLogToll = (entry: TollEntry) => {
      const driverName = simulatedDriver ? simulatedDriver.name : 'R. Magsaysay';

      setVehicles(prev => prev.map(v => {
          if ((v.driver === driverName || v.name === simulatedDriver?.vehicle || v.id === '1') && v.costs) {
              const newTollCost = v.costs.tolls + entry.amount;
              const newTotal = v.costs.total + entry.amount;
              return {
                  ...v,
                  costs: {
                      ...v.costs,
                      tolls: newTollCost,
                      total: newTotal,
                      tollEntries: [...(v.costs.tollEntries || []), entry]
                  }
              };
          }
          return v;
      }));
      addToast('Toll expense synced', 'success');
  };

  const handleDriverReportIssue = (type: string, description: string) => {
      const driverName = simulatedDriver ? simulatedDriver.name : 'R. Magsaysay';

      setVehicles(prev => prev.map(v => {
          if (v.driver === driverName || v.name === simulatedDriver?.vehicle || v.id === '1') {
              return { ...v, status: 'Delayed' };
          }
          return v;
      }));
      addNotification('Critical Driver Issue', `${driverName} reported: ${type} - ${description}`, 'alert');
      addToast('Issue report received', 'error');
  };

  // --- Handlers: Drivers Management ---
  const handleAddDriver = () => {
    setEditingDriver(null);
    setDriverModalOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setDriverModalOpen(true);
  };

  const handleDeleteDriver = (id: number) => {
    if(confirm('Are you sure you want to remove this driver?')) {
        setDrivers(prev => prev.filter(d => d.id !== id));
        addNotification('Driver Removed', 'Driver profile deleted', 'warning');
        addToast('Driver removed', 'info');
    }
  };

  const handleSaveDriver = (driverData: Driver) => {
    if (editingDriver) {
        setDrivers(prev => prev.map(d => d.id === driverData.id ? driverData : d));
        addNotification('Driver Updated', `Profile for ${driverData.name} updated`, 'success');
        addToast('Driver updated', 'success');
    } else {
        const newDriver = { ...driverData, id: Date.now() };
        setDrivers(prev => [...prev, newDriver]);
        addNotification('Driver Added', `${driverData.name} added to roster`, 'success');
        addToast('Driver added', 'success');
    }
    setDriverModalOpen(false);
  };

  // --- Handlers: Jobs ---
  const handleCompleteTrip = (vehicle: Vehicle) => {
      if (confirm(`Mark job for ${vehicle.name} as Completed?`)) {
          const updatedVehicle: Vehicle = {
              ...vehicle,
              status: 'Stationary',
              progress: 0,
              currentJob: 'Available',
              eta: '-',
              driver: vehicle.driver
          };
          setVehicles(prev => prev.map(v => v.id === vehicle.id ? updatedVehicle : v));
          addNotification('Trip Completed', `${vehicle.name} is now available`, 'success');
          addToast('Trip marked completed', 'success');
      }
  };

  if (!isAuthenticated) {
      return <LoginView onLogin={() => { setIsAuthenticated(true); addToast('Welcome back, Admin', 'success'); }} />;
  }

  // Driver Mobile App Simulation Mode (Full Screen)
  if (currentView === 'driver-app') {
      return (
          <div className="bg-gray-800 h-screen w-full overflow-hidden">
              <DriverMobileView 
                driver={simulatedDriver}
                onStatusChange={handleDriverStatusChange}
                onLogFuel={handleDriverLogFuel}
                onLogToll={handleDriverLogToll}
                onReportIssue={handleDriverReportIssue}
                onExit={() => { setCurrentView('dashboard'); setSimulatedDriver(null); }}
              />
              <ToastContainer toasts={toasts} removeToast={removeToast} />
          </div>
      );
  }

  // Render View Logic
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            stats={stats} 
            chartData={chartData} 
            vehicles={vehicles} 
            fleetInventory={fleetInventory} 
            orderStatusData={orderStatusData}
            onVehicleClick={setSelectedVehicle}
            apiKey={appSettings.costs.apiKey}
          />
        );
      case 'vehicles':
      case 'maintenance':
      case 'telematics':
        return <VehiclesView 
            vehicles={vehicles} 
            mode={currentView === 'vehicles' ? 'inventory' : currentView as any} 
            onAdd={handleAddVehicle}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
            onViewProfile={handleViewAssetProfile}
        />;
      case 'moves':
        return <ActiveMovesView vehicles={vehicles} onCompleteTrip={handleCompleteTrip} />;
      case 'dispatch':
        return <DispatchView vehicles={vehicles} onCreateJob={handleCreateJob} />;
      case 'warehouse':
        return <WarehouseView vehicles={vehicles} onUpdateStatus={handleWarehouseStatusUpdate} />;
      case 'reports':
        return <ReportsView data={chartData} vehicles={vehicles} drivers={drivers} onDriverClick={setSelectedDriver} />;
      case 'drivers':
        return <DriversView 
            drivers={drivers} 
            onAdd={handleAddDriver} 
            onEdit={handleEditDriver}
            onDelete={handleDeleteDriver}
            onViewProfile={setSelectedDriver}
            onSimulateApp={handleSimulateDriver}
        />;
      case 'support':
        return <SupportView />;
      case 'settings':
        return <SettingsView settings={appSettings} onUpdate={setAppSettings} />;
      default:
        return (
          <DashboardView 
            stats={stats} 
            chartData={chartData} 
            vehicles={vehicles} 
            fleetInventory={fleetInventory} 
            orderStatusData={orderStatusData}
            onVehicleClick={setSelectedVehicle}
            apiKey={appSettings.costs.apiKey}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden text-slate-800">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        currentView={currentView}
        onNavigate={handleNavigation}
        onSearch={handleGlobalSearch}
        onViewDiagnostics={() => setDiagnosticsOpen(true)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 relative">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600">
                <Icon name="Menu" size={24} />
             </button>
             <h1 className="text-xl font-bold text-gray-800 hidden md:block">Fleet Command Center</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 gap-2">
                <Icon name="Calendar" size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Oct 24, 2025</span>
                <Icon name="ChevronDown" size={14} className="text-gray-400" />
            </div>

            <div className="relative">
                <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
                >
                    <Icon name="Bell" size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    )}
                </button>
                {notificationsOpen && (
                    <NotificationsPopover 
                        notifications={notifications}
                        onClose={() => setNotificationsOpen(false)} 
                        onMarkRead={markNotificationsRead}
                    />
                )}
            </div>

            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Support">
                 <Icon name="Headphones" size={20} />
            </button>
            
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex items-center justify-center">
                <span className="font-bold text-blue-600 text-sm">RVL</span>
            </div>

            <button 
                onClick={() => setNewJobModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
                <Icon name="Plus" size={16} />
                <span className="hidden sm:inline">New Job</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           {renderView()}
        </div>

        {/* Global Toast Container */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        
        {/* Executive Demo Controls */}
        <DemoControls 
            onTriggerDelay={handleTriggerDelay}
            onTriggerFuelDrop={handleTriggerFuelDrop}
            onTriggerMaintenance={handleTriggerMaintenance}
        />

        {/* Modal Overlays */}
        {selectedVehicle && (
            <TripDetailsModal 
                vehicle={selectedVehicle}
                settings={appSettings} 
                onClose={() => setSelectedVehicle(null)}
                onUpdate={handleUpdateVehicle}
            />
        )}
        
        {viewingAssetProfile && (
            <AssetProfileModal
                vehicle={viewingAssetProfile}
                onClose={() => setViewingAssetProfile(null)}
                onEdit={() => handleEditVehicle(viewingAssetProfile)}
            />
        )}

        {selectedDriver && (
            <DriverProfileModal 
                driver={selectedDriver}
                currentVehicle={vehicles.find(v => v.driver === selectedDriver.name)}
                onClose={() => setSelectedDriver(null)}
            />
        )}

        {newJobModalOpen && (
            <NewJobModal 
                onClose={() => setNewJobModalOpen(false)}
                onCreate={handleCreateJob}
            />
        )}

        {driverModalOpen && (
            <DriverModal 
                driver={editingDriver}
                onClose={() => setDriverModalOpen(false)}
                onSave={handleSaveDriver}
            />
        )}

        {vehicleModalOpen && (
            <VehicleModal 
                vehicle={editingVehicle}
                onClose={() => setVehicleModalOpen(false)}
                onSave={handleSaveVehicle}
            />
        )}

        {diagnosticsOpen && (
            <DiagnosticsModal 
                onClose={() => setDiagnosticsOpen(false)}
            />
        )}
      </main>
    </div>
  );
}