import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import AppSidebar from './AppSidebar';
import type { User, InventoryItem } from '../App';
import { toast } from 'sonner@2.0.3';
import { inventoryAPI } from '../services/api';

type NewInventoryPageProps = {
  user: User;
  onNavigate: (page: 'dashboard' | 'inventory' | 'transactions' | 'forecast' | 'restock' | 'alerts' | 'analytics') => void;
  onLogout: () => void;
};

export default function NewInventoryPage({
  user,
  onNavigate,
  onLogout,
}: NewInventoryPageProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [autoRestock, setAutoRestock] = useState(true);

  // Fetch inventory items on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const items = await inventoryAPI.getAll();
      setInventoryItems(items);
    } catch (error) {
      toast.error('Failed to load inventory');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    'Writing Instruments',
    'Paper Products',
    'Office Supplies',
    'Filing & Organization',
    'Computer Accessories',
    'Art & Craft'
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'In Stock', label: 'In Stock' },
    { value: 'Low Stock', label: 'Low Stock' },
    { value: 'Out of Stock', label: 'Out of Stock' },
    { value: 'Overstocked', label: 'Overstocked' },
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const resetForm = () => {
    setName('');
    setSku('');
    setCategory('');
    setQuantity('');
    setMinStock('');
    setMaxStock('');
    setPrice('');
    setSupplier('');
    setAutoRestock(true);
  };

  const getStatus = (qty: number, min: number, max: number): InventoryItem['status'] => {
    if (qty === 0) return 'Out of Stock';
    if (qty < min) return 'Low Stock';
    if (qty > max) return 'Overstocked';
    return 'In Stock';
  };

  const handleAdd = async () => {
    if (!name || !sku || !category || !quantity || !minStock || !maxStock || !price || !supplier) {
      toast.error('Please fill in all fields');
      return;
    }

    const qty = parseInt(quantity);
    const min = parseInt(minStock);
    const max = parseInt(maxStock);

    try {
      await inventoryAPI.create({
        name,
        sku,
        category,
        quantity: qty,
        minStock: min,
        maxStock: max,
        price: parseFloat(price),
        supplier,
        lastRestocked: new Date().toISOString().split('T')[0],
        status: getStatus(qty, min, max),
        forecastDemand: Math.round(qty * 1.2),
        autoRestockEnabled: autoRestock,
      });

      toast.success('Item added successfully!');
      setIsAddDialogOpen(false);
      resetForm();
      fetchInventory(); // Refresh list
    } catch (error) {
      toast.error('Failed to add item');
      console.error(error);
    }
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setSku(item.sku);
    setCategory(item.category);
    setQuantity(item.quantity.toString());
    setMinStock(item.minStock.toString());
    setMaxStock(item.maxStock.toString());
    setPrice(item.price.toString());
    setSupplier(item.supplier);
    setAutoRestock(item.autoRestockEnabled);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem || !name || !sku || !category || !quantity || !minStock || !maxStock || !price || !supplier) {
      toast.error('Please fill in all fields');
      return;
    }

    const qty = parseInt(quantity);
    const min = parseInt(minStock);
    const max = parseInt(maxStock);

    try {
      await inventoryAPI.update(editingItem.id, {
        name,
        sku,
        category,
        quantity: qty,
        minStock: min,
        maxStock: max,
        price: parseFloat(price),
        supplier,
        status: getStatus(qty, min, max),
        autoRestockEnabled: autoRestock,
      });

      toast.success('Item updated successfully!');
      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchInventory(); // Refresh list
    } catch (error) {
      toast.error('Failed to update item');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await inventoryAPI.delete(id);
      toast.success('Item deleted successfully!');
      setItemToDelete(null);
      fetchInventory(); // Refresh list
    } catch (error) {
      toast.error('Failed to delete item');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-500 hover:bg-green-600';
      case 'Low Stock':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Out of Stock':
        return 'bg-red-500 hover:bg-red-600';
      case 'Overstocked':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-200">
      <AppSidebar
        user={user}
        currentPage="inventory"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-slate-900">Inventory Management</h1>
              <p className="text-sm text-slate-600">Manage all your stationery products</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Search and Filter */}
          <Card className="border-0 shadow-md mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    placeholder="Search by name, SKU, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
                    {filteredItems.length} items
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>Complete list of stationery inventory</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-md">
                      <Plus size={18} className="mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>Enter the details of the new stationery item</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Ballpoint Pen Blue" />
                      </div>
                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g., BP-001-BL" />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Supplier</Label>
                        <Input value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Supplier name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Current Quantity</Label>
                        <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Min Stock Level</Label>
                        <Input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Stock Level</Label>
                        <Input type="number" value={maxStock} onChange={(e) => setMaxStock(e.target.value)} placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (₹)</Label>
                        <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                      </div>
                      <div className="col-span-2 flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                        <div>
                          <div className="text-sm text-slate-900">Enable Auto-Restock</div>
                          <div className="text-xs text-slate-600">AI will automatically trigger restocking when needed</div>
                        </div>
                        <Switch checked={autoRestock} onCheckedChange={setAutoRestock} />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button onClick={handleAdd} className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600">
                        Add Product
                      </Button>
                      <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50">
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Auto-Restock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-purple-50/50">
                        <TableCell>
                          <div>
                            <div className="text-slate-900">{item.name}</div>
                            <div className="text-xs text-slate-500">{item.supplier}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-purple-200 text-purple-700">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-slate-900">{item.quantity}</div>
                            <div className="text-xs text-slate-500">Min: {item.minStock}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {item.autoRestockEnabled ? (
                            <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
                              Enabled
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-600">Disabled</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(item)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setItemToDelete(item.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update the product details</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={sku} onChange={(e) => setSku(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Input value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Current Quantity</Label>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Min Stock Level</Label>
                <Input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Max Stock Level</Label>
                <Input type="number" value={maxStock} onChange={(e) => setMaxStock(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="col-span-2 flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div>
                  <div className="text-sm text-slate-900">Enable Auto-Restock</div>
                  <div className="text-xs text-slate-600">AI will automatically trigger restocking when needed</div>
                </div>
                <Switch checked={autoRestock} onCheckedChange={setAutoRestock} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleUpdate} className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600">
                Update Product
              </Button>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingItem(null); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={itemToDelete !== null} onOpenChange={() => setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product from your inventory.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => itemToDelete && handleDelete(itemToDelete)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}