import React from 'react';
import { AppNotification } from '../types';

interface NotificationsPopoverProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkRead: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ notifications, onClose, onMarkRead }) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute top-16 right-4 sm:right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fade-in origin-top-right">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
          <button onClick={onMarkRead} className="text-xs text-blue-600 font-medium hover:underline">Mark all read</button>
        </div>
        <div className="max-h-80 overflow-y-auto">
           {notifications.length === 0 ? (
               <div className="p-6 text-center text-gray-400 text-sm">
                   No new notifications
               </div>
           ) : (
               notifications.map(notif => (
                 <div key={notif.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${notif.read ? 'opacity-60' : ''}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        notif.type === 'alert' ? 'bg-red-500' : 
                        notif.type === 'warning' ? 'bg-orange-500' :
                        notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-800">{notif.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{notif.time}</span>
                    </div>
                 </div>
               ))
           )}
        </div>
        <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
            <button className="text-xs font-medium text-gray-600 hover:text-gray-900">View All Activity</button>
        </div>
      </div>
    </>
  );
};