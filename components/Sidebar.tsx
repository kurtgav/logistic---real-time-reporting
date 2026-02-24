import React, { useState } from 'react';
import { Icon } from './Icon';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onSearch?: (query: string) => void;
  onViewDiagnostics?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, currentView, onNavigate, onSearch, onViewDiagnostics }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Vehicles & Assets']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSubMenu = (name: string) => {
    if (expandedMenus.includes(name)) {
      setExpandedMenus(expandedMenus.filter(item => item !== name));
    } else {
      setExpandedMenus([...expandedMenus, name]);
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && onSearch) {
          onSearch(searchQuery);
          setSearchQuery('');
          // If mobile, close sidebar
          if (window.innerWidth < 1024) toggleSidebar();
      }
  };

  const menuItems = [
    { id: 'dashboard', name: 'Fleet Overview', icon: 'LayoutDashboard' },
    { 
      id: 'vehicles', 
      name: 'Vehicles & Assets', 
      icon: 'Truck', 
      subItems: [
        { id: 'vehicles', name: 'All Vehicles' }, 
        { id: 'maintenance', name: 'Maintenance Schedule' },
        { id: 'telematics', name: 'Fuel & Telematics' }
      ] 
    },
    { id: 'moves', name: 'Active Moves', icon: 'Package' },
    { id: 'dispatch', name: 'Dispatch & Routing', icon: 'Map' },
    { id: 'warehouse', name: 'Warehouse', icon: 'Warehouse' },
    { id: 'reports', name: 'Performance Reports', icon: 'BarChart2' },
  ];

  const handleNavigation = (id: string) => {
    onNavigate(id);
    if (window.innerWidth < 1024) {
       toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0 bg-slate-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white font-bold shadow-lg shadow-blue-900/50">R</div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight block leading-none">RVL Admin</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Workspace</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 shrink-0">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID (e.g. RVL-1005)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          <div className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Operations</div>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentView === item.id || (item.subItems && item.subItems.some(sub => sub.id === currentView));
              const isExpanded = expandedMenus.includes(item.name);

              return (
                <li key={item.id}>
                  <button 
                    onClick={() => {
                        if (item.subItems) {
                            toggleSubMenu(item.name);
                        } else {
                            handleNavigation(item.id);
                        }
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive && !item.subItems
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon} size={18} />
                      <span>{item.name}</span>
                    </div>
                    {item.subItems && (
                       <Icon name={isExpanded ? "ChevronDown" : "ChevronRight"} size={14} className="text-gray-400" />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {item.subItems && isExpanded && (
                    <ul className="mt-1 ml-9 space-y-1 border-l-2 border-gray-100 pl-3">
                      {item.subItems.map(sub => (
                        <li key={sub.id}>
                          <button 
                            onClick={() => handleNavigation(sub.id)}
                            className={`
                                block w-full text-left px-2 py-1.5 text-sm rounded transition-colors
                                ${currentView === sub.id ? 'text-blue-600 bg-blue-50/50 font-medium' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'}
                            `}
                          >
                             <div className="flex justify-between items-center w-full">
                                {sub.name}
                                {sub.name === 'Maintenance Schedule' && <span className="bg-red-100 text-red-600 text-[10px] px-1.5 rounded-full font-bold">1</span>}
                             </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">System</div>
          <ul className="space-y-1">
             <li>
                <button 
                    onClick={() => handleNavigation('drivers')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'drivers' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Icon name="Users" size={18} />
                    <span>Driver Management</span>
                </button>
             </li>
             <li>
                <button 
                    onClick={() => handleNavigation('driver-app')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'driver-app' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Icon name="Navigation" size={18} />
                    <span>Driver App (Sim)</span>
                </button>
             </li>
             <li>
                <button 
                    onClick={() => handleNavigation('support')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'support' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Icon name="Headphones" size={18} />
                    <span>Support</span>
                </button>
             </li>
          </ul>
        </div>

        {/* Bottom Panel */}
        <div className="p-4 border-t border-gray-200 shrink-0">
           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-4">
             <div className="flex justify-between items-start mb-2">
                 <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                    <Icon name="Settings" size={16} />
                 </div>
                 <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                     ONLINE
                 </div>
             </div>
             <h4 className="font-bold text-gray-800 text-sm">Pro Telematics</h4>
             <p className="text-xs text-gray-500 mb-3">All systems operational</p>
             <button 
                onClick={onViewDiagnostics}
                className="w-full bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors"
             >
                View Diagnostics
             </button>
           </div>
           
           <div className="flex items-center justify-between text-gray-500 px-1">
                <button 
                    onClick={() => handleNavigation('settings')}
                    className={`flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-gray-800 ${currentView === 'settings' ? 'text-blue-600' : ''}`}
                >
                    <Icon name="Settings" size={16} />
                    <span>Config</span>
                </button>
                <button 
                    onClick={() => handleNavigation('logout')}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-red-600"
                    title="Log Out"
                >
                    <Icon name="User" size={16} />
                </button>
           </div>
        </div>
      </aside>
    </>
  );
};