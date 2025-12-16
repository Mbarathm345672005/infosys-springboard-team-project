package com.smartshelf.warehouse.config;

import com.smartshelf.warehouse.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Data Initializer for SmartShelf Warehouse Management System
 * 
 * This application runs on REAL DATA ONLY.
 * No dummy data is created - all data must be entered by users through the UI.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            PurchaseOrderRepository purchaseOrderRepository,
            AlertRepository alertRepository,
            RestockSuggestionRepository restockSuggestionRepository,
            InventoryItemRepository inventoryItemRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository) {
        
        return args -> {
            System.out.println("====================================================");
            System.out.println("SmartShelf Warehouse Management System - Ready");
            System.out.println("Running in REAL DATA MODE");
            System.out.println("No dummy data loaded - Use the UI to create data");
            System.out.println("====================================================");
        };
    }
}
