import { Package, TrendingDown, AlertTriangle, Zap, Plus, ArrowUpRight, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import AppSidebar from './AppSidebar';
import type { User, InventoryItem } from '../App';

type NewDashboardProps = {
  user: User;
  inventoryItems: InventoryItem[];
  onNavigate: (page: 'dashboard' | 'inventory' | 'transactions' | 'forecast' | 'restock' | 'alerts' | 'analytics') => void;
  onLogout: () => void;
};

export default function NewDashboard({ user, inventoryItems, onNavigate, onLogout }: NewDashboardProps) {
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventoryItems.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = inventoryItems.filter(item => item.status === 'Out of Stock').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const criticalItems = inventoryItems
    .filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock')
    .slice(0, 4);

  const recentActivity = [
    { action: 'Auto-restock triggered', item: 'A4 Paper Pack', time: '2 hours ago', type: 'restock' },
    { action: 'Low stock alert', item: 'Ballpoint Pen Blue', time: '3 hours ago', type: 'alert' },
    { action: 'Forecast updated', item: 'Notebook Ruled', time: '5 hours ago', type: 'forecast' },
    { action: 'Stock added', item: 'Stapler Medium', time: '1 day ago', type: 'stock' },
    { action: 'Item updated', item: 'USB Drive 32GB', time: '1 day ago', type: 'update' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-200">
      <AppSidebar
        user={user}
        currentPage="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600">{user.companyName} • {user.warehouseLocation}</p>
            </div>
            <div className="text-sm text-slate-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
            <h2 className="text-3xl mb-2">Welcome back, {user.fullName.split(' ')[0]}! 👋</h2>
            <p className="text-purple-100">Here's what's happening with your inventory today</p>
          </div>

          {/* Inventory Summary Cards */}
          <div className="mb-8">
            <h3 className="text-lg text-slate-900 mb-4">Inventory Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-slate-600">Total Products</CardTitle>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Package className="text-blue-600" size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-slate-900 mb-1">{totalItems}</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-slate-600">Low Stock Items</CardTitle>
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <TrendingDown className="text-orange-600" size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-slate-900 mb-1">{lowStockItems}</div>
                  <p className="text-xs text-orange-600">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-pink-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-slate-600">Out of Stock</CardTitle>
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-pink-200 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-slate-900 mb-1">{outOfStockItems}</div>
                  <p className="text-xs text-red-600">Immediate action needed</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-slate-600">Total Value</CardTitle>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-xl flex items-center justify-center">
                    <Zap className="text-purple-600" size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-slate-900 mb-1">₹{totalValue.toFixed(0)}</div>
                  <p className="text-xs text-purple-600">Inventory worth</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Restock Alerts */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div>
                    <CardTitle>Restock Alerts</CardTitle>
                    <CardDescription>Items requiring immediate attention</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {criticalItems.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <TrendingUp className="mx-auto mb-2 text-green-500" size={40} />
                      <p>All inventory levels are healthy!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {criticalItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-slate-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-slate-900">{item.name}</h3>
                              <Badge
                                variant={item.status === 'Out of Stock' ? 'destructive' : 'secondary'}
                                className={item.status === 'Low Stock' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              Category: {item.category} • Current: {item.quantity} units
                            </p>
                            <Progress value={(item.quantity / item.minStock) * 100} className="h-2" />
                          </div>
                          {item.autoRestockEnabled && (
                            <Badge variant="outline" className="ml-4 text-purple-600 border-purple-300">
                              <Zap size={12} className="mr-1" />
                              Auto
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-md mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col gap-2 border-2 hover:border-purple-300 hover:bg-purple-50"
                      onClick={() => onNavigate('inventory')}
                    >
                      <Plus size={24} className="text-purple-600" />
                      <span className="text-xs">Add Product</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col gap-2 border-2 hover:border-blue-300 hover:bg-blue-50"
                      onClick={() => onNavigate('inventory')}
                    >
                      <Package size={24} className="text-blue-600" />
                      <span className="text-xs">View Inventory</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'restock' ? 'bg-purple-100' :
                        activity.type === 'alert' ? 'bg-red-100' :
                        activity.type === 'forecast' ? 'bg-blue-100' :
                        activity.type === 'update' ? 'bg-indigo-100' :
                        'bg-green-100'
                      }`}>
                        {activity.type === 'restock' && <Zap size={16} className="text-purple-600" />}
                        {activity.type === 'alert' && <AlertTriangle size={16} className="text-red-600" />}
                        {activity.type === 'forecast' && <TrendingUp size={16} className="text-blue-600" />}
                        {activity.type === 'stock' && <Package size={16} className="text-green-600" />}
                        {activity.type === 'update' && <Activity size={16} className="text-indigo-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-900">{activity.action}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{activity.item}</div>
                        <div className="text-xs text-slate-500 mt-1">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="border-0 shadow-md mt-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap size={20} />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <p className="text-sm">
                      📊 15% demand increase predicted for Writing Instruments next week
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <p className="text-sm">
                      ⚡ Auto-restock will trigger for 3 items in the next 24 hours
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <p className="text-sm">
                      💰 Optimize inventory to save $1,200 this month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}