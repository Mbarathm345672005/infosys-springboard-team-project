import { Button } from './ui/button';
import { LayoutDashboard, ArrowLeftRight, Receipt, User, BarChart3 } from 'lucide-react';

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'transfer' | 'transactions' | 'profile' | 'analytics') => void;
};

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transfer', label: 'Transfer Funds', icon: ArrowLeftRight },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-md border-r border-slate-200 min-h-[calc(100vh-73px)] shadow-sm">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? 'default' : 'ghost'}
            className={`w-full justify-start gap-3 ${
              currentPage === item.id 
                ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-md' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            onClick={() => onNavigate(item.id as any)}
          >
            <item.icon size={20} />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}