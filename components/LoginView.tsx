import React, { useState } from 'react';
import { Icon } from './Icon';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@rvlmovers.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in">
        <div className="p-8 pb-6 text-center">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-500/30 mx-auto mb-6">
              R
           </div>
           <h1 className="text-2xl font-bold text-gray-800">RVL Fleet Command</h1>
           <p className="text-sm text-gray-500 mt-2">Sign in to access real-time logistics dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-5">
           <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                 <Icon name="User" size={18} className="absolute left-3 top-3 text-gray-400" />
                 <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="name@company.com"
                 />
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
              <div className="relative">
                 <Icon name="Settings" size={18} className="absolute left-3 top-3 text-gray-400" />
                 <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="••••••••"
                 />
              </div>
           </div>

           <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
              </label>
              <a href="#" className="text-blue-600 font-semibold hover:underline">Forgot password?</a>
           </div>

           <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
           >
              {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </>
              ) : (
                  <>Sign In <Icon name="ChevronRight" size={16} /></>
              )}
           </button>
        </form>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
                Protected by RVL Security Systems • <span className="text-blue-600 font-semibold cursor-pointer">Help Center</span>
            </p>
        </div>
      </div>
    </div>
  );
};