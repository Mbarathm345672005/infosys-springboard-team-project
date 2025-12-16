import { Package, Search, ShoppingCart, Plus, Minus, Trash2, X, Star, Truck, Shield, Heart, ChevronRight, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Separator } from './ui/separator';
import type { User, InventoryItem } from '../App';
import { toast } from 'sonner@2.0.3';

type CartItem = {
  product: InventoryItem;
  quantity: number;
};

type UserDashboardProps = {
  user: User;
  inventoryItems: InventoryItem[];
  onNavigate: (page: 'dashboard' | 'inventory' | 'transactions' | 'forecast' | 'restock' | 'alerts' | 'analytics') => void;
  onLogout: () => void;
};

// Product images mapping (using placeholder images)
const productImages: { [key: string]: string } = {
  'BP-001-BL': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
  'GP-002-BK': 'https://images.unsplash.com/photo-1565022843696-f310c9a77a2c?w=400&h=400&fit=crop',
  'MP-003-05': 'https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=400&h=400&fit=crop',
  'HL-004-YL': 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&h=400&fit=crop',
  'NB-005-RL': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
  'A4-006-80': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
  'SN-007-33': 'https://images.unsplash.com/photo-1594843310716-000b233a6fd3?w=400&h=400&fit=crop',
  'ST-008-MD': 'https://images.unsplash.com/photo-1585435233160-1abf2f6c9c6f?w=400&h=400&fit=crop',
  'SP-009-10': 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop',
  'SC-010-OF': 'https://images.unsplash.com/photo-1565022843696-f310c9a77a2c?w=400&h=400&fit=crop',
  'FF-011-PL': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
  'BC-012-19': 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop',
  'USB-013-32': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
  'INK-014-BK': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop',
  'CP-015-24': 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop',
};

export default function UserDashboard({ user, inventoryItems, onNavigate, onLogout }: UserDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<InventoryItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const categories = ['all', ...Array.from(new Set(inventoryItems.map(item => item.category)))];
  
  const inStockItems = inventoryItems.filter(item => item.status === 'In Stock' || item.status === 'Low Stock');
  
  const filteredItems = inStockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: InventoryItem) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: Math.max(1, Math.min(newQuantity, item.product.quantity)) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
    toast.success('Item removed from cart');
  };

  const handleViewProduct = (product: InventoryItem) => {
    setSelectedProduct(product);
    // Add to recently viewed if not already there
    if (!recentlyViewed.find(p => p.id === product.id)) {
      setRecentlyViewed([product, ...recentlyViewed].slice(0, 4));
    }
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      toast.success('Added to wishlist');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Frequently bought together (mock data based on category)
  const frequentlyBoughtTogether = selectedProduct
    ? inventoryItems.filter(item => 
        item.category === selectedProduct.category && 
        item.id !== selectedProduct.id &&
        (item.status === 'In Stock' || item.status === 'Low Stock')
      ).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40 relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <div className="text-xl text-gray-800">SmartShelfX</div>
                <div className="text-xs text-purple-600">Office Supplies Store</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-300"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                <UserIcon size={18} className="text-purple-600" />
                <span className="text-sm text-gray-700">{user.fullName}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
              <Button
                onClick={() => setIsCartOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white relative"
              >
                <ShoppingCart size={20} className="mr-2" />
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white" 
                  : "bg-white hover:bg-purple-50"
                }
              >
                {category === 'all' ? 'All Products' : category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl text-gray-800">{selectedProduct.name}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                    <X size={24} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={productImages[selectedProduct.sku] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&h=600&fit=crop'}
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover rounded-2xl shadow-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
                    >
                      <Heart className={wishlist.includes(selectedProduct.id) ? "fill-red-500 text-red-500" : ""} size={20} />
                    </Button>
                  </div>

                  {/* Product Details */}
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">(128 reviews)</span>
                      </div>
                      <Badge className={
                        selectedProduct.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                        selectedProduct.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {selectedProduct.status}
                      </Badge>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl text-gray-800">₹{selectedProduct.price.toFixed(2)}</span>
                        <span className="text-lg text-gray-500 line-through">₹{(selectedProduct.price * 1.3).toFixed(2)}</span>
                        <Badge className="bg-red-500 text-white">Save 30%</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Inclusive of all taxes</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2 text-green-600">
                        <Truck size={20} />
                        <span className="text-sm">FREE Delivery by Tomorrow</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <Shield size={20} />
                        <span className="text-sm">1 Year Warranty</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <h3 className="font-semibold text-gray-800">Product Details:</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>SKU:</span>
                          <span className="font-mono">{selectedProduct.sku}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span>{selectedProduct.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seller:</span>
                          <span>{selectedProduct.supplier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available Stock:</span>
                          <span className="font-semibold">{selectedProduct.quantity} units</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-2">About this item:</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Premium quality {selectedProduct.name.toLowerCase()}</li>
                        <li>Perfect for office and personal use</li>
                        <li>Durable and long-lasting material</li>
                        <li>Ergonomic design for comfort</li>
                        <li>Trusted by thousands of customers</li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                      disabled={selectedProduct.status === 'Out of Stock'}
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Frequently Bought Together */}
                {frequentlyBoughtTogether.length > 0 && (
                  <div className="border-t pt-8">
                    <h3 className="text-xl text-gray-800 mb-4">Frequently Bought Together</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {frequentlyBoughtTogether.map(item => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewProduct(item)}>
                          <img
                            src={productImages[item.sku] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop'}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-t-xl"
                          />
                          <CardContent className="p-4">
                            <h4 className="font-medium text-gray-800 mb-1">{item.name}</h4>
                            <p className="text-lg text-purple-600 mb-2">₹{item.price.toFixed(2)}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                              className="w-full"
                            >
                              Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl text-gray-800 mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewed.map(item => (
                <Card 
                  key={item.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer bg-white"
                  onClick={() => handleViewProduct(item)}
                >
                  <div className="relative">
                    <img
                      src={productImages[item.sku] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop'}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-lg text-purple-600">₹{item.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Product Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-gray-800">
              {selectedCategory === 'all' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-gray-600">{filteredItems.length} products</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <Card 
                key={item.id} 
                className="hover:shadow-xl transition-all cursor-pointer bg-white overflow-hidden group"
                onClick={() => handleViewProduct(item)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={productImages[item.sku] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop'}
                    alt={item.name}
                    className="w-full h-56 object-cover transition-transform group-hover:scale-110"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Heart className={wishlist.includes(item.id) ? "fill-red-500 text-red-500" : ""} size={18} />
                  </Button>
                  {item.status === 'Low Stock' && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                      Low Stock
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                  <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-10">{item.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl text-gray-800">₹{item.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 line-through">₹{(item.price * 1.3).toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                    disabled={item.status === 'Out of Stock'}
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart size={24} />
              Shopping Cart ({cartItemCount} items)
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto mb-4 text-gray-300" size={64} />
                <p className="text-gray-500">Your cart is empty</p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <Card key={item.product.id} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={productImages[item.product.sku] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">₹{item.product.price.toFixed(2)} each</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateQuantity(item.product.id, -1)}
                              disabled={item.quantity <= 1}
                              className="h-7 w-7 p-0"
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateQuantity(item.product.id, 1)}
                              disabled={item.quantity >= item.product.quantity}
                              className="h-7 w-7 p-0"
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-lg font-semibold text-gray-800">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </Card>
                ))}

                <Separator className="my-6" />

                <div className="space-y-3 bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery:</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl">
                    <span>Total:</span>
                    <span className="text-purple-600">₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    toast.success('Order placed successfully!');
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                >
                  Proceed to Checkout
                  <ChevronRight className="ml-2" size={20} />
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
