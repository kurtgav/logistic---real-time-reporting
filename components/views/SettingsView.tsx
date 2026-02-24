import React, { useState } from 'react';
import { Icon } from '../Icon';
import { AppSettings } from '../../types';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Dispatcher' | 'Maintenance' | 'Driver';
  status: 'Active' | 'Inactive';
}

const initialUsers: User[] = [
  { id: 1, name: 'Sven RVL', email: 'sven@rvlmovers.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Doe', email: 'dispatch@rvlmovers.com', role: 'Dispatcher', status: 'Active' },
  { id: 3, name: 'Mike Mechanic', email: 'motorpool@rvlmovers.com', role: 'Maintenance', status: 'Active' },
];

interface SettingsViewProps {
    settings: AppSettings;
    onUpdate: (newSettings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'notifications' | 'users'>('general');
  const [saveStatus, setSaveStatus] = useState<string>('');

  // -- State: User Management (Local) --
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Dispatcher' });
  const [isAddingUser, setIsAddingUser] = useState(false);

  // -- Handlers --

  const handleSave = (section: string) => {
    setSaveStatus(`Saving ${section}...`);
    setTimeout(() => {
      setSaveStatus('Changes Saved Successfully!');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 800);
  };

  const updateGeneral = (field: keyof AppSettings['general'], value: string) => {
      onUpdate({
          ...settings,
          general: { ...settings.general, [field]: value }
      });
  };

  const updateCosts = (field: keyof AppSettings['costs'], value: any) => {
      onUpdate({
          ...settings,
          costs: { ...settings.costs, [field]: value }
      });
  };

  const updateNotif = (field: keyof AppSettings['notifications'], value: any) => {
      onUpdate({
          ...settings,
          notifications: { ...settings.notifications, [field]: value }
      });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    
    const user: User = {
        id: Date.now(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as any,
        status: 'Active'
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Dispatcher' });
    setIsAddingUser(false);
    handleSave('User List');
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Are you sure you want to remove this user access?')) {
        setUsers(users.filter(u => u.id !== id));
    }
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'general':
            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Icon name="User" size={18} /> Company Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Name</label>
                                <input 
                                    type="text" 
                                    value={settings.general.companyName}
                                    onChange={e => updateGeneral('companyName', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tax ID (TIN)</label>
                                <input 
                                    type="text" 
                                    value={settings.general.tin}
                                    onChange={e => updateGeneral('tin', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Hub Address (HQ)</label>
                                <input 
                                    type="text" 
                                    value={settings.general.address}
                                    onChange={e => updateGeneral('address', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                                <input 
                                    type="text" 
                                    value={settings.general.contact}
                                    onChange={e => updateGeneral('contact', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Timezone</label>
                                <select 
                                    value={settings.general.timezone}
                                    onChange={e => updateGeneral('timezone', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                                >
                                    <option>Asia/Manila (GMT+8)</option>
                                    <option>Asia/Tokyo (GMT+9)</option>
                                    <option>UTC (GMT+0)</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={() => handleSave('General Settings')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Icon name="Save" size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            );
        case 'integrations':
            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Icon name="Fuel" size={18} /> Cost Parameters
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Default Fuel Price (PHP/L)</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 font-bold">₱</span>
                                    <input 
                                        type="number" 
                                        value={settings.costs.fuelPrice}
                                        onChange={e => updateCosts('fuelPrice', parseFloat(e.target.value))}
                                        className="w-full bg-transparent text-xl font-bold text-gray-800 outline-none border-b border-gray-300 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Used for estimated trip calculations</p>
                             </div>
                             <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Driver Per Diem (PHP/Day)</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 font-bold">₱</span>
                                    <input 
                                        type="number" 
                                        value={settings.costs.perDiem}
                                        onChange={e => updateCosts('perDiem', parseFloat(e.target.value))}
                                        className="w-full bg-transparent text-xl font-bold text-gray-800 outline-none border-b border-gray-300 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Standard daily allowance per crew member</p>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Icon name="CreditCard" size={18} /> API & Integrations
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">AutoSweep Account Number</label>
                                <input 
                                    type="text" 
                                    value={settings.costs.autosweepAccount}
                                    onChange={e => updateCosts('autosweepAccount', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">EasyTrip Account Number</label>
                                <input 
                                    type="text" 
                                    value={settings.costs.easytripAccount}
                                    onChange={e => updateCosts('easytripAccount', e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Google Maps API Key</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        value={settings.costs.apiKey}
                                        onChange={e => updateCosts('apiKey', e.target.value)}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none pr-10" 
                                    />
                                    <div className="absolute right-3 top-2.5 text-green-500">
                                        <Icon name="CheckCircle" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={() => handleSave('Integrations')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Icon name="Save" size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            );
        case 'notifications':
            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Icon name="Bell" size={18} /> Notification Rules
                        </h3>
                        
                        <div className="space-y-4">
                             {[
                                 { key: 'emailAlerts', label: 'Email Notifications', desc: 'Receive critical alerts via email' },
                                 { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Receive urgent alerts via SMS to registered mobile' },
                                 { key: 'maintenanceAlerts', label: 'Maintenance Reminders', desc: 'Notify when vehicles are due for service' },
                                 { key: 'delayAlerts', label: 'Trip Delay Alerts', desc: 'Notify when a trip exceeds ETA by >30 mins' },
                             ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => updateNotif(item.key as any, !settings.notifications[item.key as keyof AppSettings['notifications']])}>
                                    <div>
                                        <div className="font-bold text-gray-700 text-sm">{item.label}</div>
                                        <div className="text-xs text-gray-500">{item.desc}</div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings.notifications[item.key as keyof AppSettings['notifications']] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${settings.notifications[item.key as keyof AppSettings['notifications']] ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                    </div>
                                </div>
                             ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alert Recipients (Comma Separated)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={settings.notifications.alertRecipients}
                                    onChange={e => updateNotif('alertRecipients', e.target.value)}
                                    className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                                <button 
                                    onClick={() => handleSave('Notifications')}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'users':
            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Icon name="Users" size={18} /> User Management
                            </h3>
                            <button 
                                onClick={() => setIsAddingUser(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700"
                            >
                                <Icon name="Plus" size={16} /> Add User
                            </button>
                        </div>

                        {isAddingUser && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
                                <h4 className="text-sm font-bold text-blue-800 mb-3">Add New User</h4>
                                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                    <div className="md:col-span-1">
                                        <label className="block text-xs text-blue-600 font-semibold mb-1">Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={newUser.name}
                                            onChange={e => setNewUser({...newUser, name: e.target.value})}
                                            className="w-full p-2 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-xs text-blue-600 font-semibold mb-1">Email</label>
                                        <input 
                                            required
                                            type="email" 
                                            value={newUser.email}
                                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                                            className="w-full p-2 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-xs text-blue-600 font-semibold mb-1">Role</label>
                                        <select 
                                            value={newUser.role}
                                            onChange={e => setNewUser({...newUser, role: e.target.value})}
                                            className="w-full p-2 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Dispatcher">Dispatcher</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Driver">Driver</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setIsAddingUser(false)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm">Save</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="overflow-hidden rounded-lg border border-gray-100">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-bold text-gray-800">{user.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                    user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'Dispatcher' ? 'bg-blue-100 text-blue-700' :
                                                    user.role === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                    title="Remove User"
                                                >
                                                    <Icon name="Trash2" size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        default: return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">System Configuration</h2>
           <p className="text-sm text-gray-500">Manage global settings, integrations, and user permissions</p>
        </div>
        {saveStatus && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-fade-in">
                <Icon name="CheckCircle" size={16} /> {saveStatus}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="space-y-2 lg:col-span-1">
              {[
                  { id: 'general', label: 'General Settings', icon: 'Settings' },
                  { id: 'integrations', label: 'Fuel & Integrations', icon: 'Fuel' },
                  { id: 'notifications', label: 'Notification Rules', icon: 'Bell' },
                  { id: 'users', label: 'User Management', icon: 'Users' },
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                        w-full text-left px-4 py-3 rounded-xl font-bold flex items-center justify-between transition-all
                        ${activeTab === tab.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                      <div className="flex items-center gap-3">
                          <Icon name={tab.icon} size={18} />
                          <span>{tab.label}</span>
                      </div>
                      {activeTab === tab.id && <Icon name="ChevronRight" size={16} />}
                  </button>
              ))}
          </div>

          {/* Settings Content Area */}
          <div className="lg:col-span-3">
              {renderContent()}
          </div>
      </div>
    </div>
  );
};