import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { ShoppingCart, FileText, Send, CheckCircle2, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User, InventoryItem } from '../App';
import { restockAPI, purchaseOrdersAPI } from '../services/api';

type RestockSuggestion = {
  id: string;
  sku: string;
  productName: string;
  currentStock: number;
  minStock: number;
  suggestedQuantity: number;
  supplier: string;
  estimatedCost: number;
  priority: 'High' | 'Medium' | 'Low';
  aiConfidence: number;
};

type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplier: string;
  items: string[];
  totalQuantity: number;
  totalCost: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Delivered';
  createdDate: string;
  expectedDelivery: string;
};

type AutoRestockPageProps = {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export default function AutoRestockPage({ user, onNavigate, onLogout }: AutoRestockPageProps) {
  const [suggestions, setSuggestions] = useState<RestockSuggestion[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [suggestionsData, ordersData] = await Promise.all([
        restockAPI.getAll(),
        purchaseOrdersAPI.getAll()
      ]);
      setSuggestions(suggestionsData);
      
      // Parse items from JSON string to array
      const parsedOrders = ordersData.map((order: any) => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      }));
      setPurchaseOrders(parsedOrders);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [poNotes, setPONotes] = useState('');

  const handleGeneratePO = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to include in the purchase order');
      return;
    }

    const selectedSuggestions = suggestions.filter(s => selectedItems.includes(s.id));
    const supplier = selectedSuggestions[0].supplier;
    
    // Check if all selected items have the same supplier
    if (!selectedSuggestions.every(s => s.supplier === supplier)) {
      toast.error('Please select items from the same supplier');
      return;
    }

    const totalQuantity = selectedSuggestions.reduce((sum, s) => sum + s.suggestedQuantity, 0);
    const totalCost = selectedSuggestions.reduce((sum, s) => sum + s.estimatedCost, 0);

    try {
      await purchaseOrdersAPI.create({
        poNumber: `PO-2025-${String(purchaseOrders.length + 6).padStart(3, '0')}`,
        supplier: supplier,
        items: JSON.stringify(selectedSuggestions.map(s => s.productName)),
        totalQuantity,
        totalCost,
        status: 'DRAFT',
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: poNotes
      });

      setSelectedItems([]);
      setIsPODialogOpen(false);
      toast.success('Purchase order generated successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to create purchase order');
      console.error(error);
    }
  };

  const handleSendPO = async (poId: string) => {
    try {
      await purchaseOrdersAPI.updateStatus(poId, 'SENT');
      setPurchaseOrders(purchaseOrders.map(po => 
        po.id === poId ? { ...po, status: 'Sent' } : po
      ));
      toast.success('Purchase order sent to supplier with email notification!');
    } catch (error) {
      toast.error('Failed to send purchase order');
      console.error(error);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalSuggestedCost = suggestions.reduce((sum, s) => sum + s.estimatedCost, 0);
  const highPriorityCount = suggestions.filter(s => s.priority === 'High').length;

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
                <h1 className="text-2xl text-gray-800">Auto Restock & Purchase Orders</h1>
                <p className="text-gray-600">AI-powered restock recommendations & PO management</p>
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
              <CardTitle className="text-sm text-gray-600">High Priority Items</CardTitle>
              <ShoppingCart className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{highPriorityCount}</div>
              <p className="text-xs text-red-600 mt-1">Require immediate restock</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Total Suggested Cost</CardTitle>
              <FileText className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">₹{totalSuggestedCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-purple-600 mt-1">For all recommendations</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Active POs</CardTitle>
              <Clock className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{purchaseOrders.length}</div>
              <p className="text-xs text-blue-600 mt-1">Purchase orders in system</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Restock Suggestions */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Restock Suggestions
              </h2>
              <p className="text-sm text-gray-600 mt-1">Machine learning powered recommendations based on demand forecasting</p>
            </div>
            <Dialog open={isPODialogOpen} onOpenChange={setIsPODialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Purchase Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Purchase Order</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Selected Items ({selectedItems.length})</Label>
                    <div className="text-sm text-gray-600">
                      {selectedItems.length === 0 
                        ? 'No items selected. Select items from the table below.'
                        : suggestions.filter(s => selectedItems.includes(s.id)).map(s => s.productName).join(', ')
                      }
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={poNotes}
                      onChange={(e) => setPONotes(e.target.value)}
                      placeholder="Add any special instructions or notes..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsPODialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleGeneratePO}
                      className="bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                    >
                      Generate PO
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Suggested Qty</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Est. Cost (₹)</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>AI Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((item) => (
                  <TableRow key={item.id} className={selectedItems.includes(item.id) ? 'bg-purple-50' : ''}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-red-600 font-semibold">{item.currentStock}</TableCell>
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell className="font-semibold text-green-600">{item.suggestedQuantity}</TableCell>
                    <TableCell className="text-gray-600">{item.supplier}</TableCell>
                    <TableCell className="font-semibold">₹{item.estimatedCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge className={
                        item.priority === 'High' ? 'bg-red-100 text-red-700' :
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-700">
                        {item.aiConfidence}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Purchase Orders */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-800">Purchase Orders</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and track purchase orders to suppliers</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Qty</TableHead>
                  <TableHead>Total Cost (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono font-semibold">{po.poNumber}</TableCell>
                    <TableCell className="font-medium">{po.supplier}</TableCell>
                    <TableCell>
                      <div className="text-sm">{po.items.join(', ')}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{po.totalQuantity}</TableCell>
                    <TableCell className="font-semibold">₹{po.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge className={
                        po.status.toUpperCase() === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                        po.status.toUpperCase() === 'SENT' ? 'bg-blue-100 text-blue-700' :
                        po.status.toUpperCase() === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }>
                        {po.status.toUpperCase() === 'SENT' && <Send className="w-3 h-3 mr-1" />}
                        {po.status.toUpperCase() === 'APPROVED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{po.createdDate}</TableCell>
                    <TableCell>{po.expectedDelivery}</TableCell>
                    <TableCell>
                      {po.status.toUpperCase() === 'DRAFT' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSendPO(po.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Send to Supplier
                        </Button>
                      )}
                      {po.status.toUpperCase() === 'SENT' && (
                        <span className="text-sm text-gray-500">Awaiting response</span>
                      )}
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
