import { LayoutDashboard, Package, TrendingUp, Zap, BarChart3, Settings, LogOut, FileText, ShoppingCart, Bell, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { User } from '../App';

type AppSidebarProps = {
  user: User;
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'inventory' | 'transactions' | 'forecast' | 'restock' | 'alerts' | 'analytics') => void;
  onLogout: () => void;
};

export default function AppSidebar({ user, currentPage, onNavigate, onLogout }: AppSidebarProps) {
  // Show inventory only for admin and warehouse manager
  const isAdminOrManager = user.role === 'Admin' || user.role === 'Warehouse Manager' || user.role === 'admin' || user.role === 'warehouse-manager';
  
  const menuItems = [
    { 
      id: 'dashboard', 
      label: isAdminOrManager ? 'Dashboard' : 'Shop', 
      icon: isAdminOrManager ? LayoutDashboard : ShoppingCart 
    },
    ...(isAdminOrManager ? [
      { id: 'inventory', label: 'Inventory Management', icon: Package },
      { id: 'transactions', label: 'Stock Transactions', icon: Activity },
      { id: 'forecast', label: 'AI Demand Forecast', icon: TrendingUp },
      { id: 'restock', label: 'Auto Restock & PO', icon: Zap },
      { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
      { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    ] : []),
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="text-white" size={20} />
          </div>
          <div>
            <div className="text-lg text-slate-900">SmartShelfX</div>
            <div className="text-xs text-purple-600">{isAdminOrManager ? 'AI Inventory' : 'Office Supplies'}</div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white">
              {user.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-900 truncate">{user.fullName}</div>
            <div className="text-xs text-slate-600 truncate">{user.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <Settings size={20} className="mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}