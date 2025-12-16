package com.smartshelf.warehouse.controller;

import com.smartshelf.warehouse.entity.InventoryItem;
import com.smartshelf.warehouse.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllItems() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItemById(@PathVariable String id) {
        return ResponseEntity.ok(inventoryService.getItemById(id));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<InventoryItem> getItemBySku(@PathVariable String sku) {
        return ResponseEntity.ok(inventoryService.getItemBySku(sku));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<InventoryItem> createItem(@RequestBody InventoryItem item) {
        return ResponseEntity.ok(inventoryService.createItem(item));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<InventoryItem> updateItem(@PathVariable String id, @RequestBody InventoryItem item) {
        return ResponseEntity.ok(inventoryService.updateItem(id, item));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<InventoryItem>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(inventoryService.getItemsByCategory(category));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<InventoryItem>> getItemsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(inventoryService.getItemsByStatus(status));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<InventoryItem> updateStock(
            @PathVariable String id,
            @RequestBody Map<String, Object> request) {
        Integer quantity = (Integer) request.get("quantity");
        String operation = (String) request.get("operation");
        return ResponseEntity.ok(inventoryService.updateStock(id, quantity, operation));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<InventoryItem>> searchItems(@RequestParam String keyword) {
        return ResponseEntity.ok(inventoryService.searchItems(keyword));
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItem>> getLowStockItems() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }
    
    @GetMapping("/needing-restock")
    public ResponseEntity<List<InventoryItem>> getItemsNeedingRestock() {
        return ResponseEntity.ok(inventoryService.getItemsNeedingRestock());
    }
    
    @GetMapping("/auto-restock-enabled")
    public ResponseEntity<List<InventoryItem>> getItemsWithAutoRestock() {
        return ResponseEntity.ok(inventoryService.getItemsWithAutoRestock());
    }
    
    @GetMapping("/supplier/{supplier}")
    public ResponseEntity<List<InventoryItem>> getItemsBySupplier(@PathVariable String supplier) {
        return ResponseEntity.ok(inventoryService.getItemsBySupplier(supplier));
    }
}
