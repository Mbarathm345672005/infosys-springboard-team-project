import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Package, TrendingUp, TrendingDown, Calendar, User as UserIcon, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User, InventoryItem } from '../App';
import { transactionsAPI, inventoryAPI } from '../services/api';

type Transaction = {
  id: string;
  type: 'Stock-In' | 'Stock-Out';
  productName: string;
  sku: string;
  quantity: number;
  handledBy: string;
  timestamp: string;
  reference: string;
  notes: string;
};

type StockTransactionsPageProps = {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export default function StockTransactionsPage({ user, onNavigate, onLogout }: StockTransactionsPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [txns, items] = await Promise.all([
        transactionsAPI.getAll(),
        inventoryAPI.getAll()
      ]);
      setTransactions(txns);
      setInventoryItems(items);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'Stock-In' | 'Stock-Out'>('Stock-In');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Stock-In' | 'Stock-Out'>('all');

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = inventoryItems.find(item => item.sku === selectedProduct);
    if (!product) {
      toast.error('Please select a valid product');
      return;
    }

    try {
      await transactionsAPI.create({
        type: transactionType === 'Stock-In' ? 'STOCK_IN' : 'STOCK_OUT',
        productName: product.name,
        sku: product.sku,
        quantity: parseInt(quantity),
        handledBy: user.fullName,
        reference,
        notes
      });

      toast.success(`${transactionType} transaction recorded successfully!`);
      
      // Reset form
      setSelectedProduct('');
      setQuantity('');
      setReference('');
      setNotes('');
      setIsDialogOpen(false);
      
      // Refresh transactions
      fetchData();
    } catch (error) {
      toast.error('Failed to create transaction');
      console.error(error);
    }
  };

  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(t => {
        // Handle both formats: "STOCK_IN"/"STOCK_OUT" and "Stock-In"/"Stock-Out"
        const normalizedType = t.type.replace('_', '-').replace('STOCK', 'Stock');
        return normalizedType === filterType || t.type === filterType;
      });

  // Count inventory items by status
  const totalInStock = inventoryItems.filter(item => item.status === 'In Stock').length;
  const totalOutOfStock = inventoryItems.filter(item => item.status === 'Out of Stock').length;
  const totalLowStock = inventoryItems.filter(item => item.status === 'Low Stock').length;

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
                <h1 className="text-2xl text-gray-800">Stock Transactions</h1>
                <p className="text-gray-600">Track incoming shipments & outgoing dispatches</p>
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
          <Card className="bg-white shadow-lg border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">In Stock</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{totalInStock.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Products available</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-red-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Out of Stock</CardTitle>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{totalOutOfStock.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Products unavailable</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Total Transactions</CardTitle>
              <Package className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-gray-800">{transactions.length}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="Stock-In">Stock-In Only</SelectItem>
                  <SelectItem value="Stock-Out">Stock-Out Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white">
                  <Package className="w-4 h-4 mr-2" />
                  New Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Stock Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitTransaction} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Transaction Type</Label>
                      <Select value={transactionType} onValueChange={(value: any) => setTransactionType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Stock-In">Stock-In (Received)</SelectItem>
                          <SelectItem value="Stock-Out">Stock-Out (Dispatched)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Product</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map(item => (
                            <SelectItem key={item.id} value={item.sku}>
                              {item.name} ({item.sku})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        min="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Reference Number</Label>
                      <Input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="e.g., PO-2025-001"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes (optional)"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                      Record Transaction
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-800">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Handled By</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>
                      <Badge className={transaction.type === 'Stock-In' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {transaction.type === 'Stock-In' ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.productName}</TableCell>
                    <TableCell className="font-mono text-sm">{transaction.sku}</TableCell>
                    <TableCell className="font-semibold">{transaction.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        {transaction.handledBy}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {transaction.timestamp}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{transaction.reference}</TableCell>
                    <TableCell className="text-gray-600">{transaction.notes}</TableCell>
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
