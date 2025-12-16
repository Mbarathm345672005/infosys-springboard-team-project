# SmartShelf Warehouse Management System - Backend

A comprehensive Spring Boot REST API backend for managing warehouse inventory with AI-powered forecasting and automated restocking.

## 🚀 Features

- **User Authentication & Authorization** (JWT-based with role management)
- **Inventory Management** (CRUD operations with stock tracking)
- **Transaction History** (Stock-in/Stock-out tracking)
- **AI Forecasting** (Demand prediction and stockout analysis)
- **Auto-Restock Suggestions** (AI-powered purchase recommendations)
- **Purchase Orders** (Supplier order management)
- **Real-time Alerts** (Low stock, out of stock notifications)
- **Role-Based Access Control** (Admin, Warehouse Manager, User)

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0+
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Java Version**: 17

## 📋 Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6+ (or use included Maven wrapper)

## ⚙️ Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE smartshelf_db;
```

**Note**: The application will automatically create tables on first run.

### 2. Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartshelf_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 3. Build and Run

From the backend directory:

```powershell
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Or use the Maven wrapper (if available):

```powershell
.\mvnw spring-boot:run
```

The server will start on **http://localhost:8080/api**

## 👥 Test Users

The application seeds initial test users on first startup:

| Email | Password | Role |
|-------|----------|------|
| admin@smartshelf.com | admin123 | Admin |
| manager@smartshelf.com | manager123 | Warehouse Manager |
| user@smartshelf.com | user123 | User |

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/{id}` - Get item by ID
- `GET /api/inventory/sku/{sku}` - Get item by SKU
- `POST /api/inventory` - Create new item (Admin/Manager)
- `PUT /api/inventory/{id}` - Update item (Admin/Manager)
- `DELETE /api/inventory/{id}` - Delete item (Admin only)
- `PATCH /api/inventory/{id}/stock` - Update stock quantity

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/{id}` - Get transaction by ID
- `GET /api/transactions/sku/{sku}` - Get transactions by SKU
- `POST /api/transactions` - Create transaction (Admin/Manager)

### Alerts & Notifications
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/unread` - Get unread alerts
- `PATCH /api/alerts/{id}/read` - Mark alert as read
- `PATCH /api/alerts/{id}/dismiss` - Dismiss alert

### AI Forecasting
- `GET /api/forecasts` - Get all forecasts
- `GET /api/forecasts/sku/{sku}` - Get forecast by SKU
- `GET /api/forecasts/risk-level/{level}` - Get forecasts by risk
- `POST /api/forecasts` - Create forecast (Admin/Manager)

### Restock Suggestions
- `GET /api/restock-suggestions` - Get all suggestions
- `GET /api/restock-suggestions/priority/{priority}` - Filter by priority
- `POST /api/restock-suggestions` - Create suggestion (Admin/Manager)

### Purchase Orders
- `GET /api/purchase-orders` - Get all purchase orders
- `GET /api/purchase-orders/{id}` - Get order by ID
- `POST /api/purchase-orders` - Create order (Admin/Manager)
- `PUT /api/purchase-orders/{id}` - Update order (Admin/Manager)
- `PATCH /api/purchase-orders/{id}/status` - Update order status

## 🔐 Authentication

All API endpoints (except `/api/auth/**`) require JWT authentication.

**Request Header**:
```
Authorization: Bearer <your_jwt_token>
```

**Login Example**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@smartshelf.com",
    "password": "admin123"
  }'
```

## 🌐 CORS Configuration

The backend is configured to accept requests from:
- http://localhost:3000
- http://localhost:5173
- http://localhost:5174

Update `SecurityConfig.java` to add more origins if needed.

## 📊 Database Schema

### Main Tables
- `users` - User accounts and authentication
- `inventory_items` - Product inventory data
- `transactions` - Stock movement history
- `alerts` - System notifications
- `forecast_data` - AI predictions
- `restock_suggestions` - Auto-restock recommendations
- `purchase_orders` - Supplier orders

## 🔧 Configuration

Key configuration properties in `application.properties`:

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smartshelf_db
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# Logging
logging.level.com.smartshelf=DEBUG
```

## 🧪 Testing

Run tests with:

```powershell
mvn test
```

## 📦 Production Build

Create a production JAR:

```powershell
mvn clean package
java -jar target/warehouse-backend-1.0.0.jar
```

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Change port in application.properties
server.port=8081
```

### MySQL Connection Issues
- Verify MySQL service is running
- Check username/password in application.properties
- Ensure database exists

### JWT Token Issues
- Token expires after 24 hours by default
- Update `jwt.expiration` in application.properties

## 📝 Project Structure

```
backend/
├── src/main/java/com/smartshelf/warehouse/
│   ├── config/          # Security & CORS config
│   ├── controller/      # REST endpoints
│   ├── dto/             # Data transfer objects
│   ├── entity/          # JPA entities
│   ├── repository/      # Data access layer
│   ├── security/        # JWT & authentication
│   ├── service/         # Business logic
│   └── WarehouseApplication.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
