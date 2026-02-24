import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { Vehicle } from '../types';

interface MapWidgetProps {
  vehicles?: Vehicle[];
  apiKey?: string;
}

// --- CONFIGURATION ---

// Real Coordinates for the Philippines (Luzon Focused)
const REAL_LOCATIONS: Record<string, { lat: number, lng: number }> = {
    'Cupang HQ': { lat: 14.4445, lng: 121.0440 },
    'Sta. Rosa Depot': { lat: 14.2938, lng: 121.1036 },
    'Sta. Rosa Motorpool': { lat: 14.2950, lng: 121.1050 },
    'Cavite Hub': { lat: 14.4081, lng: 120.9320 },
    'Batangas Port': { lat: 13.7570, lng: 121.0475 },
    'Batangas (Soro-Soro)': { lat: 13.7800, lng: 121.0600 },
    'Manila North Harbor': { lat: 14.6180, lng: 120.9600 },
    'Parañaque City': { lat: 14.4793, lng: 121.0198 },
    'Cebu Dealership': { lat: 10.3157, lng: 123.8854 },
    'Laguna Technopark': { lat: 14.2423, lng: 121.0624 },
    'Quezon City': { lat: 14.6760, lng: 121.0437 },
    'Makati CBD': { lat: 14.5547, lng: 121.0244 },
    'Nuvali, Laguna': { lat: 14.2329, lng: 121.0620 },
    'Antipolo': { lat: 14.5842, lng: 121.1763 },
    'SM North EDSA': { lat: 14.6560, lng: 121.0280 },
    'Default': { lat: 14.4445, lng: 121.0440 }
};

// SVG Fallback Coordinates (Percentage 0-100)
const SVG_LOCATIONS: Record<string, { x: number, y: number }> = {
    'Cupang HQ': { x: 44, y: 28 },
    'Sta. Rosa Depot': { x: 45, y: 31 },
    'Sta. Rosa Motorpool': { x: 46, y: 31.5 },
    'Cavite Hub': { x: 42, y: 30 },
    'Batangas Port': { x: 46, y: 35 },
    'Batangas (Soro-Soro)': { x: 46, y: 36 },
    'Manila North Harbor': { x: 43, y: 25 },
    'Parañaque City': { x: 43, y: 27 },
    'Cebu Dealership': { x: 60, y: 65 },
    'Laguna Technopark': { x: 45, y: 32 },
    'Quezon City': { x: 44, y: 24 },
    'Makati CBD': { x: 44, y: 26 },
    'Nuvali, Laguna': { x: 45, y: 33 },
    'Antipolo': { x: 46, y: 25 },
    'SM North EDSA': { x: 44, y: 23 },
    'Default': { x: 44, y: 28 }
};

const GEOFENCES = [
    { name: "Metro Manila Zone", x: 44, y: 26, r: 8, color: "rgba(59, 130, 246, 0.1)" },
    { name: "South Luzon Hub", x: 45, y: 33, r: 6, color: "rgba(16, 185, 129, 0.1)" },
    { name: "Visayas Ops", x: 60, y: 65, r: 5, color: "rgba(245, 158, 11, 0.1)" }
];

type FilterCategory = 'Moving' | 'Delayed' | 'Docking' | 'Parked' | 'Service';

export const MapWidget: React.FC<MapWidgetProps> = ({ vehicles = [], apiKey }) => {
  const [activeFilters, setActiveFilters] = useState<FilterCategory[]>(['Moving', 'Delayed']);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  // Fix: Use 'any' to avoid namespace error
  const googleMapInstance = useRef<any>(null);
  // Fix: Use 'any[]' to avoid namespace error
  const markersRef = useRef<any[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // --- FILTERS ---
  const toggleFilter = (category: FilterCategory) => {
      setActiveFilters(prev => 
          prev.includes(category) 
              ? prev.filter(c => c !== category) 
              : [...prev, category]
      );
  };

  const setSingleFilter = (category: FilterCategory) => {
      setActiveFilters([category]);
  }

  const getCategory = (status: Vehicle['status']): FilterCategory => {
      if (status === 'In transit') return 'Moving';
      if (status === 'Delayed') return 'Delayed';
      if (status === 'Loading' || status === 'Unloading') return 'Docking';
      if (status === 'Stationary') return 'Parked';
      if (status === 'Maintenance') return 'Service';
      return 'Parked';
  };

  const filteredVehicles = useMemo(() => {
      return vehicles.filter(v => activeFilters.includes(getCategory(v.status)));
  }, [vehicles, activeFilters]);

  // --- GOOGLE MAPS LOADING LOGIC ---
  useEffect(() => {
      if (!apiKey) return;

      const loadGoogleMaps = () => {
          if (window.google?.maps) {
              setIsGoogleMapsReady(true);
              return;
          }

          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapWidget`;
          script.async = true;
          script.defer = true;
          
          window.initMapWidget = () => {
              setIsGoogleMapsReady(true);
          };
          
          document.head.appendChild(script);
      };

      loadGoogleMaps();
  }, [apiKey]);

  // --- INITIALIZE REAL MAP ---
  useEffect(() => {
      if (isGoogleMapsReady && mapRef.current && !googleMapInstance.current) {
          googleMapInstance.current = new window.google.maps.Map(mapRef.current, {
              center: { lat: 14.3, lng: 121.05 }, // Centered on South Luzon
              zoom: 10,
              styles: [ // Clean custom style
                  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
                  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
              ],
              disableDefaultUI: true,
              zoomControl: true,
          });
      }
  }, [isGoogleMapsReady]);

  // --- UPDATE MARKERS ON REAL MAP ---
  useEffect(() => {
      if (!googleMapInstance.current || !isGoogleMapsReady) return;

      // Clear existing markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      filteredVehicles.forEach(vehicle => {
          const start = REAL_LOCATIONS[vehicle.origin] || REAL_LOCATIONS['Default'];
          
          let position = { ...start };

          // Interpolate if moving
          if ((vehicle.status === 'In transit' || vehicle.status === 'Delayed') && vehicle.destination !== '-') {
              const end = REAL_LOCATIONS[vehicle.destination] || REAL_LOCATIONS['Default'];
              const progress = Math.max(0, Math.min(100, vehicle.progress)) / 100;
              position.lat = start.lat + (end.lat - start.lat) * progress;
              position.lng = start.lng + (end.lng - start.lng) * progress;
          } else if (vehicle.status === 'Unloading') {
              const end = REAL_LOCATIONS[vehicle.destination] || REAL_LOCATIONS['Default'];
              position = { ...end };
          }

          // Add random jitter to prevent perfect overlap at hubs
          const seed = vehicle.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          position.lat += ((seed % 100) - 50) * 0.0001; 
          position.lng += ((seed % 100) - 50) * 0.0001;

          // Determine Marker Color
          let pinColor = '#94a3b8'; // gray
          if (vehicle.status === 'In transit') pinColor = '#22c55e'; // green
          if (vehicle.status === 'Delayed') pinColor = '#ef4444'; // red
          if (vehicle.status === 'Loading') pinColor = '#3b82f6'; // blue
          if (vehicle.status === 'Unloading') pinColor = '#a855f7'; // purple
          if (vehicle.status === 'Maintenance') pinColor = '#f97316'; // orange

          // Simple SVG marker
          const markerIcon = {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: pinColor,
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "white",
              scale: 7,
          };

          const marker = new window.google.maps.Marker({
              position: position,
              map: googleMapInstance.current,
              title: `${vehicle.name} - ${vehicle.status}`,
              icon: markerIcon,
          });

          // Info window on click
          const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
                    <strong style="font-size:14px">${vehicle.name}</strong><br/>
                    <span style="color:${pinColor}; font-weight:bold">${vehicle.status}</span><br/>
                    Driver: ${vehicle.driver}<br/>
                    ETA: ${vehicle.eta}
                </div>
              `
          });

          marker.addListener('click', () => {
              infoWindow.open(googleMapInstance.current, marker);
          });

          markersRef.current.push(marker);
      });

  }, [filteredVehicles, isGoogleMapsReady, vehicles]); // Re-run when vehicle data changes (animation frame)

  // --- SVG POSITION CALCULATOR ---
  const getSVGPosition = (vehicle: Vehicle) => {
      const start = SVG_LOCATIONS[vehicle.origin] || SVG_LOCATIONS['Default'];
      const seed = vehicle.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const jitterX = ((seed % 10) - 5) * 0.3;
      const jitterY = ((seed % 13) - 6) * 0.3;

      if (vehicle.status === 'In transit' || vehicle.status === 'Delayed') {
          const end = SVG_LOCATIONS[vehicle.destination] || SVG_LOCATIONS['Default'];
          if (start === end) return { x: start.x + jitterX, y: start.y + jitterY };

          const progress = Math.max(5, Math.min(95, vehicle.progress)) / 100;
          const x = start.x + (end.x - start.x) * progress;
          const y = start.y + (end.y - start.y) * progress;
          return { x: x + jitterX, y: y + jitterY };
      } 
      else if (vehicle.status === 'Unloading') {
          const end = SVG_LOCATIONS[vehicle.destination] || SVG_LOCATIONS['Default'];
          return { x: end.x + jitterX, y: end.y + jitterY };
      }
      else {
          return { x: start.x + jitterX, y: start.y + jitterY };
      }
  };

  const getMarkerStyle = (status: Vehicle['status']) => {
      switch(status) {
          case 'In transit': return { bg: 'bg-green-500', icon: 'Truck', ring: 'ring-green-200' };
          case 'Delayed': return { bg: 'bg-red-500', icon: 'AlertCircle', ring: 'ring-red-200' };
          case 'Loading': return { bg: 'bg-blue-500', icon: 'Package', ring: 'ring-blue-200' };
          case 'Unloading': return { bg: 'bg-purple-500', icon: 'Package', ring: 'ring-purple-200' };
          case 'Maintenance': return { bg: 'bg-orange-500', icon: 'Wrench', ring: 'ring-orange-200' };
          case 'Stationary': return { bg: 'bg-slate-500', icon: 'MapPin', ring: 'ring-slate-200' };
          default: return { bg: 'bg-gray-400', icon: 'Circle', ring: 'ring-gray-200' };
      }
  };

  const renderSVGMap = () => (
      <div className="absolute inset-0 bg-blue-50/50 overflow-hidden shadow-inner">
        {/* Radar Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-20">
             <div className="w-[800px] h-[800px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-[spin_10s_linear_infinite] rounded-full border border-blue-200/30"></div>
        </div>

        {/* Ocean & Land */}
        <div className="absolute inset-0 bg-[#eff6ff] opacity-60"></div>
        <svg className="w-full h-full absolute inset-0 z-0" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid meet">
             <defs>
                 <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                   <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#94a3b8" floodOpacity="0.5"/>
                 </filter>
             </defs>
             <g filter="url(#shadow)" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1">
                {/* Simplified Abstract Philippines */}
                <path d="M120,50 Q160,30 200,60 T220,150 Q200,200 150,180 T100,100 Z" />
                <path d="M220,150 Q240,180 260,220 L250,250 L200,230 Z" /> 
                <circle cx="180" cy="280" r="12" /> 
                <circle cx="200" cy="280" r="15" /> 
                <path d="M230,260 L250,270 L240,300 L220,280 Z" /> 
                <path d="M260,240 L280,260 L270,290 L250,270 Z" /> 
                <path d="M180,350 Q250,340 300,380 T280,500 Q200,520 160,450 T180,350 Z"/>
                <path d="M80,250 L120,220 L130,230 L90,280 Z" transform="rotate(-15 105 250)"/>
             </g>
        </svg>

        {/* Geofences */}
        {GEOFENCES.map((zone, idx) => (
            <div 
                key={idx}
                className="absolute rounded-full border border-blue-300/30 pointer-events-none z-0"
                style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.r * 2}%`,
                    height: `${zone.r * 2}%`, 
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: zone.color
                }}
            />
        ))}

        {/* Hubs */}
        {Object.entries(SVG_LOCATIONS).slice(0, 5).map(([name, pos]) => (
            <div 
                key={name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/hub cursor-pointer z-10"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
                <div className={`bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow-sm text-[9px] font-bold mb-1 whitespace-nowrap border border-gray-200 transition-opacity ${name.includes('HQ') ? 'opacity-100 text-blue-800' : 'opacity-0 group-hover/hub:opacity-100 text-gray-600'}`}>
                    {name}
                </div>
                <div className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${name.includes('HQ') ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-slate-400'}`}></div>
            </div>
        ))}

        {/* Vehicles */}
        {filteredVehicles.map(vehicle => {
            const pos = getSVGPosition(vehicle);
            const style = getMarkerStyle(vehicle.status);
            return (
                <div 
                    key={vehicle.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/vehicle cursor-pointer z-20 transition-all duration-1000 ease-linear"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                     <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover/vehicle:opacity-100 transition-all transform translate-y-2 group-hover/vehicle:translate-y-0 whitespace-nowrap z-30 pointer-events-none">
                        <div className="font-bold flex items-center gap-1.5 mb-0.5">
                            <Icon name="Truck" size={12} className="text-gray-300"/> 
                            <span className="text-white">{vehicle.name}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-gray-700">
                            <span className={`w-1.5 h-1.5 rounded-full ${style.bg}`}></span>
                            <span className="text-gray-300">{vehicle.status}</span>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                     </div>
                     
                     <div className={`
                        w-6 h-6 rounded-full border-2 shadow-md flex items-center justify-center text-white relative
                        ${style.bg} border-white ring-2 ${style.ring}
                     `}>
                        <Icon name={style.icon} size={12} />
                        {vehicle.fuelLevel < 20 && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></div>
                        )}
                     </div>
                     
                     {(vehicle.status === 'In transit' || vehicle.status === 'Delayed') && (
                         <div className={`absolute inset-0 -m-1 rounded-full border-2 animate-ping opacity-50 ${vehicle.status === 'Delayed' ? 'border-red-500' : 'border-green-500'}`}></div>
                     )}
                </div>
            );
        })}
      </div>
  );

  const handleLocateMe = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const pos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                  };
                  setUserLocation(pos);
                  if (googleMapInstance.current) {
                      googleMapInstance.current.setCenter(pos);
                      googleMapInstance.current.setZoom(14);
                      new window.google.maps.Marker({
                          position: pos,
                          map: googleMapInstance.current,
                          title: "Your Location",
                          icon: {
                              path: window.google.maps.SymbolPath.CIRCLE,
                              fillColor: "#3b82f6",
                              fillOpacity: 1,
                              scale: 8,
                              strokeColor: "white",
                              strokeWeight: 2
                          }
                      });
                  }
              },
              () => alert("Unable to retrieve location.")
          );
      }
  };

  return (
    <div className="bg-white p-0 md:p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col relative overflow-hidden group">
      
      {/* Header & Controls */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-2">
            <h3 className="text-lg font-bold text-gray-800 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm border border-gray-100 inline-block">
                Live Fleet Map
            </h3>
            {isGoogleMapsReady && (
                <button 
                    onClick={handleLocateMe}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-gray-100 text-blue-600 hover:bg-blue-50 transition-colors w-fit"
                    title="Center on my location"
                >
                    <Icon name="Navigation" size={16} />
                </button>
            )}
        </div>
        
        {/* Layer Controls - Right Side */}
        <div className="flex flex-col gap-2 pointer-events-auto items-end">
             <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-md border border-gray-100 flex flex-col gap-1">
                {[
                    { id: 'Moving', color: 'bg-green-500', icon: 'Truck' },
                    { id: 'Delayed', color: 'bg-red-500', icon: 'AlertCircle' },
                    { id: 'Docking', color: 'bg-blue-500', icon: 'Package' },
                    { id: 'Parked', color: 'bg-slate-500', icon: 'MapPin' },
                    { id: 'Service', color: 'bg-orange-500', icon: 'Wrench' },
                ].map((item) => {
                    const isActive = activeFilters.includes(item.id as FilterCategory);
                    const count = vehicles.filter(v => getCategory(v.status) === item.id).length;
                    return (
                        <button
                            key={item.id}
                            onClick={(e) => {
                                if (e.shiftKey) setSingleFilter(item.id as FilterCategory);
                                else toggleFilter(item.id as FilterCategory);
                            }}
                            title={`Toggle ${item.id} (Shift+Click to Isolate)`}
                            className={`
                                flex items-center justify-between w-32 px-2 py-1.5 rounded-md text-xs font-medium transition-all
                                ${isActive ? 'bg-gray-100 text-gray-800' : 'bg-transparent text-gray-400 hover:bg-gray-50'}
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isActive ? item.color : 'bg-gray-300'}`}></span>
                                <span>{item.id}</span>
                            </div>
                            <span className="bg-white border border-gray-200 px-1.5 rounded text-[10px] text-gray-500">{count}</span>
                        </button>
                    );
                })}
             </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 bg-gray-50 overflow-hidden shadow-inner">
          {apiKey && isGoogleMapsReady ? (
              <div ref={mapRef} className="w-full h-full"></div>
          ) : (
              <>
                {renderSVGMap()}
                {!apiKey && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-500 shadow-sm pointer-events-auto">
                            Simulation Mode • Add API Key in Settings for Real Map
                        </div>
                    </div>
                )}
              </>
          )}
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-2 left-4 text-[10px] text-gray-500 pointer-events-none bg-white/50 px-2 py-0.5 rounded backdrop-blur-sm">
          {isGoogleMapsReady ? 'Google Maps • Live Traffic Data' : 'Live Satellite Feed (Simulated)'} • Updated 1s ago
      </div>
    </div>
  );
};

declare global {
    interface Window {
        initMapWidget: () => void;
        google: any;
    }
}