import { Zap, TrendingUp, Package, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import SmartShelfNavbar from './SmartShelfNavbar';
import type { User, InventoryItem } from '../App';
import { toast } from 'sonner@2.0.3';

type RestockPageProps = {
  user: User;
  inventoryItems: InventoryItem[];
  onNavigate: (page: 'dashboard' | 'inventory' | 'restock' | 'forecast' | 'reports') => void;
  onLogout: () => void;
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
};

export default function RestockPage({ user, inventoryItems, onNavigate, onLogout, onUpdateItem }: RestockPageProps) {
  const restockNeeded = inventoryItems.filter(
    item => item.status === 'Low Stock' || item.status === 'Out of Stock'
  );

  const handleToggleAutoRestock = (id: string, enabled: boolean) => {
    onUpdateItem(id, { autoRestockEnabled: enabled });
    toast.success(enabled ? 'Auto-restock enabled' : 'Auto-restock disabled');
  };

  const handleManualRestock = (item: InventoryItem) => {
    const restockAmount = item.maxStock - item.quantity;
    onUpdateItem(item.id, {
      quantity: item.maxStock,
      status: 'In Stock',
      lastRestocked: new Date().toISOString().split('T')[0],
    });
    toast.success(`Restocked ${item.name} (+${restockAmount} units)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <SmartShelfNavbar
        user={user}
        currentPage="restock"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-slate-900 mb-2">Auto Restock Management</h1>
          <p className="text-slate-600">AI-powered automatic restocking system</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Items Needing Restock</CardTitle>
              <Package className="text-purple-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">{restockNeeded.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Auto-Restock Enabled</CardTitle>
              <Zap className="text-yellow-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">
                {inventoryItems.filter(i => i.autoRestockEnabled).length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Estimated Savings</CardTitle>
              <TrendingUp className="text-green-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">$2,400</div>
            </CardContent>
          </Card>
        </div>

        {/* Restock Needed */}
        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle>Items Requiring Restock</CardTitle>
            <CardDescription>Products below minimum stock level</CardDescription>
          </CardHeader>
          <CardContent>
            {restockNeeded.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto mb-3 text-green-500" size={48} />
                <h3 className="text-lg text-slate-900 mb-1">All stock levels are healthy!</h3>
                <p className="text-slate-600">No items require restocking at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {restockNeeded.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg text-slate-900">{item.name}</h3>
                          <Badge
                            variant={item.status === 'Out of Stock' ? 'destructive' : 'secondary'}
                            className={item.status === 'Low Stock' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                          >
                            {item.status}
                          </Badge>
                          {item.autoRestockEnabled && (
                            <Badge variant="outline" className="text-purple-600 border-purple-300">
                              <Zap size={12} className="mr-1" />
                              Auto-Restock ON
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-slate-500">Current Stock</div>
                            <div className="text-sm text-slate-900">{item.quantity} units</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Minimum Stock</div>
                            <div className="text-sm text-slate-900">{item.minStock} units</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Suggested Restock</div>
                            <div className="text-sm text-purple-600">
                              {item.maxStock - item.quantity} units
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Supplier</div>
                            <div className="text-sm text-slate-900">{item.supplier}</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                            <span>Stock Level</span>
                            <span>{Math.round((item.quantity / item.maxStock) * 100)}%</span>
                          </div>
                          <Progress
                            value={(item.quantity / item.maxStock) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            onClick={() => handleManualRestock(item)}
                            className="bg-gradient-to-r from-purple-500 to-blue-600"
                          >
                            Restock Now
                          </Button>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={item.autoRestockEnabled}
                              onCheckedChange={(checked) => handleToggleAutoRestock(item.id, checked)}
                            />
                            <span className="text-sm text-slate-600">Auto-Restock</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Items Auto-Restock Settings */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>All Items - Auto-Restock Settings</CardTitle>
            <CardDescription>Enable or disable auto-restock for each item</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Package size={20} className="text-slate-400" />
                    <div>
                      <div className="text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">
                        SKU: {item.sku} • Current: {item.quantity} units
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={
                      item.status === 'In Stock' ? 'bg-green-500' :
                      item.status === 'Low Stock' ? 'bg-yellow-500' :
                      item.status === 'Out of Stock' ? 'bg-red-500' :
                      'bg-blue-500'
                    }>
                      {item.status}
                    </Badge>
                    <Switch
                      checked={item.autoRestockEnabled}
                      onCheckedChange={(checked) => handleToggleAutoRestock(item.id, checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
