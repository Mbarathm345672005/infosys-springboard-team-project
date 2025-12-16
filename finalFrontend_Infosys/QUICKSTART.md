# 🚀 Quick Start Guide - SmartShelf Full Stack

## Prerequisites
- ✅ Java 17 or higher
- ✅ Maven 3.6+
- ✅ MySQL 8.0+
- ✅ Node.js 16+ & npm

## Step 1: Setup MySQL Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE smartshelf_db;

-- Verify
SHOW DATABASES;

-- Exit
exit;
```

## Step 2: Configure Backend

1. **Update Database Password**:
   ```bash
   cd backend/src/main/resources
   # Edit application.properties
   ```
   
   Change this line to your MySQL password:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

2. **Verify Configuration**:
   ```properties
   server.port=8080
   spring.datasource.url=jdbc:mysql://localhost:3306/smartshelf_db
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```

## Step 3: Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Expected Output**:
```
🔧 Seeding database with initial data...
✅ Created admin user: admin@smartshelf.com
✅ Created manager user: manager@smartshelf.com
✅ Created regular user: user@smartshelf.com
✅ Added 15 inventory items
✅ Database seeded successfully!

Started WarehouseApplication in X.XXX seconds
```

**Backend is ready at**: `http://localhost:8080`

## Step 4: Start Frontend

Open a **NEW TERMINAL**:

```bash
cd finalFrontend_Infosys

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

**Frontend is ready at**: `http://localhost:5173`

## Step 5: Test the Application

### Login Test
1. Open browser → `http://localhost:5173`
2. Use test credentials:
   - **Admin**: admin@smartshelf.com / admin123
   - **Manager**: manager@smartshelf.com / manager123
   - **User**: user@smartshelf.com / user123

### Verify Integration
1. **Login** → Should see dashboard with real data
2. **Inventory** → Should display 15 items from backend
3. **Add Item** → Click "Add Item", fill form, submit
4. **Transactions** → Create a Stock-In transaction
5. **Alerts** → View and dismiss alerts
6. **Forecast** → View AI predictions
7. **Restock** → Generate purchase order

## Troubleshooting

### Backend Not Starting?
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Check MySQL connection
mysql -u root -p smartshelf_db
```

### Frontend Not Loading Data?
1. Check browser console (F12)
2. Verify backend is running: `http://localhost:8080/api/inventory`
3. Check CORS: backend should allow localhost:5173

### Login Not Working?
1. Check browser console for errors
2. Verify JWT token in localStorage:
   - F12 → Application → Local Storage → authToken
3. Test backend directly:
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@smartshelf.com","password":"admin123"}'
   ```

### Database Empty?
```sql
-- Check if data was seeded
USE smartshelf_db;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM inventory_item;

-- If empty, restart backend to trigger seeding
```

## Quick Test Commands

### Test Backend Health
```bash
# Get all inventory (requires login)
curl http://localhost:8080/api/inventory

# Login and get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartshelf.com","password":"admin123"}'
```

### Test Frontend Build
```bash
npm run build
npm run preview
```

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/signup` | POST | User registration |
| `/api/inventory` | GET | Get all items |
| `/api/inventory` | POST | Create item |
| `/api/inventory/{id}` | PUT | Update item |
| `/api/inventory/{id}` | DELETE | Delete item |
| `/api/transactions` | GET | Get all transactions |
| `/api/transactions` | POST | Create transaction |
| `/api/alerts` | GET | Get all alerts |
| `/api/forecasts` | GET | Get forecasts |
| `/api/restock-suggestions` | GET | Get suggestions |
| `/api/purchase-orders` | GET | Get orders |

## Success Indicators ✅

- ✅ Backend shows "Database seeded successfully!"
- ✅ Frontend loads without console errors
- ✅ Login redirects to dashboard
- ✅ Inventory page shows 15 items
- ✅ Can create/update/delete items
- ✅ Transactions can be recorded
- ✅ Alerts are displayed and actionable

## Project Structure
```
infosys2/
├── backend/                    # Spring Boot API
│   ├── src/main/java/          # Java source code
│   ├── src/main/resources/     # application.properties
│   └── pom.xml                 # Maven dependencies
│
└── finalFrontend_Infosys/      # React Frontend
    ├── src/
    │   ├── components/         # React components
    │   ├── services/           # API service
    │   └── App.tsx             # Main app
    └── package.json            # npm dependencies
```

## Support & Documentation

- 📖 **Backend API Docs**: `backend/README.md`
- 📖 **API Reference**: `backend/API_REFERENCE.md`
- 📖 **Setup Guide**: `SETUP_GUIDE.md`
- 📖 **Integration Status**: `FRONTEND_INTEGRATION_COMPLETE.md`

---

**Happy Coding! 🎉**
