import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import SmartShelfLogin from './components/SmartShelfLogin';
import SmartShelfSignup from './components/SmartShelfSignup';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import VerificationPage from './components/VerificationPage';
import VerifiedPage from './components/VerifiedPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import NewDashboard from './components/NewDashboard';
import NewInventoryPage from './components/NewInventoryPage';
import UserDashboard from './components/UserDashboard';
import StockTransactionsPage from './components/StockTransactionsPage';
import AIForecastPage from './components/AIForecastPage';
import AutoRestockPage from './components/AutoRestockPage';
import AlertsNotificationsPage from './components/AlertsNotificationsPage';
import AnalyticsDashboardPage from './components/AnalyticsDashboardPage';

export type User = {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  contactNumber: string;
  role: string;
  warehouseLocation: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  price: number;
  supplier: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked';
  forecastDemand?: number;
  autoRestockEnabled: boolean;
};

type Page = 'login' | 'signup' | 'forgot-password' | 'verification' | 'verified' | 'reset-password' | 'dashboard' | 'inventory' | 'transactions' | 'forecast' | 'restock' | 'alerts' | 'analytics';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    // Load registered users from localStorage on initial mount
    const stored = localStorage.getItem('smartshelf_users');
    return stored ? JSON.parse(stored) : [];
  });

  // Save registered users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('smartshelf_users', JSON.stringify(registeredUsers));
    console.log('📦 Registered users saved to localStorage:', registeredUsers.length, 'users');
  }, [registeredUsers]);
  
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    // Writing Instruments
    {
      id: '1',
      name: 'Ballpoint Pen Blue',
      sku: 'BP-001-BL',
      category: 'Writing Instruments',
      quantity: 145,
      minStock: 100,
      maxStock: 500,
      price: 0.50,
      supplier: 'Pen Masters Ltd.',
      lastRestocked: '2025-01-20',
      status: 'In Stock',
      forecastDemand: 180,
      autoRestockEnabled: true,
    },
    {
      id: '2',
      name: 'Gel Pen Black',
      sku: 'GP-002-BK',
      category: 'Writing Instruments',
      quantity: 65,
      minStock: 80,
      maxStock: 400,
      price: 0.75,
      supplier: 'Pen Masters Ltd.',
      lastRestocked: '2025-01-18',
      status: 'Low Stock',
      forecastDemand: 120,
      autoRestockEnabled: true,
    },
    {
      id: '3',
      name: 'Mechanical Pencil 0.5mm',
      sku: 'MP-003-05',
      category: 'Writing Instruments',
      quantity: 0,
      minStock: 50,
      maxStock: 250,
      price: 1.25,
      supplier: 'Pen Masters Ltd.',
      lastRestocked: '2025-01-10',
      status: 'Out of Stock',
      forecastDemand: 90,
      autoRestockEnabled: true,
    },
    {
      id: '4',
      name: 'Highlighter Yellow',
      sku: 'HL-004-YL',
      category: 'Writing Instruments',
      quantity: 220,
      minStock: 60,
      maxStock: 200,
      price: 0.85,
      supplier: 'ColorMark Inc.',
      lastRestocked: '2025-01-22',
      status: 'Overstocked',
      forecastDemand: 95,
      autoRestockEnabled: false,
    },
    // Paper Products
    {
      id: '5',
      name: 'Notebook Ruled',
      sku: 'NB-005-RL',
      category: 'Paper Products',
      quantity: 85,
      minStock: 50,
      maxStock: 300,
      price: 2.50,
      supplier: 'Paper World Co.',
      lastRestocked: '2025-01-19',
      status: 'In Stock',
      forecastDemand: 110,
      autoRestockEnabled: true,
    },
    {
      id: '6',
      name: 'A4 Paper Pack',
      sku: 'A4-006-80',
      category: 'Paper Products',
      quantity: 28,
      minStock: 40,
      maxStock: 200,
      price: 4.99,
      supplier: 'Paper World Co.',
      lastRestocked: '2025-01-15',
      status: 'Low Stock',
      forecastDemand: 75,
      autoRestockEnabled: true,
    },
    {
      id: '7',
      name: 'Sticky Notes 3x3',
      sku: 'SN-007-33',
      category: 'Paper Products',
      quantity: 150,
      minStock: 80,
      maxStock: 400,
      price: 1.50,
      supplier: 'Office Essentials Ltd.',
      lastRestocked: '2025-01-21',
      status: 'In Stock',
      forecastDemand: 125,
      autoRestockEnabled: true,
    },
    // Office & Desk Supplies
    {
      id: '8',
      name: 'Stapler Medium',
      sku: 'ST-008-MD',
      category: 'Office Supplies',
      quantity: 42,
      minStock: 30,
      maxStock: 150,
      price: 5.99,
      supplier: 'Office Essentials Ltd.',
      lastRestocked: '2025-01-20',
      status: 'In Stock',
      forecastDemand: 55,
      autoRestockEnabled: true,
    },
    {
      id: '9',
      name: 'Stapler Pins No.10',
      sku: 'SP-009-10',
      category: 'Office Supplies',
      quantity: 320,
      minStock: 200,
      maxStock: 1000,
      price: 0.99,
      supplier: 'Office Essentials Ltd.',
      lastRestocked: '2025-01-18',
      status: 'In Stock',
      forecastDemand: 280,
      autoRestockEnabled: true,
    },
    {
      id: '10',
      name: 'Scissors Office',
      sku: 'SC-010-OF',
      category: 'Office Supplies',
      quantity: 15,
      minStock: 25,
      maxStock: 100,
      price: 3.50,
      supplier: 'Craft Masters Inc.',
      lastRestocked: '2025-01-12',
      status: 'Low Stock',
      forecastDemand: 40,
      autoRestockEnabled: true,
    },
    // Filing & Organization
    {
      id: '11',
      name: 'File Folder Plastic',
      sku: 'FF-011-PL',
      category: 'Filing & Organization',
      quantity: 95,
      minStock: 60,
      maxStock: 250,
      price: 1.99,
      supplier: 'Office Organizers Co.',
      lastRestocked: '2025-01-21',
      status: 'In Stock',
      forecastDemand: 85,
      autoRestockEnabled: true,
    },
    {
      id: '12',
      name: 'Binder Clips 19mm',
      sku: 'BC-012-19',
      category: 'Filing & Organization',
      quantity: 180,
      minStock: 100,
      maxStock: 500,
      price: 0.25,
      supplier: 'Office Organizers Co.',
      lastRestocked: '2025-01-19',
      status: 'In Stock',
      forecastDemand: 150,
      autoRestockEnabled: true,
    },
    // Computer & Printing
    {
      id: '13',
      name: 'USB Drive 32GB',
      sku: 'USB-013-32',
      category: 'Computer Accessories',
      quantity: 35,
      minStock: 20,
      maxStock: 100,
      price: 12.99,
      supplier: 'Tech Store Pro',
      lastRestocked: '2025-01-20',
      status: 'In Stock',
      forecastDemand: 45,
      autoRestockEnabled: true,
    },
    {
      id: '14',
      name: 'Printer Ink Black',
      sku: 'INK-014-BK',
      category: 'Computer Accessories',
      quantity: 8,
      minStock: 15,
      maxStock: 60,
      price: 24.99,
      supplier: 'Tech Store Pro',
      lastRestocked: '2025-01-16',
      status: 'Low Stock',
      forecastDemand: 25,
      autoRestockEnabled: true,
    },
    // Art & Craft
    {
      id: '15',
      name: 'Color Pencils 24-pack',
      sku: 'CP-015-24',
      category: 'Art & Craft',
      quantity: 55,
      minStock: 40,
      maxStock: 200,
      price: 8.99,
      supplier: 'Craft Masters Inc.',
      lastRestocked: '2025-01-19',
      status: 'In Stock',
      forecastDemand: 70,
      autoRestockEnabled: true,
    },
  ]);

  const handleLogin = (email: string, password: string) => {
    console.log('🟢 LOGIN - Starting login process');
    console.log('🟢 LOGIN - Email entered:', email);
    console.log('🟢 LOGIN - Total registered users in system:', registeredUsers.length);
    console.log('🟢 LOGIN - All registered users:', registeredUsers);
    
    // Check if user is registered
    const registeredUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    let userToLogin: User;
    
    if (registeredUser) {
      // Use registered user data with their selected role
      userToLogin = registeredUser;
      console.log('🟢 LOGIN - ✅ Registered user found!');
      console.log('🟢 LOGIN - User name:', registeredUser.fullName);
      console.log('🟢 LOGIN - User role:', registeredUser.role);
      console.log('🟢 LOGIN - User object:', registeredUser);
    } else {
      console.log('🟢 LOGIN - ⚠️ User not found in registry, using mock login');
      
      // Mock login for testing - assign different roles based on email
      let role = 'User';
      let fullName = 'John Doe';
      
      if (email.toLowerCase().includes('admin')) {
        role = 'Admin';
        fullName = 'Admin User';
      } else if (email.toLowerCase().includes('manager') || email.toLowerCase().includes('warehouse')) {
        role = 'Warehouse Manager';
        fullName = 'John Smith';
      }
      
      userToLogin = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        fullName: fullName,
        email: email,
        companyName: 'Tech Warehouse Inc.',
        contactNumber: '+1 (555) 123-4567',
        role: role,
        warehouseLocation: 'New York, NY, USA',
      };
      
      console.log('🟢 LOGIN - Mock user role:', role);
    }
    
    console.log('🟢 LOGIN - Final user to login:', userToLogin);
    console.log('🟢 LOGIN - Final role:', userToLogin.role);
    
    setUser(userToLogin);
    setCurrentPage('dashboard');
  };

  const handleSignup = (userData: Omit<User, 'id'>) => {
    console.log('🔵 SIGNUP - Starting registration process');
    console.log('🔵 SIGNUP - Original role from form:', userData.role);
    
    // Create user with proper role capitalization for consistency
    let normalizedRole = userData.role;
    if (userData.role === 'admin') {
      normalizedRole = 'Admin';
    } else if (userData.role === 'warehouse-manager') {
      normalizedRole = 'Warehouse Manager';
    } else if (userData.role === 'user') {
      normalizedRole = 'User';
    }
    
    const newUser: User = {
      ...userData,
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      role: normalizedRole,
    };
    
    console.log('🔵 SIGNUP - Normalized role:', normalizedRole);
    console.log('🔵 SIGNUP - New user object:', newUser);
    
    // Store the registered user
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    
    console.log('🔵 SIGNUP - User stored! Total registered users:', updatedUsers.length);
    console.log('🔵 SIGNUP - All registered users:', updatedUsers);
    
    // Redirect to login
    setCurrentPage('login');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  // CRUD Operations
  const handleAddItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setInventoryItems([...inventoryItems, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventoryItems(items =>
      items.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setInventoryItems(items => items.filter(item => item.id !== id));
  };



  return (
    <>
      {currentPage === 'login' && (
        <SmartShelfLogin
          onLogin={handleLogin}
          onNavigateToSignup={() => handleNavigate('signup')}
          onNavigateToForgotPassword={() => handleNavigate('forgot-password')}
        />
      )}

      {currentPage === 'signup' && (
        <SmartShelfSignup
          onSignup={handleSignup}
          onNavigateToLogin={() => handleNavigate('login')}
        />
      )}

      {currentPage === 'forgot-password' && (
        <ForgotPasswordPage
          onNavigateToLogin={() => handleNavigate('login')}
          onNavigateToVerification={(email) => {
            setResetEmail(email);
            handleNavigate('verification');
          }}
        />
      )}

      {currentPage === 'verification' && (
        <VerificationPage
          email={resetEmail}
          onNavigateBack={() => handleNavigate('forgot-password')}
          onNavigateToVerified={() => handleNavigate('verified')}
        />
      )}

      {currentPage === 'verified' && (
        <VerifiedPage
          onNavigateToResetPassword={() => handleNavigate('reset-password')}
        />
      )}

      {currentPage === 'reset-password' && (
        <ResetPasswordPage
          onNavigateToLogin={() => handleNavigate('login')}
        />
      )}

      {currentPage === 'dashboard' && user && (
        <>
          {(() => {
            console.log('🟣 DASHBOARD RENDER - User object:', user);
            console.log('🟣 DASHBOARD RENDER - User role:', user.role);
            console.log('🟣 DASHBOARD RENDER - Role type:', typeof user.role);
            
            const isAdminOrManager = user.role === 'Admin' || user.role === 'admin' || user.role === 'Warehouse Manager' || user.role === 'warehouse-manager';
            console.log('🟣 DASHBOARD RENDER - Is Admin/Manager?', isAdminOrManager);
            
            if (isAdminOrManager) {
              console.log('🟣 DASHBOARD RENDER - ✅ Showing ADMIN DASHBOARD (NewDashboard)');
              return (
                <NewDashboard
                  user={user}
                  inventoryItems={inventoryItems}
                  onNavigate={handleNavigate}
                  onLogout={handleLogout}
                />
              );
            } else {
              console.log('🟣 DASHBOARD RENDER - ✅ Showing USER DASHBOARD (UserDashboard)');
              return (
                <UserDashboard
                  user={user}
                  inventoryItems={inventoryItems}
                  onNavigate={handleNavigate}
                  onLogout={handleLogout}
                />
              );
            }
          })()}
        </>
      )}

      {currentPage === 'inventory' && user && (
        <NewInventoryPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'transactions' && user && (
        <StockTransactionsPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'forecast' && user && (
        <AIForecastPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'restock' && user && (
        <AutoRestockPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'alerts' && user && (
        <AlertsNotificationsPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'analytics' && user && (
        <AnalyticsDashboardPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      <Toaster position="top-center" />
    </>
  );
}

export default App;