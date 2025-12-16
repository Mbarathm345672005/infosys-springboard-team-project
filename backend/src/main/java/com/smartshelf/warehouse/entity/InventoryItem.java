package com.smartshelf.warehouse.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.smartshelf.warehouse.config.StatusDeserializer;
import com.smartshelf.warehouse.config.StatusSerializer;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String sku;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Integer minStock;
    
    @Column(nullable = false)
    private Integer maxStock;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(nullable = false)
    private String supplier;
    
    @Column(nullable = false)
    private LocalDate lastRestocked;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JsonSerialize(using = StatusSerializer.class)
    @JsonDeserialize(using = StatusDeserializer.class)
    private Status status;
    
    private Integer forecastDemand;
    
    @Column(nullable = false)
    private Boolean autoRestockEnabled = false;
    
    @Column(name = "created_by_user_id")
    private String createdByUserId;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public InventoryItem() {}
    
    public InventoryItem(String id, String name, String sku, String category, Integer quantity, Integer minStock, 
                         Integer maxStock, Double price, String supplier, LocalDate lastRestocked, Status status, 
                         Integer forecastDemand, Boolean autoRestockEnabled, String createdByUserId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.category = category;
        this.quantity = quantity;
        this.minStock = minStock;
        this.maxStock = maxStock;
        this.price = price;
        this.supplier = supplier;
        this.lastRestocked = lastRestocked;
        this.status = status;
        this.forecastDemand = forecastDemand;
        this.autoRestockEnabled = autoRestockEnabled;
        this.createdByUserId = createdByUserId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Integer getMinStock() { return minStock; }
    public void setMinStock(Integer minStock) { this.minStock = minStock; }
    
    public Integer getMaxStock() { return maxStock; }
    public void setMaxStock(Integer maxStock) { this.maxStock = maxStock; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }
    
    public LocalDate getLastRestocked() { return lastRestocked; }
    public void setLastRestocked(LocalDate lastRestocked) { this.lastRestocked = lastRestocked; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public Integer getForecastDemand() { return forecastDemand; }
    public void setForecastDemand(Integer forecastDemand) { this.forecastDemand = forecastDemand; }
    
    public Boolean getAutoRestockEnabled() { return autoRestockEnabled; }
    public void setAutoRestockEnabled(Boolean autoRestockEnabled) { this.autoRestockEnabled = autoRestockEnabled; }
    
    public String getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(String createdByUserId) { this.createdByUserId = createdByUserId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public enum Status {
        IN_STOCK("In Stock"),
        LOW_STOCK("Low Stock"),
        OUT_OF_STOCK("Out of Stock"),
        OVERSTOCKED("Overstocked");
        
        private final String displayName;
        
        Status(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}
