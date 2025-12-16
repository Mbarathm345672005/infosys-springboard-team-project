import { TrendingUp, Zap, BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import SmartShelfNavbar from './SmartShelfNavbar';
import type { User, InventoryItem } from '../App';

type ForecastPageProps = {
  user: User;
  inventoryItems: InventoryItem[];
  onNavigate: (page: 'dashboard' | 'inventory' | 'restock' | 'forecast' | 'reports') => void;
  onLogout: () => void;
};

export default function ForecastPage({ user, inventoryItems, onNavigate, onLogout }: ForecastPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <SmartShelfNavbar
        user={user}
        currentPage="forecast"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-slate-900 mb-2 flex items-center gap-2">
            <Zap className="text-purple-600" size={32} />
            AI Demand Forecast
          </h1>
          <p className="text-slate-600">Machine learning predictions for inventory demand</p>
        </div>

        {/* AI Insights Banner */}
        <Card className="shadow-md mb-8 bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Predictions</CardTitle>
            <CardDescription className="text-blue-100">
              Our AI analyzes historical data, seasonal trends, and market patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-1">92%</div>
                <div className="text-sm text-blue-100">Prediction Accuracy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-1">7 Days</div>
                <div className="text-sm text-blue-100">Forecast Window</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-1">$2.4K</div>
                <div className="text-sm text-blue-100">Projected Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Data */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Demand Forecast - Next 7 Days</CardTitle>
            <CardDescription>Predicted demand for each inventory item</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems.map((item) => {
                const forecastDemand = item.forecastDemand || 0;
                const currentStock = item.quantity;
                const stockGap = forecastDemand - currentStock;
                const needsRestock = stockGap > 0;

                return (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg text-slate-900">{item.name}</h3>
                          {needsRestock && (
                            <Badge variant="secondary" className="bg-orange-500">
                              Action Needed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {item.category} • {item.sku}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        <BarChart3 size={12} className="mr-1" />
                        AI Forecast
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-slate-500">Current Stock</div>
                        <div className="text-lg text-slate-900">{currentStock}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Predicted Demand</div>
                        <div className="text-lg text-purple-600">{forecastDemand}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Stock Gap</div>
                        <div className={`text-lg ${needsRestock ? 'text-red-600' : 'text-green-600'}`}>
                          {stockGap > 0 ? `+${stockGap}` : stockGap}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Confidence</div>
                        <div className="text-lg text-slate-900">
                          {Math.round(85 + Math.random() * 10)}%
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Demand Coverage</span>
                        <span>{Math.round((currentStock / forecastDemand) * 100)}%</span>
                      </div>
                      <Progress
                        value={Math.min((currentStock / forecastDemand) * 100, 100)}
                        className="h-2"
                      />
                    </div>

                    {needsRestock && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="text-orange-600 flex-shrink-0 mt-0.5" size={16} />
                          <div>
                            <div className="text-sm text-slate-900">
                              Recommendation: Restock {stockGap} units
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              Predicted to sell out in {Math.max(1, Math.round((currentStock / forecastDemand) * 7))} days
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trend Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                Seasonal Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-slate-900 mb-1">Electronics Surge Expected</div>
                <div className="text-xs text-slate-600">
                  15% increase predicted for next week based on historical patterns
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-slate-900 mb-1">Accessories Stable Demand</div>
                <div className="text-xs text-slate-600">
                  Consistent demand expected with minimal fluctuation
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-slate-900 mb-1">Furniture Category Growth</div>
                <div className="text-xs text-slate-600">
                  8% upward trend detected over the past month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} className="text-yellow-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-sm text-slate-900 mb-1">⚡ Priority Action</div>
                <div className="text-xs text-slate-600">
                  Restock USB-C Cable immediately - predicted stockout in 2 days
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-slate-900 mb-1">📊 Optimize Stock</div>
                <div className="text-xs text-slate-600">
                  Reduce Laptop Stand inventory by 20% to minimize holding costs
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-slate-900 mb-1">💡 Cost Savings</div>
                <div className="text-xs text-slate-600">
                  Enable auto-restock on Webcam HD to save $320/month
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
