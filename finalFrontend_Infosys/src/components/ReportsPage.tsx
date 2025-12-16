import { Download, TrendingUp, Package, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import SmartShelfNavbar from './SmartShelfNavbar';
import type { User, InventoryItem } from '../App';
import { toast } from 'sonner@2.0.3';

type ReportsPageProps = {
  user: User;
  inventoryItems: InventoryItem[];
  onNavigate: (page: 'dashboard' | 'inventory' | 'restock' | 'forecast' | 'reports') => void;
  onLogout: () => void;
};

export default function ReportsPage({ user, inventoryItems, onNavigate, onLogout }: ReportsPageProps) {
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const categoryBreakdown = inventoryItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExportReport = (type: string) => {
    toast.success(`${type} report exported successfully!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <SmartShelfNavbar
        user={user}
        currentPage="reports"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-slate-900 mb-2">Reports & Analytics</h1>
            <p className="text-slate-600">Comprehensive inventory insights and reports</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-600">
            <Download size={18} className="mr-2" />
            Export All
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Total Inventory Value</CardTitle>
              <DollarSign className="text-green-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Total Units</CardTitle>
              <Package className="text-blue-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">{totalItems}</div>
              <p className="text-xs text-slate-600 mt-1">{inventoryItems.length} unique items</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Avg. Item Value</CardTitle>
              <TrendingUp className="text-purple-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">
                ${(totalValue / totalItems).toFixed(2)}
              </div>
              <p className="text-xs text-slate-600 mt-1">Per unit</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Turnover Rate</CardTitle>
              <Calendar className="text-orange-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">4.2x</div>
              <p className="text-xs text-slate-600 mt-1">Annual rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Distribution of items across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryBreakdown).map(([category, count]) => {
                const percentage = (count / inventoryItems.length) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-900">{category}</span>
                      <span className="text-slate-600">{count} items ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stock Status Overview */}
        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle>Stock Status Overview</CardTitle>
            <CardDescription>Current inventory health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['In Stock', 'Low Stock', 'Out of Stock', 'Overstocked'].map((status) => {
                const count = inventoryItems.filter(item => item.status === status).length;
                const color =
                  status === 'In Stock' ? 'bg-green-500' :
                  status === 'Low Stock' ? 'bg-yellow-500' :
                  status === 'Out of Stock' ? 'bg-red-500' :
                  'bg-blue-500';

                return (
                  <div key={status} className="p-4 bg-slate-50 rounded-lg text-center">
                    <Badge variant="secondary" className={`${color} mb-2`}>
                      {status}
                    </Badge>
                    <div className="text-2xl text-slate-900">{count}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {((count / inventoryItems.length) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Highest Value Items</CardTitle>
                  <CardDescription>By total inventory value</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport('Value')}
                >
                  <Download size={14} className="mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...inventoryItems]
                  .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm text-purple-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-600">{item.quantity} units</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-600">${item.price}/unit</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <CardDescription>Items requiring attention</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport('Low Stock')}
                >
                  <Download size={14} className="mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventoryItems
                  .filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock')
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={item.status === 'Out of Stock' ? 'destructive' : 'secondary'}
                          className={item.status === 'Low Stock' ? 'bg-yellow-500' : ''}
                        >
                          {item.status === 'Out of Stock' ? 'OUT' : 'LOW'}
                        </Badge>
                        <div>
                          <div className="text-sm text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-600">{item.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-900">{item.quantity} / {item.minStock}</div>
                        <div className="text-xs text-slate-600">Current / Min</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>Download detailed reports in various formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => handleExportReport('Inventory Summary')}
              >
                <Download size={24} className="text-blue-600" />
                <span className="text-xs">Inventory Summary</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => handleExportReport('Stock Movement')}
              >
                <Download size={24} className="text-green-600" />
                <span className="text-xs">Stock Movement</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => handleExportReport('Valuation')}
              >
                <Download size={24} className="text-purple-600" />
                <span className="text-xs">Valuation Report</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => handleExportReport('Forecast')}
              >
                <Download size={24} className="text-orange-600" />
                <span className="text-xs">AI Forecast Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
