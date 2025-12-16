import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Activity, ArrowLeft, Brain } from 'lucide-react';
import { User, InventoryItem } from '../App';
import { forecastsAPI } from '../services/api';
import { toast } from 'sonner@2.0.3';

type ForecastData = {
  sku: string;
  productName: string;
  currentStock: number;
  weeklyDemand: number;
  forecastedDemand: number;
  daysUntilStockout: number;
  action: 'Restock Now' | 'Restock Soon' | 'Monitor' | 'Adequate';
  riskLevel: 'High' | 'Medium' | 'Low';
};

type AIForecastPageProps = {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export default function AIForecastPage({ user, onNavigate, onLogout }: AIForecastPageProps) {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchForecasts();
  }, []);

  const fetchForecasts = async () => {
    setIsLoading(true);
    try {
      const data = await forecastsAPI.getAll();
      setForecastData(data);
    } catch (error) {
      toast.error('Failed to load forecasts');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart data for trends
  const trendData = [
    { week: 'Week 1', actual: 120, forecast: 125 },
    { week: 'Week 2', actual: 145, forecast: 140 },
    { week: 'Week 3', actual: 138, forecast: 135 },
    { week: 'Week 4', actual: 165, forecast: 170 },
    { week: 'Week 5', actual: 155, forecast: 160 },
    { week: 'Week 6', actual: 180, forecast: 185 },
    { week: 'Week 7', actual: null, forecast: 195 },
    { week: 'Week 8', actual: null, forecast: 210 },
  ];

  const demandComparisonData = [
    { product: 'Pens', current: 145, forecasted: 180 },
    { product: 'Notebooks', current: 85, forecasted: 110 },
    { product: 'Paper', current: 28, forecasted: 75 },
    { product: 'USB Drives', current: 35, forecasted: 45 },
    { product: 'Ink', current: 8, forecasted: 25 },
  ];

  const highRiskItems = forecastData.filter(item => item.riskLevel === 'High').length;
  const mediumRiskItems = forecastData.filter(item => item.riskLevel === 'Medium').length;
  const lowRiskItems = forecastData.filter(item => item.riskLevel === 'Low').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl text-gray-800">AI Demand Forecasting</h1>
                <p className="text-gray-600">Predictive analytics for inventory planning</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user.fullName} ({user.role})</span>
              <Button onClick={onLogout} variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-red-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">High Risk Items</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{highRiskItems}</div>
              <p className="text-xs text-red-600 mt-1">Need immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Medium Risk Items</CardTitle>
              <Activity className="w-5 h-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{mediumRiskItems}</div>
              <p className="text-xs text-yellow-600 mt-1">Monitor closely</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Low Risk Items</CardTitle>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{lowRiskItems}</div>
              <p className="text-xs text-green-600 mt-1">Stock levels adequate</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">AI Accuracy</CardTitle>
              <Brain className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">94.2%</div>
              <p className="text-xs text-purple-600 mt-1">Prediction accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Demand Forecast Trends</CardTitle>
              <p className="text-sm text-gray-600">8-week prediction vs actual data</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={2} name="Actual Demand" />
                  <Line type="monotone" dataKey="forecast" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" name="Forecasted Demand" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Current vs Forecasted Stock</CardTitle>
              <p className="text-sm text-gray-600">Stock comparison by product category</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demandComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#8b5cf6" name="Current Stock" />
                  <Bar dataKey="forecasted" fill="#ec4899" name="Forecasted Need" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Forecast Prediction Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-800">AI Forecast & Action Recommendations</h2>
            <p className="text-sm text-gray-600 mt-1">Based on historical data analysis & machine learning predictions</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Weekly Demand</TableHead>
                  <TableHead>Forecasted Demand</TableHead>
                  <TableHead>Days Until Stockout</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Recommended Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecastData.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="font-semibold">{item.currentStock}</TableCell>
                    <TableCell>{item.weeklyDemand}</TableCell>
                    <TableCell className="font-semibold text-purple-600">{item.forecastedDemand}</TableCell>
                    <TableCell>
                      <span className={item.daysUntilStockout <= 10 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                        {item.daysUntilStockout} days
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        item.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                        item.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {item.riskLevel === 'High' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {item.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        item.action === 'Restock Now' ? 'bg-red-600 text-white' :
                        item.action === 'Restock Soon' ? 'bg-yellow-600 text-white' :
                        'bg-green-600 text-white'
                      }>
                        {item.action}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
