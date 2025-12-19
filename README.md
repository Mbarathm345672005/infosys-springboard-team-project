# SmartShelf AI Warehouse Management System

**Developer:** Mayurima Sarkar  
**Branch:** Mayurima_Sarkar  
**Project Type:** Full-Stack Warehouse Management System with AI/ML Forecasting

## 📋 Project Overview

SmartShelf is an intelligent warehouse management system that leverages AI and machine learning to optimize inventory management, predict demand, and automate restocking processes. The system provides real-time analytics, smart alerts, and forecasting capabilities to help businesses efficiently manage their warehouse operations.

## 🏗️ Architecture

### Backend
- **Framework:** Spring Boot (Java)
- **Database:** JPA/Hibernate
- **Security:** JWT Authentication
- **API:** RESTful Web Services
- **Location:** `backend/`

### Frontend
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **UI Library:** Custom components with shadcn/ui
- **Location:** `finalFrontend_Infosys/`

## ✨ Key Features

### 1. **Inventory Management**
- Real-time inventory tracking
- Stock level monitoring
- Multi-status item management (IN_STOCK, LOW_STOCK, OUT_OF_STOCK, DISCONTINUED)
- Automatic low stock alerts

### 2. **AI-Powered Forecasting**
- Machine Learning-based demand prediction
- Risk level assessment (LOW, MEDIUM, HIGH, CRITICAL)
- Automated restock suggestions with priority levels
- Trend analysis and seasonal pattern detection

### 3. **Smart Alerts & Notifications**
- Real-time alerts for low stock, expiring items, and system events
- Severity-based categorization (INFO, WARNING, CRITICAL)
- Alert type classification (STOCK, EXPIRY, SYSTEM, FORECAST)

### 4. **Transaction Management**
- Complete transaction history tracking
- Transaction types: IN, OUT, TRANSFER, ADJUSTMENT
- Automated stock updates on transactions

### 5. **Purchase Order System**
- Automated purchase order generation
- Order status tracking (PENDING, APPROVED, ORDERED, RECEIVED, CANCELLED)
- Supplier management

### 6. **Analytics Dashboard**
- Real-time warehouse metrics
- Visual data representation
- Forecast visualization
- Performance indicators

### 7. **User Authentication & Authorization**
- Secure JWT-based authentication
- Role-based access control (ADMIN, MANAGER, STAFF)
- User profile management

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL or PostgreSQL database

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartshelf
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd finalFrontend_Infosys
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
infosys2/
├── backend/
│   ├── src/main/java/com/smartshelf/warehouse/
│   │   ├── controller/       # REST API endpoints
│   │   ├── service/          # Business logic & ML services
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Data access layer
│   │   ├── security/         # JWT & authentication
│   │   ├── config/           # Application configuration
│   │   └── dto/              # Data transfer objects
│   └── pom.xml
├── finalFrontend_Infosys/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API integration
│   │   └── styles/           # CSS styles
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new item
- `PUT /api/inventory/{id}` - Update item
- `DELETE /api/inventory/{id}` - Delete item

### Forecasting
- `GET /api/forecast` - Get demand forecasts
- `GET /api/forecast/item/{itemId}` - Get forecast for specific item

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts/mark-read/{id}` - Mark alert as read

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions` - Create new transaction

### Restock
- `GET /api/restock/suggestions` - Get restock suggestions
- `POST /api/restock/approve/{id}` - Approve restock suggestion

### Purchase Orders
- `GET /api/purchase-orders` - Get all purchase orders
- `POST /api/purchase-orders` - Create purchase order
- `PUT /api/purchase-orders/{id}/status` - Update order status

## 🤖 Machine Learning Features

The ML Forecasting Service (`MLForecastingService.java`) implements:
- **Time-series analysis** for demand prediction
- **Seasonal pattern detection** using moving averages
- **Trend analysis** for growth/decline identification
- **Risk assessment** based on historical data
- **Confidence scoring** for predictions

## 🛡️ Security Features

- JWT token-based authentication
- Password encryption using BCrypt
- Role-based access control
- CORS configuration for frontend integration
- Secure API endpoints

## 📊 Technologies Used

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- JWT (io.jsonwebtoken)
- MySQL/PostgreSQL
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- React Router
- Tailwind CSS
- shadcn/ui components

## 📝 Additional Documentation

- [Backend API Reference](backend/API_REFERENCE.md)
- [Frontend Setup Guide](finalFrontend_Infosys/SETUP_GUIDE.md)
- [Frontend Quick Start](finalFrontend_Infosys/QUICKSTART.md)
- [Integration Guide](finalFrontend_Infosys/FRONTEND_INTEGRATION_COMPLETE.md)

## 👨‍💻 Development

This project was developed as part of the Infosys Springboard internship team project.

### Contribution Guidelines
1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📧 Contact

**Developer:** Mayurima Sarkar  
**GitHub:** [@Mayurima28](https://github.com/Mayurima28)

## 📄 License

This project is part of an internship assignment.

---

**Note:** This is a branch-specific implementation. For the complete team project, please refer to the main branch.
