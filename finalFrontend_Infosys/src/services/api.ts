// API Service for SmartShelf Warehouse Frontend
// Place this file in: src/services/api.ts

const API_BASE_URL = 'http://localhost:8080/api';

// Get token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('authToken', data.token);
    return data;
  },

  signup: async (userData: {
    fullName: string;
    email: string;
    password: string;
    companyName: string;
    contactNumber: string;
    role: string;
    warehouseLocation: string;
  }) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    localStorage.setItem('authToken', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: () => apiRequest('/inventory'),
  getById: (id: string) => apiRequest(`/inventory/${id}`),
  getBySku: (sku: string) => apiRequest(`/inventory/sku/${sku}`),
  create: (item: any) => apiRequest('/inventory', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  update: (id: string, item: any) => apiRequest(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  delete: (id: string) => apiRequest(`/inventory/${id}`, { method: 'DELETE' }),
  updateStock: (id: string, quantity: number, operation: 'add' | 'remove') =>
    apiRequest(`/inventory/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity, operation }),
    }),
  getByCategory: (category: string) => apiRequest(`/inventory/category/${category}`),
  getByStatus: (status: string) => apiRequest(`/inventory/status/${status}`),
  search: (keyword: string) => apiRequest(`/inventory/search?keyword=${encodeURIComponent(keyword)}`),
  getLowStock: () => apiRequest('/inventory/low-stock'),
  getNeedingRestock: () => apiRequest('/inventory/needing-restock'),
  getAutoRestockEnabled: () => apiRequest('/inventory/auto-restock-enabled'),
  getBySupplier: (supplier: string) => apiRequest(`/inventory/supplier/${supplier}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => apiRequest('/transactions'),
  getById: (id: string) => apiRequest(`/transactions/${id}`),
  getBySku: (sku: string) => apiRequest(`/transactions/sku/${sku}`),
  getByType: (type: string) => apiRequest(`/transactions/type/${type}`),
  create: (transaction: any) => apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  }),
};

// Alerts API
export const alertsAPI = {
  getAll: () => apiRequest('/alerts'),
  getUnread: () => apiRequest('/alerts/unread'),
  getById: (id: string) => apiRequest(`/alerts/${id}`),
  getBySeverity: (severity: string) => apiRequest(`/alerts/severity/${severity}`),
  getByType: (type: string) => apiRequest(`/alerts/type/${type}`),
  markAsRead: (id: string) => apiRequest(`/alerts/${id}/read`, { method: 'PATCH' }),
  dismiss: (id: string) => apiRequest(`/alerts/${id}/dismiss`, { method: 'PATCH' }),
  create: (alert: any) => apiRequest('/alerts', {
    method: 'POST',
    body: JSON.stringify(alert),
  }),
};

// Forecasts API
export const forecastsAPI = {
  getAll: () => apiRequest('/forecasts'),
  getById: (id: string) => apiRequest(`/forecasts/${id}`),
  getBySku: (sku: string) => apiRequest(`/forecasts/sku/${sku}`),
  getByRiskLevel: (riskLevel: string) => apiRequest(`/forecasts/risk-level/${riskLevel}`),
  create: (forecast: any) => apiRequest('/forecasts', {
    method: 'POST',
    body: JSON.stringify(forecast),
  }),
  delete: (id: string) => apiRequest(`/forecasts/${id}`, { method: 'DELETE' }),
};

// Restock Suggestions API
export const restockAPI = {
  getAll: () => apiRequest('/restock-suggestions'),
  getById: (id: string) => apiRequest(`/restock-suggestions/${id}`),
  getByPriority: (priority: string) => apiRequest(`/restock-suggestions/priority/${priority}`),
  create: (suggestion: any) => apiRequest('/restock-suggestions', {
    method: 'POST',
    body: JSON.stringify(suggestion),
  }),
  delete: (id: string) => apiRequest(`/restock-suggestions/${id}`, { method: 'DELETE' }),
};

// Purchase Orders API
export const purchaseOrdersAPI = {
  getAll: () => apiRequest('/purchase-orders'),
  getById: (id: string) => apiRequest(`/purchase-orders/${id}`),
  getByPoNumber: (poNumber: string) => apiRequest(`/purchase-orders/po-number/${poNumber}`),
  getByStatus: (status: string) => apiRequest(`/purchase-orders/status/${status}`),
  create: (order: any) => apiRequest('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  update: (id: string, order: any) => apiRequest(`/purchase-orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(order),
  }),
  updateStatus: (id: string, status: string) =>
    apiRequest(`/purchase-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) => apiRequest(`/purchase-orders/${id}`, { method: 'DELETE' }),
};
