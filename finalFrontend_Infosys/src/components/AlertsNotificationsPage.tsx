import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bell, AlertTriangle, Info, CheckCircle, X, Clock, Package, TrendingDown, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User } from '../App';
import { alertsAPI } from '../services/api';

type Alert = {
  id: string;
  type: 'Low Stock' | 'Out of Stock' | 'Expiry Warning' | 'Vendor Response' | 'Restock Required' | 'System';
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  message: string;
  productSKU?: string;
  timestamp: string;
  isRead: boolean;
  isDismissed: boolean;
};

type AlertsNotificationsPageProps = {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export default function AlertsNotificationsPage({ user, onNavigate, onLogout }: AlertsNotificationsPageProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await alertsAPI.getAll();
      // Normalize type enum values to display names and severity to capitalized
      const normalizedAlerts = data.map((alert: any) => ({
        ...alert,
        type: alert.type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || alert.type,
        severity: alert.severity?.charAt(0) + alert.severity?.slice(1).toLowerCase() || alert.severity
      }));
      setAlerts(normalizedAlerts);
    } catch (error) {
      toast.error('Failed to load alerts');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [filterType, setFilterType] = useState<'all' | Alert['type']>('all');
  const [showDismissed, setShowDismissed] = useState(false);

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await alertsAPI.markAsRead(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
      toast.success('Alert marked as read');
    } catch (error) {
      toast.error('Failed to mark alert as read');
      console.error(error);
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      await alertsAPI.dismiss(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, isDismissed: true } : alert
      ));
      toast.success('Alert dismissed');
    } catch (error) {
      toast.error('Failed to dismiss alert');
      console.error(error);
    }
  };

  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
    toast.success('All alerts marked as read');
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!showDismissed && alert.isDismissed) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead && !a.isDismissed).length;
  const highSeverityCount = alerts.filter(a => a.severity === 'High' && !a.isDismissed).length;
  const criticalAlerts = alerts.filter(a => (a.type === 'Out of Stock' || a.type === 'Low Stock') && !a.isDismissed).length;

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'Out of Stock':
      case 'Low Stock':
        return <Package className="w-5 h-5" />;
      case 'Restock Required':
        return <TrendingDown className="w-5 h-5" />;
      case 'Expiry Warning':
        return <Clock className="w-5 h-5" />;
      case 'Vendor Response':
        return <CheckCircle className="w-5 h-5" />;
      case 'System':
        return <Info className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

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
                <h1 className="text-2xl text-gray-800">Alerts & Notifications</h1>
                <p className="text-gray-600">Monitor system alerts and vendor communications</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-red-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Unread Alerts</CardTitle>
              <Bell className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{unreadCount}</div>
              <p className="text-xs text-red-600 mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">High Severity</CardTitle>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{highSeverityCount}</div>
              <p className="text-xs text-yellow-600 mt-1">Critical issues</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Stock Alerts</CardTitle>
              <Package className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{criticalAlerts}</div>
              <p className="text-xs text-purple-600 mt-1">Low/Out of stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Expiry Warning">Expiry Warning</SelectItem>
                  <SelectItem value="Vendor Response">Vendor Response</SelectItem>
                  <SelectItem value="Restock Required">Restock Required</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSeverity} onValueChange={(value: any) => setFilterSeverity(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showDismissed ? "default" : "outline"}
                onClick={() => setShowDismissed(!showDismissed)}
              >
                {showDismissed ? 'Hide' : 'Show'} Dismissed
              </Button>
            </div>

            <Button 
              onClick={handleMarkAllAsRead}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-800">All Notifications</h2>
            <p className="text-sm text-gray-600 mt-1">Showing {filteredAlerts.length} alert(s)</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-48">Type</TableHead>
                  <TableHead className="w-32">Severity</TableHead>
                  <TableHead className="w-64">Title</TableHead>
                  <TableHead className="w-96">Message</TableHead>
                  <TableHead className="w-32">SKU</TableHead>
                  <TableHead className="w-48">Timestamp</TableHead>
                  <TableHead className="w-48">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow 
                    key={alert.id} 
                    className={`${!alert.isRead ? 'bg-blue-50' : ''} ${alert.isDismissed ? 'opacity-50' : ''}`}
                  >
                    <TableCell>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </TableCell>
                    <TableCell className="w-48">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <span className="text-sm whitespace-nowrap">{alert.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="w-32">
                      <Badge className={
                        alert.severity === 'High' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {alert.severity === 'High' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium w-64">
                      <div className="line-clamp-2">
                        {alert.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 w-96">
                      <div className="line-clamp-2">
                        {alert.message}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm w-32 whitespace-nowrap">
                      {alert.productSKU || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 w-48 whitespace-nowrap">
                      {alert.timestamp}
                    </TableCell>
                    <TableCell className="w-48">
                      <div className="flex items-center gap-2">
                        {!alert.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="whitespace-nowrap"
                          >
                            Mark Read
                          </Button>
                        )}
                        {!alert.isDismissed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismiss(alert.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
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