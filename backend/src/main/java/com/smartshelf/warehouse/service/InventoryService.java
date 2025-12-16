package com.smartshelf.warehouse.service;

import com.smartshelf.warehouse.entity.InventoryItem;
import com.smartshelf.warehouse.entity.User;
import com.smartshelf.warehouse.repository.InventoryItemRepository;
import com.smartshelf.warehouse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryItemRepository inventoryItemRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<InventoryItem> getAllItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // If user role is USER, only show items created by ADMIN or WAREHOUSE_MANAGER
        if (currentUser.getRole() == User.Role.USER) {
            // Get all ADMIN and WAREHOUSE_MANAGER user IDs
            List<User> admins = userRepository.findByRole(User.Role.ADMIN);
            List<User> managers = userRepository.findByRole(User.Role.WAREHOUSE_MANAGER);
            
            List<String> adminManagerIds = new ArrayList<>();
            admins.forEach(u -> adminManagerIds.add(u.getId()));
            managers.forEach(u -> adminManagerIds.add(u.getId()));
            
            return inventoryItemRepository.findAll().stream()
                .filter(item -> {
                    // Show items with no createdByUserId (for backward compatibility)
                    if (item.getCreatedByUserId() == null) {
                        return true;
                    }
                    // Only show items created by ADMIN or WAREHOUSE_MANAGER
                    return adminManagerIds.contains(item.getCreatedByUserId());
                })
                .collect(Collectors.toList());
        }
        
        // ADMIN and WAREHOUSE_MANAGER can see all items
        return inventoryItemRepository.findAll();
    }

    public InventoryItem getItemById(String id) {
        return inventoryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));
    }

    public InventoryItem getItemBySku(String sku) {
        return inventoryItemRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));
    }

    public InventoryItem createItem(InventoryItem item) {
        if (inventoryItemRepository.existsBySku(item.getSku())) {
            throw new RuntimeException("SKU already exists");
        }
        
        // Set the createdByUserId from the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        item.setCreatedByUserId(currentUser.getId());
        
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        item.setStatus(calculateStatus(item));
        return inventoryItemRepository.save(item);
    }

    public InventoryItem updateItem(String id, InventoryItem itemDetails) {
        InventoryItem item = getItemById(id);
        
        item.setName(itemDetails.getName());
        item.setCategory(itemDetails.getCategory());
        item.setQuantity(itemDetails.getQuantity());
        item.setMinStock(itemDetails.getMinStock());
        item.setMaxStock(itemDetails.getMaxStock());
        item.setPrice(itemDetails.getPrice());
        item.setSupplier(itemDetails.getSupplier());
        item.setAutoRestockEnabled(itemDetails.getAutoRestockEnabled());
        item.setForecastDemand(itemDetails.getForecastDemand());
        item.setUpdatedAt(LocalDateTime.now());
        item.setStatus(calculateStatus(item));

        return inventoryItemRepository.save(item);
    }

    public void deleteItem(String id) {
        InventoryItem item = getItemById(id);
        inventoryItemRepository.delete(item);
    }

    public List<InventoryItem> getItemsByCategory(String category) {
        return inventoryItemRepository.findByCategory(category);
    }

    public List<InventoryItem> getItemsByStatus(String status) {
        InventoryItem.Status statusEnum = InventoryItem.Status.valueOf(status.toUpperCase().replace(" ", "_"));
        return inventoryItemRepository.findByStatus(statusEnum);
    }

    public InventoryItem updateStock(String id, Integer quantity, String operation) {
        InventoryItem item = getItemById(id);
        
        if ("add".equalsIgnoreCase(operation)) {
            item.setQuantity(item.getQuantity() + quantity);
            item.setLastRestocked(LocalDate.now());
        } else if ("remove".equalsIgnoreCase(operation)) {
            if (item.getQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock");
            }
            item.setQuantity(item.getQuantity() - quantity);
        }
        
        item.setUpdatedAt(LocalDateTime.now());
        item.setStatus(calculateStatus(item));
        
        return inventoryItemRepository.save(item);
    }

    private InventoryItem.Status calculateStatus(InventoryItem item) {
        if (item.getQuantity() == 0) {
            return InventoryItem.Status.OUT_OF_STOCK;
        } else if (item.getQuantity() < item.getMinStock()) {
            return InventoryItem.Status.LOW_STOCK;
        } else if (item.getQuantity() > item.getMaxStock()) {
            return InventoryItem.Status.OVERSTOCKED;
        } else {
            return InventoryItem.Status.IN_STOCK;
        }
    }
    
    public List<InventoryItem> searchItems(String keyword) {
        return inventoryItemRepository.searchItems(keyword);
    }
    
    public List<InventoryItem> getItemsNeedingRestock() {
        return inventoryItemRepository.findItemsNeedingRestock();
    }
    
    public List<InventoryItem> getItemsWithAutoRestock() {
        return inventoryItemRepository.findByAutoRestockEnabledTrue();
    }
    
    public List<InventoryItem> getItemsBySupplier(String supplier) {
        return inventoryItemRepository.findBySupplier(supplier);
    }
    
    public List<InventoryItem> getLowStockItems() {
        return inventoryItemRepository.findByStatus(InventoryItem.Status.LOW_STOCK);
    }
}
