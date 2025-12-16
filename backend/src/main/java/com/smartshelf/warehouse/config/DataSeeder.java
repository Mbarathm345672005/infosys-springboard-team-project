package com.smartshelf.warehouse.config;

import com.smartshelf.warehouse.entity.*;
import com.smartshelf.warehouse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private AlertRepository alertRepository;
    
    @Autowired
    private ForecastDataRepository forecastDataRepository;
    
    @Autowired
    private RestockSuggestionRepository restockSuggestionRepository;
    
    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Override
    public void run(String... args) throws Exception {
        // Skip if data already exists
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("🌱 Seeding database with initial data...");

        // Create admin user
        User admin = new User();
        admin.setFullName("Admin User");
        admin.setEmail("admin@smartshelf.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setCompanyName("SmartShelf Inc.");
        admin.setContactNumber("+1-555-0100");
        admin.setRole(User.Role.ADMIN);
        admin.setWarehouseLocation("New York, NY");
        userRepository.save(admin);

        // Create warehouse manager
        User manager = new User();
        manager.setFullName("John Smith");
        manager.setEmail("manager@smartshelf.com");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setCompanyName("SmartShelf Inc.");
        manager.setContactNumber("+1-555-0101");
        manager.setRole(User.Role.WAREHOUSE_MANAGER);
        manager.setWarehouseLocation("New York, NY");
        userRepository.save(manager);

        // Create regular user
        User user = new User();
        user.setFullName("Jane Doe");
        user.setEmail("user@smartshelf.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setCompanyName("SmartShelf Inc.");
        user.setContactNumber("+1-555-0102");
        user.setRole(User.Role.USER);
        user.setWarehouseLocation("New York, NY");
        userRepository.save(user);

        // Create inventory items created by admin (so regular users can see them)
        InventoryItem[] items = {
            createItem("Ballpoint Pen Blue", "BP-001-BL", "Writing Instruments", 145, 100, 500, 0.50, "Pen Masters Ltd.", "2025-01-20", 180, true, admin.getId()),
            createItem("Gel Pen Black", "GP-002-BK", "Writing Instruments", 65, 80, 400, 0.75, "Pen Masters Ltd.", "2025-01-18", 120, true, admin.getId()),
            createItem("Mechanical Pencil 0.5mm", "MP-003-05", "Writing Instruments", 0, 50, 250, 1.25, "Pen Masters Ltd.", "2025-01-10", 90, true, admin.getId()),
            createItem("Highlighter Yellow", "HL-004-YL", "Writing Instruments", 220, 60, 200, 0.85, "ColorMark Inc.", "2025-01-22", 95, false, admin.getId()),
            createItem("Notebook Ruled", "NB-005-RL", "Paper Products", 85, 50, 300, 2.50, "Paper World Co.", "2025-01-19", 110, true, admin.getId()),
            createItem("A4 Paper Pack", "A4-006-80", "Paper Products", 28, 40, 200, 4.99, "Paper World Co.", "2025-01-15", 75, true, manager.getId()),
            createItem("Sticky Notes 3x3", "SN-007-33", "Paper Products", 150, 80, 400, 1.50, "Office Essentials Ltd.", "2025-01-21", 125, true, manager.getId()),
            createItem("Stapler Medium", "ST-008-MD", "Office Supplies", 42, 30, 150, 5.99, "Office Essentials Ltd.", "2025-01-20", 55, true, manager.getId()),
            createItem("Stapler Pins No.10", "SP-009-10", "Office Supplies", 320, 200, 1000, 0.99, "Office Essentials Ltd.", "2025-01-18", 280, true, manager.getId()),
            createItem("Scissors Office", "SC-010-OF", "Office Supplies", 15, 25, 100, 3.50, "Craft Masters Inc.", "2025-01-12", 40, true, admin.getId()),
            createItem("File Folder Plastic", "FF-011-PL", "Filing & Organization", 95, 60, 250, 1.99, "Office Organizers Co.", "2025-01-21", 85, true, admin.getId()),
            createItem("Binder Clips 19mm", "BC-012-19", "Filing & Organization", 180, 100, 500, 0.25, "Office Organizers Co.", "2025-01-19", 150, true, admin.getId()),
            createItem("USB Drive 32GB", "USB-013-32", "Computer Accessories", 35, 20, 100, 12.99, "Tech Store Pro", "2025-01-20", 45, true, manager.getId()),
            createItem("Printer Ink Black", "INK-014-BK", "Computer Accessories", 8, 15, 60, 24.99, "Tech Store Pro", "2025-01-16", 25, true, manager.getId()),
            createItem("Color Pencils 24-pack", "CP-015-24", "Art & Craft", 55, 40, 200, 8.99, "Craft Masters Inc.", "2025-01-19", 70, true, admin.getId())
        };

        for (InventoryItem item : items) {
            inventoryItemRepository.save(item);
        }
        
        // Create transactions
        Transaction[] transactions = {
            createTransaction(Transaction.Type.STOCK_IN, items[0].getSku(), items[0].getName(), 50, manager, manager.getFullName(), "PO-2024-001", "Initial stock received", items[0]),
            createTransaction(Transaction.Type.STOCK_IN, items[5].getSku(), items[5].getName(), 30, admin, admin.getFullName(), "PO-2024-002", "Restocking A4 paper", items[5]),
            createTransaction(Transaction.Type.STOCK_OUT, items[2].getSku(), items[2].getName(), 50, manager, manager.getFullName(), "SO-2024-001", "Out of stock - pending reorder", items[2]),
            createTransaction(Transaction.Type.STOCK_IN, items[12].getSku(), items[12].getName(), 15, manager, manager.getFullName(), "PO-2024-003", "USB drives restocked", items[12]),
            createTransaction(Transaction.Type.STOCK_OUT, items[1].getSku(), items[1].getName(), 15, admin, admin.getFullName(), "SO-2024-002", "Dispatch to warehouse B", items[1]),
            createTransaction(Transaction.Type.STOCK_IN, items[8].getSku(), items[8].getName(), 120, manager, manager.getFullName(), "PO-2024-004", "Stapler pins bulk order", items[8]),
            createTransaction(Transaction.Type.STOCK_OUT, items[9].getSku(), items[9].getName(), 10, admin, admin.getFullName(), "SO-2024-003", "Office supply request", items[9])
        };
        
        for (Transaction transaction : transactions) {
            transactionRepository.save(transaction);
        }
        
        // Create alerts
        Alert[] alerts = {
            createAlert(Alert.Type.LOW_STOCK, Alert.Severity.HIGH, "Low Stock Alert", "Mechanical Pencil 0.5mm is out of stock", items[2].getSku(), user, false),
            createAlert(Alert.Type.LOW_STOCK, Alert.Severity.MEDIUM, "Low Stock Warning", "Scissors Office stock is below minimum threshold", items[9].getSku(), user, false),
            createAlert(Alert.Type.RESTOCK_REQUIRED, Alert.Severity.HIGH, "Restock Required", "Printer Ink Black needs immediate restocking", items[13].getSku(), user, false),
            createAlert(Alert.Type.OUT_OF_STOCK, Alert.Severity.LOW, "Stock Notice", "Stapler Pins No.10 stock update", items[8].getSku(), user, true)
        };
        
        for (Alert alert : alerts) {
            alertRepository.save(alert);
        }
        
        // Create forecast data
        ForecastData[] forecasts = {
            createForecast(items[2].getSku(), items[2].getName(), 0, 90, 10, 0, ForecastData.RiskLevel.HIGH, "Immediate restock required", items[2]),
            createForecast(items[9].getSku(), items[9].getName(), 15, 40, 8, 5, ForecastData.RiskLevel.HIGH, "Restock within 5 days", items[9]),
            createForecast(items[13].getSku(), items[13].getName(), 8, 25, 5, 4, ForecastData.RiskLevel.MEDIUM, "Monitor closely", items[13]),
            createForecast(items[5].getSku(), items[5].getName(), 28, 75, 12, 6, ForecastData.RiskLevel.LOW, "Stock adequate", items[5]),
            createForecast(items[0].getSku(), items[0].getName(), 145, 180, 25, 15, ForecastData.RiskLevel.LOW, "Stock healthy", items[0])
        };
        
        for (ForecastData forecast : forecasts) {
            forecastDataRepository.save(forecast);
        }
        
        // Create restock suggestions
        RestockSuggestion[] suggestions = {
            createRestockSuggestion(items[2].getSku(), items[2].getName(), 0, 50, 250, items[2].getSupplier(), RestockSuggestion.Priority.HIGH, 312.50, 95, items[2]),
            createRestockSuggestion(items[9].getSku(), items[9].getName(), 15, 25, 75, items[9].getSupplier(), RestockSuggestion.Priority.MEDIUM, 262.50, 88, items[9]),
            createRestockSuggestion(items[13].getSku(), items[13].getName(), 8, 15, 47, items[13].getSupplier(), RestockSuggestion.Priority.MEDIUM, 1174.53, 92, items[13]),
            createRestockSuggestion(items[5].getSku(), items[5].getName(), 28, 40, 172, items[5].getSupplier(), RestockSuggestion.Priority.LOW, 858.28, 85, items[5])
        };
        
        for (RestockSuggestion suggestion : suggestions) {
            restockSuggestionRepository.save(suggestion);
        }
        
        // Create purchase orders
        PurchaseOrder[] orders = {
            createPurchaseOrder("PO-2025-001", "Pen Masters Ltd.", 
                "[{\"sku\":\"MP-003-05\",\"name\":\"Mechanical Pencil 0.5mm\",\"quantity\":250,\"price\":1.25}]", 
                250, 312.50, PurchaseOrder.Status.DRAFT, LocalDate.of(2025, 12, 10), 
                LocalDate.of(2025, 12, 15), "Urgent restock for mechanical pencils", admin),
            createPurchaseOrder("PO-2025-002", "Office Essentials Ltd.", 
                "[{\"sku\":\"ST-008-MD\",\"name\":\"Stapler Medium\",\"quantity\":75,\"price\":5.99},{\"sku\":\"SN-007-33\",\"name\":\"Sticky Notes 3x3\",\"quantity\":100,\"price\":1.50}]", 
                175, 599.25, PurchaseOrder.Status.APPROVED, LocalDate.of(2025, 12, 12), 
                LocalDate.of(2025, 12, 18), "Regular office supplies restocking", manager),
            createPurchaseOrder("PO-2025-003", "Tech Store Pro", 
                "[{\"sku\":\"INK-014-BK\",\"name\":\"Printer Ink Black\",\"quantity\":47,\"price\":24.99}]", 
                47, 1174.53, PurchaseOrder.Status.DELIVERED, LocalDate.of(2025, 12, 5), 
                LocalDate.of(2025, 12, 10), "Printer consumables order", admin)
        };
        
        for (PurchaseOrder order : orders) {
            purchaseOrderRepository.save(order);
        }

        System.out.println("✅ Database seeded successfully!");
        System.out.println("📧 Admin: admin@smartshelf.com / admin123");
        System.out.println("📧 Manager: manager@smartshelf.com / manager123");
        System.out.println("📧 User: user@smartshelf.com / user123");
    }

    private InventoryItem createItem(String name, String sku, String category, int quantity, 
                                      int minStock, int maxStock, double price, String supplier,
                                      String lastRestocked, int forecastDemand, boolean autoRestock, String createdByUserId) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setSku(sku);
        item.setCategory(category);
        item.setQuantity(quantity);
        item.setMinStock(minStock);
        item.setMaxStock(maxStock);
        item.setPrice(price);
        item.setSupplier(supplier);
        item.setLastRestocked(LocalDate.parse(lastRestocked));
        item.setForecastDemand(forecastDemand);
        item.setAutoRestockEnabled(autoRestock);
        item.setCreatedByUserId(createdByUserId);
        
        // Calculate status
        if (quantity == 0) {
            item.setStatus(InventoryItem.Status.OUT_OF_STOCK);
        } else if (quantity < minStock) {
            item.setStatus(InventoryItem.Status.LOW_STOCK);
        } else if (quantity > maxStock) {
            item.setStatus(InventoryItem.Status.OVERSTOCKED);
        } else {
            item.setStatus(InventoryItem.Status.IN_STOCK);
        }
        
        return item;
    }
    
    private Transaction createTransaction(Transaction.Type type, String sku, String productName, 
                                         int quantity, User user, String handledBy, 
                                         String reference, String notes, InventoryItem inventoryItem) {
        Transaction transaction = new Transaction();
        transaction.setType(type);
        transaction.setSku(sku);
        transaction.setProductName(productName);
        transaction.setQuantity(quantity);
        transaction.setUser(user);
        transaction.setHandledBy(handledBy);
        transaction.setReference(reference);
        transaction.setNotes(notes);
        transaction.setInventoryItem(inventoryItem);
        transaction.setTimestamp(LocalDateTime.now().minusDays((long)(Math.random() * 30)));
        return transaction;
    }
    
    private Alert createAlert(Alert.Type type, Alert.Severity severity, String title, 
                             String message, String productSku, User user, boolean isDismissed) {
        Alert alert = new Alert();
        alert.setType(type);
        alert.setSeverity(severity);
        alert.setTitle(title);
        alert.setMessage(message);
        alert.setProductSKU(productSku);
        alert.setUser(user);
        alert.setIsRead(false);
        alert.setIsDismissed(isDismissed);
        alert.setTimestamp(LocalDateTime.now().minusHours((long)(Math.random() * 48)));
        return alert;
    }
    
    private ForecastData createForecast(String sku, String productName, int currentStock, 
                                       int forecastedDemand, int weeklyDemand, int daysUntilStockout,
                                       ForecastData.RiskLevel riskLevel, String action, InventoryItem inventoryItem) {
        ForecastData forecast = new ForecastData();
        forecast.setSku(sku);
        forecast.setProductName(productName);
        forecast.setCurrentStock(currentStock);
        forecast.setForecastedDemand(forecastedDemand);
        forecast.setWeeklyDemand(weeklyDemand);
        forecast.setDaysUntilStockout(daysUntilStockout);
        forecast.setRiskLevel(riskLevel);
        forecast.setAction(action);
        forecast.setInventoryItem(inventoryItem);
        forecast.setGeneratedAt(LocalDateTime.now());
        return forecast;
    }
    
    private RestockSuggestion createRestockSuggestion(String sku, String productName, int currentStock,
                                                      int minStock, int suggestedQuantity, String supplier,
                                                      RestockSuggestion.Priority priority, double estimatedCost, 
                                                      int aiConfidence, InventoryItem inventoryItem) {
        RestockSuggestion suggestion = new RestockSuggestion();
        suggestion.setSku(sku);
        suggestion.setProductName(productName);
        suggestion.setCurrentStock(currentStock);
        suggestion.setMinStock(minStock);
        suggestion.setSuggestedQuantity(suggestedQuantity);
        suggestion.setSupplier(supplier);
        suggestion.setPriority(priority);
        suggestion.setEstimatedCost(estimatedCost);
        suggestion.setAiConfidence(aiConfidence);
        suggestion.setInventoryItem(inventoryItem);
        suggestion.setGeneratedAt(LocalDateTime.now());
        return suggestion;
    }
    
    private PurchaseOrder createPurchaseOrder(String poNumber, String supplier, String items, 
                                              int totalQuantity, double totalCost, 
                                              PurchaseOrder.Status status, LocalDate createdDate, 
                                              LocalDate expectedDelivery, String notes, User createdBy) {
        PurchaseOrder po = new PurchaseOrder();
        po.setPoNumber(poNumber);
        po.setSupplier(supplier);
        po.setItems(items);
        po.setTotalQuantity(totalQuantity);
        po.setTotalCost(totalCost);
        po.setStatus(status);
        po.setCreatedDate(createdDate);
        po.setExpectedDelivery(expectedDelivery);
        po.setNotes(notes);
        po.setCreatedBy(createdBy);
        return po;
    }
}
