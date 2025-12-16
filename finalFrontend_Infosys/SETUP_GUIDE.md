# SmartShelf Warehouse - Complete Setup Guide

## 🎯 Overview

This guide will help you set up and run the complete SmartShelf Warehouse Management System with Spring Boot backend and React frontend.

## 📋 Prerequisites

### Required Software
- **Java 17+** - [Download](https://adoptium.net/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js

### Verify Installations

```powershell
java -version
mvn -version
mysql --version
node -version
npm -version
```

## 🗄️ Database Setup

### 1. Start MySQL Service

```powershell
# Windows - Start MySQL service
net start MySQL80
```

### 2. Create Database

```powershell
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE smartshelf_db;

# Verify
SHOW DATABASES;

# Exit
exit;
```

## 🚀 Backend Setup (Spring Boot)

### 1. Navigate to Backend Directory

```powershell
cd c:\Users\DELL\Desktop\infosys2\finalFrontend_Infosys\backend
```

### 2. Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartshelf_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Build and Run Backend

```powershell
# Clean and build
mvn clean install

# Run the application
mvn spring-boot:run
```

**Expected Output:**
```
🌱 Seeding database with initial data...
✅ Database seeded successfully!
📧 Admin: admin@smartshelf.com / admin123
📧 Manager: manager@smartshelf.com / manager123
📧 User: user@smartshelf.com / user123

Started WarehouseApplication in X.XXX seconds
```

Backend will be running at: **http://localhost:8080/api**

### 4. Verify Backend is Running

Open another PowerShell window:

```powershell
# Test health endpoint
curl http://localhost:8080/api/auth/login
```

## 💻 Frontend Setup (React + Vite)

### 1. Navigate to Frontend Directory

```powershell
cd c:\Users\DELL\Desktop\infosys2\finalFrontend_Infosys
```

### 2. Clean Install Dependencies

```powershell
# Remove old node_modules if exists
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }

# Install dependencies
npm install
```

### 3. Start Frontend Dev Server

```powershell
npm run dev
```

**Expected Output:**
```
  VITE v6.3.5  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Frontend will be running at: **http://localhost:3000**

## 🧪 Testing the Integration

### 1. Access the Application

Open your browser and navigate to: **http://localhost:3000**

### 2. Test User Login

Try logging in with one of the test accounts:

**Admin Account:**
- Email: `admin@smartshelf.com`
- Password: `admin123`

**Manager Account:**
- Email: `manager@smartshelf.com`
- Password: `manager123`

**Regular User:**
- Email: `user@smartshelf.com`
- Password: `user123`

### 3. Test API Endpoints (Optional)

You can test API endpoints using curl or Postman:

#### Login and Get Token

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"admin@smartshelf.com","password":"admin123"}'

$token = $response.token
Write-Host "Token: $token"
```

#### Get Inventory Items

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/inventory" `
  -Method Get `
  -Headers $headers
```

## 🔧 Frontend Integration (Already Done)

The API service is created at `src/services/api.ts`. To use it in your components:

### Example: Login Component

```typescript
import { authAPI } from '../services/api';
import { toast } from 'sonner';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    setUser(response.user);
    toast.success('Login successful!');
  } catch (error) {
    toast.error('Login failed: ' + error.message);
  }
};
```

### Example: Fetch Inventory

```typescript
import { inventoryAPI } from '../services/api';

const fetchInventory = async () => {
  try {
    const items = await inventoryAPI.getAll();
    setInventoryItems(items);
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
  }
};
```

## 📊 Database Tables

After first run, these tables will be created automatically:

- `users` - User accounts
- `inventory_items` - Products
- `transactions` - Stock movements
- `alerts` - Notifications
- `forecast_data` - AI predictions
- `restock_suggestions` - Restock recommendations
- `purchase_orders` - Supplier orders

### View Tables in MySQL

```sql
USE smartshelf_db;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM inventory_items;
```

## 🐛 Common Issues & Solutions

### Issue: Port 8080 Already in Use

**Solution:** Change backend port in `application.properties`:
```properties
server.port=8081
```
Then update frontend API base URL in `src/services/api.ts`.

### Issue: MySQL Connection Refused

**Solution:**
1. Verify MySQL is running: `net start MySQL80`
2. Check credentials in `application.properties`
3. Ensure database exists: `CREATE DATABASE smartshelf_db;`

### Issue: npm install fails with EBUSY

**Solution:**
```powershell
# Close VS Code and other editors
# Kill node processes
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

# Remove and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: CORS Errors

**Solution:** Backend CORS is configured for ports 3000, 5173, 5174. If using different port, update `SecurityConfig.java`:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://localhost:YOUR_PORT"
));
```

### Issue: JWT Token Expired

**Solution:** Login again or update expiration in `application.properties`:
```properties
jwt.expiration=86400000  # 24 hours in milliseconds
```

## 📱 Application Features

### For All Users:
- View inventory dashboard
- Search and filter products
- View transaction history
- View alerts and notifications

### For Managers & Admins:
- Add/edit/delete inventory items
- Create stock transactions
- Manage purchase orders
- View AI forecasts and restock suggestions

### For Admins Only:
- Full system access
- Delete inventory items
- Cancel purchase orders
- Manage all users

## 🔐 Security

- All passwords are hashed with BCrypt
- JWT tokens expire after 24 hours
- Role-based access control enforced
- HTTPS recommended for production

## 📈 Next Steps

1. **Update Mock Data:** Replace frontend mock data with real API calls
2. **Add Error Handling:** Implement proper error boundaries
3. **Add Loading States:** Show spinners while fetching data
4. **Implement Refresh Tokens:** For better security
5. **Add Unit Tests:** For both backend and frontend
6. **Deploy:** Configure for production environment

## 🆘 Getting Help

### Check Logs

**Backend Logs:**
Look in the terminal where you ran `mvn spring-boot:run`

**Frontend Logs:**
Open browser DevTools (F12) → Console tab

### Test Individual Components

**Test Backend Only:**
```powershell
# From backend directory
mvn test
```

**Test Frontend Only:**
```powershell
# From frontend directory
npm run build
```

## 📞 Support

For issues, please check:
1. All services are running
2. Database is accessible
3. Ports are not conflicting
4. Environment variables are correct

## 🎉 Success Indicators

✅ Backend starts without errors  
✅ Database tables created automatically  
✅ Test users can login  
✅ Frontend connects to backend  
✅ JWT authentication works  
✅ Inventory data loads  

If all indicators are ✅, your system is fully operational!
