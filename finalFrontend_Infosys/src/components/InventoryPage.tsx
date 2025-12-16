import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
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
import SmartShelfNavbar from './SmartShelfNavbar';
import type { User, InventoryItem } from '../App';
import { toast } from 'sonner@2.0.3';

type InventoryPageProps = {
  user: User;
  inventoryItems: InventoryItem[];
  onNavigate: (page: 'dashboard' | 'inventory' | 'restock' | 'forecast' | 'reports') => void;
  onLogout: () => void;
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
};

export default function InventoryPage({
  user,
  inventoryItems,
  onNavigate,
  onLogout,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: InventoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleAdd = () => {
    if (!name || !sku || !category || !quantity || !minStock || !maxStock || !price || !supplier) {
      toast.error('Please fill in all fields');
      return;
    }

    const qty = parseInt(quantity);
    const min = parseInt(minStock);
    const max = parseInt(maxStock);

    onAddItem({
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

  const handleUpdate = () => {
    if (!editingItem || !name || !sku || !category || !quantity || !minStock || !maxStock || !price || !supplier) {
      toast.error('Please fill in all fields');
      return;
    }

    const qty = parseInt(quantity);
    const min = parseInt(minStock);
    const max = parseInt(maxStock);

    onUpdateItem(editingItem.id, {
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
  };

  const handleDelete = (id: string) => {
    onDeleteItem(id);
    toast.success('Item deleted successfully!');
    setItemToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-500';
      case 'Low Stock':
        return 'bg-yellow-500';
      case 'Out of Stock':
        return 'bg-red-500';
      case 'Overstocked':
        return 'bg-blue-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <SmartShelfNavbar
        user={user}
        currentPage="inventory"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-slate-900 mb-2">Inventory Management</h1>
            <p className="text-slate-600">Manage all your inventory items</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                <Plus size={18} className="mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>Enter the details of the new item</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Wireless Mouse" />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g., WM-001" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
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
                  <Label>Price ($)</Label>
                  <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                </div>
                <div className="col-span-2 flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-900">Enable Auto-Restock</div>
                    <div className="text-xs text-slate-600">AI will automatically trigger restocking when needed</div>
                  </div>
                  <Switch checked={autoRestock} onCheckedChange={setAutoRestock} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handleAdd} className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600">
                  Add Item
                </Button>
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-md mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  placeholder="Search by name, SKU, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="text-sm">
                {filteredItems.length} items
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>All Items</CardTitle>
            <CardDescription>Complete list of inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
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
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.supplier}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
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
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.autoRestockEnabled ? (
                        <Badge variant="outline" className="text-purple-600 border-purple-300">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setItemToDelete(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
              <DialogDescription>Update the item details</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
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
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
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
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="col-span-2 flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-900">Enable Auto-Restock</div>
                  <div className="text-xs text-slate-600">AI will automatically trigger restocking when needed</div>
                </div>
                <Switch checked={autoRestock} onCheckedChange={setAutoRestock} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleUpdate} className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600">
                Update Item
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
                This action cannot be undone. This will permanently delete the inventory item.
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
