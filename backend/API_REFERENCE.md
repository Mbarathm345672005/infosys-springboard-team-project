# SmartShelf API Quick Reference

Base URL: `http://localhost:8080/api`

## Authentication Required

All endpoints except `/auth/**` require JWT token in header:
```
Authorization: Bearer <token>
```

## 🔐 Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@smartshelf.com",
  "password": "admin123"
}

Response: {
  "token": "eyJhbGc...",
  "type": "Bearer",
  "user": {
    "id": "uuid",
    "fullName": "Admin User",
    "email": "admin@smartshelf.com",
    "role": "Admin",
    ...
  }
}
```

### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "companyName": "Company Inc",
  "contactNumber": "+1-555-0100",
  "role": "user",
  "warehouseLocation": "New York"
}
```

## 📦 Inventory Management

### Get All Items
```http
GET /inventory
```

### Get Item by ID
```http
GET /inventory/{id}
```

### Get Item by SKU
```http
GET /inventory/sku/BP-001-BL
```

### Create Item (Admin/Manager)
```http
POST /inventory
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU-001",
  "category": "Category",
  "quantity": 100,
  "minStock": 50,
  "maxStock": 500,
  "price": 9.99,
  "supplier": "Supplier Name",
  "lastRestocked": "2025-01-20",
  "autoRestockEnabled": true
}
```

### Update Item (Admin/Manager)
```http
PUT /inventory/{id}
Content-Type: application/json

{
  // Same as create, all fields
}
```

### Update Stock (Admin/Manager)
```http
PATCH /inventory/{id}/stock
Content-Type: application/json

{
  "quantity": 50,
  "operation": "add"  // or "remove"
}
```

### Delete Item (Admin Only)
```http
DELETE /inventory/{id}
```

### Filter by Category
```http
GET /inventory/category/Writing Instruments
```

### Filter by Status
```http
GET /inventory/status/Low Stock
```

## 📝 Transactions

### Get All Transactions
```http
GET /transactions
```

### Create Transaction (Admin/Manager)
```http
POST /transactions
Content-Type: application/json

{
  "type": "STOCK_IN",  // or "STOCK_OUT"
  "productName": "Ballpoint Pen",
  "sku": "BP-001-BL",
  "quantity": 100,
  "handledBy": "John Smith",
  "reference": "PO-2025-001",
  "notes": "Shipment from supplier"
}
```

### Get Transactions by SKU
```http
GET /transactions/sku/BP-001-BL
```

### Get Transactions by Type
```http
GET /transactions/type/Stock-In
```

## 🔔 Alerts

### Get All Alerts
```http
GET /alerts
```

### Get Unread Alerts
```http
GET /alerts/unread
```

### Mark as Read
```http
PATCH /alerts/{id}/read
```

### Dismiss Alert
```http
PATCH /alerts/{id}/dismiss
```

### Filter by Severity
```http
GET /alerts/severity/HIGH
```

### Create Alert (Admin/Manager)
```http
POST /alerts
Content-Type: application/json

{
  "type": "LOW_STOCK",
  "severity": "HIGH",
  "title": "Low Stock Alert",
  "message": "Product is below minimum threshold",
  "productSKU": "BP-001-BL"
}
```

## 📊 Forecasts

### Get All Forecasts
```http
GET /forecasts
```

### Get Forecast by SKU
```http
GET /forecasts/sku/BP-001-BL
```

### Get by Risk Level
```http
GET /forecasts/risk-level/HIGH
```

### Create Forecast (Admin/Manager)
```http
POST /forecasts
Content-Type: application/json

{
  "sku": "BP-001-BL",
  "productName": "Ballpoint Pen",
  "currentStock": 145,
  "weeklyDemand": 45,
  "forecastedDemand": 180,
  "daysUntilStockout": 22,
  "action": "Restock Soon",
  "riskLevel": "MEDIUM"
}
```

## 🔄 Restock Suggestions

### Get All Suggestions
```http
GET /restock-suggestions
```

### Get by Priority
```http
GET /restock-suggestions/priority/HIGH
```

### Create Suggestion (Admin/Manager)
```http
POST /restock-suggestions
Content-Type: application/json

{
  "sku": "BP-001-BL",
  "productName": "Ballpoint Pen",
  "currentStock": 65,
  "minStock": 80,
  "suggestedQuantity": 200,
  "supplier": "Supplier Ltd",
  "estimatedCost": 150.00,
  "priority": "HIGH",
  "aiConfidence": 96
}
```

## 📋 Purchase Orders

### Get All Orders
```http
GET /purchase-orders
```

### Get Order by ID
```http
GET /purchase-orders/{id}
```

### Get by Status
```http
GET /purchase-orders/status/APPROVED
```

### Create Order (Admin/Manager)
```http
POST /purchase-orders
Content-Type: application/json

{
  "poNumber": "PO-2025-001",
  "supplier": "Supplier Name",
  "items": "Item 1, Item 2",
  "totalQuantity": 500,
  "totalCost": 1500.00,
  "status": "DRAFT",
  "expectedDelivery": "2025-02-15",
  "notes": "Urgent order"
}
```

### Update Order Status (Admin/Manager)
```http
PATCH /purchase-orders/{id}/status
Content-Type: application/json

{
  "status": "APPROVED"
}
```

## 📋 Enums Reference

### User Roles
- `ADMIN` - Full access
- `WAREHOUSE_MANAGER` - Most operations
- `USER` - Read-only access

### Inventory Status
- `IN_STOCK` - Normal stock levels
- `LOW_STOCK` - Below minimum
- `OUT_OF_STOCK` - Zero quantity
- `OVERSTOCKED` - Above maximum

### Transaction Types
- `STOCK_IN` - Incoming stock
- `STOCK_OUT` - Outgoing stock

### Alert Types
- `LOW_STOCK`
- `OUT_OF_STOCK`
- `EXPIRY_WARNING`
- `VENDOR_RESPONSE`
- `RESTOCK_REQUIRED`
- `SYSTEM`

### Alert Severity
- `HIGH` - Critical
- `MEDIUM` - Important
- `LOW` - Informational

### Risk Levels
- `HIGH` - Immediate action needed
- `MEDIUM` - Monitor closely
- `LOW` - Normal

### Priority Levels
- `HIGH` - Urgent
- `MEDIUM` - Important
- `LOW` - Normal

### Purchase Order Status
- `DRAFT` - Being prepared
- `SENT` - Sent to supplier
- `APPROVED` - Approved by supplier
- `DELIVERED` - Received
- `CANCELLED` - Cancelled

## 🔍 Common Patterns

### Pagination (Future Enhancement)
```http
GET /inventory?page=0&size=20&sort=name,asc
```

### Date Range Queries
```http
GET /transactions/date-range?start=2025-01-01T00:00:00&end=2025-01-31T23:59:59
```

### Search (Future Enhancement)
```http
GET /inventory?search=pen
```

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": ["Field is required"]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

## 🧪 Testing with PowerShell

```powershell
# Login and store token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"admin@smartshelf.com","password":"admin123"}'

$token = $loginResponse.token

# Use token in subsequent requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get inventory
Invoke-RestMethod -Uri "http://localhost:8080/api/inventory" `
  -Method Get `
  -Headers $headers

# Create item
$newItem = @{
    name = "Test Product"
    sku = "TEST-001"
    category = "Test"
    quantity = 100
    minStock = 50
    maxStock = 200
    price = 9.99
    supplier = "Test Supplier"
    lastRestocked = "2025-01-20"
    autoRestockEnabled = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/inventory" `
  -Method Post `
  -Headers $headers `
  -Body $newItem
```
