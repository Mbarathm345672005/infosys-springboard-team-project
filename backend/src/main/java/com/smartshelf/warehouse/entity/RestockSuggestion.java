package com.smartshelf.warehouse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "restock_suggestions")
public class RestockSuggestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String sku;
    
    @Column(nullable = false)
    private String productName;
    
    @Column(nullable = false)
    private Integer currentStock;
    
    @Column(nullable = false)
    private Integer minStock;
    
    @Column(nullable = false)
    private Integer suggestedQuantity;
    
    @Column(nullable = false)
    private String supplier;
    
    @Column(nullable = false)
    private Double estimatedCost;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    @Column(nullable = false)
    private Integer aiConfidence;
    
    @Column(nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;
    
    public RestockSuggestion() {}
    
    public RestockSuggestion(String id, String sku, String productName, Integer currentStock, Integer minStock,
                            Integer suggestedQuantity, String supplier, Double estimatedCost, Priority priority,
                            Integer aiConfidence, LocalDateTime generatedAt, InventoryItem inventoryItem) {
        this.id = id;
        this.sku = sku;
        this.productName = productName;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.suggestedQuantity = suggestedQuantity;
        this.supplier = supplier;
        this.estimatedCost = estimatedCost;
        this.priority = priority;
        this.aiConfidence = aiConfidence;
        this.generatedAt = generatedAt;
        this.inventoryItem = inventoryItem;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }
    
    public Integer getMinStock() { return minStock; }
    public void setMinStock(Integer minStock) { this.minStock = minStock; }
    
    public Integer getSuggestedQuantity() { return suggestedQuantity; }
    public void setSuggestedQuantity(Integer suggestedQuantity) { this.suggestedQuantity = suggestedQuantity; }
    
    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }
    
    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
    
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    
    public Integer getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(Integer aiConfidence) { this.aiConfidence = aiConfidence; }
    
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    
    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }
    
    public enum Priority {
        HIGH, MEDIUM, LOW
    }
}
