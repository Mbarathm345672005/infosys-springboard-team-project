import { Package, TrendingDown, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import SmartShelfNavbar from './SmartShelfNavbar';
import type { User, InventoryItem } from '../App';

type SmartShelfDashboardProps = {
  user: User;
  inventoryItems: InventoryItem[];
  onNavigate: (page: 'dashboard' | 'inventory' | 'restock' | 'forecast' | 'reports') => void;
  onLogout: () => void;
};

export default function SmartShelfDashboard({ user, inventoryItems, onNavigate, onLogout }: SmartShelfDashboardProps) {
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventoryItems.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = inventoryItems.filter(item => item.status === 'Out of Stock').length;
  const autoRestockEnabled = inventoryItems.filter(item => item.autoRestockEnabled).length;

  const criticalItems = inventoryItems.filter(item => 
    item.status === 'Low Stock' || item.status === 'Out of Stock'
  ).slice(0, 5);

  const recentActivity = [
    { action: 'Auto-restock triggered', item: 'USB-C Cable', time: '2 hours ago', type: 'restock' },
    { action: 'Low stock alert', item: 'Mechanical Keyboard', time: '3 hours ago', type: 'alert' },
    { action: 'Forecast updated', item: 'Wireless Mouse', time: '5 hours ago', type: 'forecast' },
    { action: 'Stock added', item: 'Laptop Stand', time: '1 day ago', type: 'stock' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <SmartShelfNavbar
        user={user}
        currentPage="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl text-slate-900 mb-2">
            Welcome back, {user.fullName.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600">
            {user.companyName} • {user.warehouseLocation}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Total Inventory</CardTitle>
              <Package className="text-blue-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">{totalItems}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <ArrowUpRight size={12} />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow border-yellow-200 bg-yellow-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Low Stock Items</CardTitle>
              <TrendingDown className="text-yellow-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">{lowStockItems}</div>
              <p className="text-xs text-yellow-600">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow border-red-200 bg-red-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Out of Stock</CardTitle>
              <AlertTriangle className="text-red-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">{outOfStockItems}</div>
              <p className="text-xs text-red-600">Immediate action needed</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow border-purple-200 bg-purple-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Auto-Restock Active</CardTitle>
              <Zap className="text-purple-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900 mb-1">{autoRestockEnabled}</div>
              <p className="text-xs text-purple-600">AI-powered monitoring</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Critical Alerts */}
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Critical Inventory Alerts</CardTitle>
                    <CardDescription>Items requiring immediate attention</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('inventory')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalItems.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <TrendingUp className="mx-auto mb-2 text-green-500" size={40} />
                      <p>All inventory levels are healthy!</p>
                    </div>
                  ) : (
                    criticalItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
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
                          <p className="text-sm text-slate-600">SKU: {item.sku} • Category: {item.category}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                              <span>Current: {item.quantity}</span>
                              <span>Min: {item.minStock}</span>
                            </div>
                            <Progress
                              value={(item.quantity / item.minStock) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                        <div className="ml-4">
                          {item.autoRestockEnabled ? (
                            <Badge variant="outline" className="text-purple-600 border-purple-300">
                              <Zap size={12} className="mr-1" />
                              Auto
                            </Badge>
                          ) : (
                            <Button size="sm" variant="outline">
                              Restock
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-md mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                    onClick={() => onNavigate('inventory')}
                  >
                    <Package size={24} className="text-purple-600" />
                    <span className="text-xs">Add Item</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                    onClick={() => onNavigate('restock')}
                  >
                    <TrendingUp size={24} className="text-blue-600" />
                    <span className="text-xs">Restock</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                    onClick={() => onNavigate('forecast')}
                  >
                    <Zap size={24} className="text-yellow-600" />
                    <span className="text-xs">AI Forecast</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                    onClick={() => onNavigate('reports')}
                  >
                    <TrendingUp size={24} className="text-green-600" />
                    <span className="text-xs">Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest inventory updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'restock' ? 'bg-purple-100' :
                      activity.type === 'alert' ? 'bg-red-100' :
                      activity.type === 'forecast' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      {activity.type === 'restock' && <Zap size={16} className="text-purple-600" />}
                      {activity.type === 'alert' && <AlertTriangle size={16} className="text-red-600" />}
                      {activity.type === 'forecast' && <TrendingUp size={16} className="text-blue-600" />}
                      {activity.type === 'stock' && <Package size={16} className="text-green-600" />}
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
            <Card className="shadow-md mt-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-purple-600" size={20} />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-slate-700">
                    📊 Predicted 15% increase in demand for Electronics category next week
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-slate-700">
                    ⚡ Auto-restock will trigger for 3 items in the next 24 hours
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-slate-700">
                    💰 Optimize inventory to save $2,400 this month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
