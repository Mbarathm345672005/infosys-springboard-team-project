package com.smartshelf.warehouse.repository;

import com.smartshelf.warehouse.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {
    Optional<InventoryItem> findBySku(String sku);
    List<InventoryItem> findByCategory(String category);
    List<InventoryItem> findByStatus(InventoryItem.Status status);
    boolean existsBySku(String sku);
    
    // Search functionality
    @Query("SELECT i FROM InventoryItem i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.sku) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<InventoryItem> searchItems(@Param("keyword") String keyword);
    
    // Items needing restock
    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.minStock")
    List<InventoryItem> findItemsNeedingRestock();
    
    // Items with auto-restock enabled
    List<InventoryItem> findByAutoRestockEnabledTrue();
    
    // Items by supplier
    List<InventoryItem> findBySupplier(String supplier);
}
