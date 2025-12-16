import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, DollarSign, Download, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User } from '../App';

type AnalyticsDashboardPageProps = {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export default function AnalyticsDashboardPage({ user, onNavigate, onLogout }: AnalyticsDashboardPageProps) {
  const [timeRange, setTimeRange] = useState('30days');

  // Inventory by category - Pie Chart
  const inventoryByCategoryData = [
    { name: 'Writing Instruments', value: 430, color: '#8b5cf6' },
    { name: 'Paper Products', value: 263, color: '#ec4899' },
    { name: 'Office Supplies', value: 377, color: '#3b82f6' },
    { name: 'Filing & Organization', value: 275, color: '#10b981' },
    { name: 'Computer Accessories', value: 43, color: '#f59e0b' },
    { name: 'Art & Craft', value: 55, color: '#ef4444' },
  ];

  // Monthly comparison - Bar Chart
  const monthlyComparisonData = [
    { month: 'Aug', purchases: 1200, sales: 980 },
    { month: 'Sep', purchases: 1450, sales: 1100 },
    { month: 'Oct', purchases: 1100, sales: 1250 },
    { month: 'Nov', purchases: 1600, sales: 1380 },
    { month: 'Dec', purchases: 1800, sales: 1520 },
    { month: 'Jan', purchases: 1350, sales: 1450 },
  ];

  // Restock vs Demand - Line Chart
  const restockVsDemandData = [
    { week: 'W1', restock: 200, demand: 180 },
    { week: 'W2', restock: 150, demand: 190 },
    { week: 'W3', restock: 250, demand: 220 },
    { week: 'W4', restock: 180, demand: 195 },
    { week: 'W5', restock: 300, demand: 280 },
    { week: 'W6', restock: 220, demand: 240 },
  ];

  // Top restocked items
  const topRestockedItems = [
    { rank: 1, sku: 'BP-001-BL', name: 'Ballpoint Pen Blue', quantity: 800, times: 12 },
    { rank: 2, sku: 'SP-009-10', name: 'Stapler Pins No.10', quantity: 1200, times: 10 },
    { rank: 3, sku: 'NB-005-RL', name: 'Notebook Ruled', quantity: 450, times: 9 },
    { rank: 4, sku: 'A4-006-80', name: 'A4 Paper Pack', quantity: 600, times: 8 },
    { rank: 5, sku: 'SN-007-33', name: 'Sticky Notes 3x3', quantity: 520, times: 7 },
  ];

  // Stock movement trend
  const stockMovementData = [
    { date: 'Jan 18', stockIn: 120, stockOut: 85 },
    { date: 'Jan 19', stockIn: 95, stockOut: 110 },
    { date: 'Jan 20', stockIn: 200, stockOut: 95 },
    { date: 'Jan 21', stockIn: 80, stockOut: 130 },
    { date: 'Jan 22', stockIn: 150, stockOut: 105 },
    { date: 'Jan 23', stockIn: 110, stockOut: 120 },
    { date: 'Jan 24', stockIn: 90, stockOut: 95 },
  ];

  const handleExportExcel = () => {
    toast.success('Exporting analytics data to Excel...');
  };

  const handleExportPDF = () => {
    toast.success('Generating PDF report...');
  };

  const totalInventoryValue = 125840;
  const totalSalesThisMonth = 43520;
  const totalPurchasesThisMonth = 38900;
  const inventoryTurnoverRate = 4.2;

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
                <h1 className="text-2xl text-gray-800">Analytics Dashboard & Reports</h1>
                <p className="text-gray-600">Comprehensive insights and data visualization</p>
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
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={handleExportExcel}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button 
                onClick={handleExportPDF}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Total Inventory Value</CardTitle>
              <Package className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">₹{totalInventoryValue.toLocaleString('en-IN')}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Sales This Month</CardTitle>
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">₹{totalSalesThisMonth.toLocaleString('en-IN')}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Purchases This Month</CardTitle>
              <DollarSign className="w-5 h-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">₹{totalPurchasesThisMonth.toLocaleString('en-IN')}</div>
              <p className="text-xs text-gray-600 mt-1">1,350 units received</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Turnover Rate</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{inventoryTurnoverRate}x</div>
              <p className="text-xs text-green-600 mt-1">Healthy turnover ratio</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Inventory Distribution by Category</CardTitle>
              <p className="text-sm text-gray-600">Current stock breakdown</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={inventoryByCategoryData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {inventoryByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={50}
                    wrapperStyle={{
                      fontSize: '14px',
                      paddingTop: '0px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Monthly Purchase vs Sales Comparison</CardTitle>
              <p className="text-sm text-gray-600">Last 6 months trend</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="purchases" fill="#8b5cf6" name="Purchases (₹)" />
                  <Bar dataKey="sales" fill="#ec4899" name="Sales (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Restock vs Demand Analysis</CardTitle>
              <p className="text-sm text-gray-600">Weekly comparison for optimization</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={restockVsDemandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="restock" stroke="#8b5cf6" strokeWidth={2} name="Restocked Units" />
                  <Line type="monotone" dataKey="demand" stroke="#ec4899" strokeWidth={2} name="Actual Demand" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Stock Movement Trend</CardTitle>
              <p className="text-sm text-gray-600">Daily stock-in vs stock-out</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockMovementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stockIn" stroke="#10b981" strokeWidth={2} name="Stock-In" />
                  <Line type="monotone" dataKey="stockOut" stroke="#ef4444" strokeWidth={2} name="Stock-Out" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Restocked Items Table */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Top Restocked Items</CardTitle>
            <p className="text-sm text-gray-600">Most frequently restocked products this period</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600">Rank</th>
                    <th className="text-left py-3 px-4 text-gray-600">SKU</th>
                    <th className="text-left py-3 px-4 text-gray-600">Product Name</th>
                    <th className="text-right py-3 px-4 text-gray-600">Total Quantity</th>
                    <th className="text-right py-3 px-4 text-gray-600">Restock Times</th>
                  </tr>
                </thead>
                <tbody>
                  {topRestockedItems.map((item) => (
                    <tr key={item.rank} className="border-b border-gray-100 hover:bg-purple-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                          {item.rank}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-gray-600">{item.sku}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-800">{item.quantity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-purple-600 font-semibold">{item.times}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}