
export interface TollEntry {
  id: string;
  timestamp: string;
  location: string;
  provider: 'AutoSweep' | 'EasyTrip';
  amount: number;
}

export interface FuelEntry {
  id: string;
  timestamp: string;
  station: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometer: number;
}

export interface TripCostBreakdown {
  fuel: number;
  tolls: number;
  labor: number;
  maintenance: number;
  miscellaneous: number;
  total: number;
  tollEntries?: TollEntry[];
  fuelEntries?: FuelEntry[];
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  service: string;
  mechanic: string;
  cost: number;
  odometer: number;
  notes: string;
  status: 'Completed' | 'Scheduled' | 'Pending';
}

export interface Vehicle {
  id: string;
  name: string;
  status: 'In transit' | 'Delayed' | 'Stationary' | 'Loading' | 'Unloading' | 'Maintenance';
  origin: string;
  destination: string;
  eta: string;
  progress: number;
  driver: string;
  type: 'Car Carrier' | 'Motorcycle Carrier' | '6W Closed Van' | '10W Wingvan';
  fuelLevel: number;
  currentJob: string;
  costs?: TripCostBreakdown;
  maintenanceHistory?: MaintenanceRecord[];
  purchaseDate?: string;
  totalDistance?: number;
}

export interface Driver {
  id: number;
  name: string;
  status: 'On Trip' | 'Available' | 'Off Duty' | 'On Leave';
  vehicle: string;
  rating: number;
  trips: number;
  phone?: string;
  license?: string;
}

export interface StatMetric {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  period: string;
  iconName: string;
}

export interface ChartDataPoint {
  time: string;
  completed: number;
  scheduled: number;
}

export interface LoadingStatus {
  dockId: string;
  percentage: number;
  label: string;
  volume: string;
}

export interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

export interface FleetTypeData {
  type: string;
  count: number;
  active: number;
  capacity: string;
  description: string;
}

export interface AppSettings {
  general: {
    companyName: string;
    address: string;
    contact: string;
    timezone: string;
    tin: string;
  };
  costs: {
    fuelPrice: number;
    perDiem: number;
    autosweepAccount: string;
    easytripAccount: string;
    apiKey: string;
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    maintenanceAlerts: boolean;
    delayAlerts: boolean;
    alertRecipients: string;
  };
}

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'success' | 'info';
  time: string;
  read: boolean;
}