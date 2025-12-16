import { Button } from './ui/button';
import { Building2, LogOut, User } from 'lucide-react';
import type { User } from '../App';

type NavbarProps = {
  user: User;
  onLogout: () => void;
};

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
            <Building2 className="text-white" size={20} />
          </div>
          <span className="text-slate-900">SmartBank</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center">
              <User className="text-sky-600" size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-900">{user.name}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onLogout}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}