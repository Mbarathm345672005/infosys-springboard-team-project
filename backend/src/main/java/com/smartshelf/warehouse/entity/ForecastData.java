package com.smartshelf.warehouse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "forecast_data")
public class ForecastData {
    
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
    private Integer weeklyDemand;
    
    @Column(nullable = false)
    private Integer forecastedDemand;
    
    @Column(nullable = false)
    private Integer daysUntilStockout;
    
    @Column(nullable = false)
    private String action;
    
    private Integer predictedDemand; // Daily demand prediction from ML
    
    private Integer reorderPoint; // Calculated reorder point
    
    private Integer suggestedOrderQuantity; // ML suggested order quantity
    
    private Double confidenceScore; // ML model confidence (0-100)
    
    private String algorithm; // ML algorithm used
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;
    
    @Column(nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;
    
    public ForecastData() {}
    
    public ForecastData(String id, String sku, String productName, Integer currentStock, Integer weeklyDemand,
                       Integer forecastedDemand, Integer daysUntilStockout, String action, RiskLevel riskLevel,
                       LocalDateTime generatedAt, InventoryItem inventoryItem) {
        this.id = id;
        this.sku = sku;
        this.productName = productName;
        this.currentStock = currentStock;
        this.weeklyDemand = weeklyDemand;
        this.forecastedDemand = forecastedDemand;
        this.daysUntilStockout = daysUntilStockout;
        this.action = action;
        this.riskLevel = riskLevel;
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
    
    public Integer getWeeklyDemand() { return weeklyDemand; }
    public void setWeeklyDemand(Integer weeklyDemand) { this.weeklyDemand = weeklyDemand; }
    
    public Integer getForecastedDemand() { return forecastedDemand; }
    public void setForecastedDemand(Integer forecastedDemand) { this.forecastedDemand = forecastedDemand; }
    
    public Integer getDaysUntilStockout() { return daysUntilStockout; }
    public void setDaysUntilStockout(Integer daysUntilStockout) { this.daysUntilStockout = daysUntilStockout; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    
    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }
    
    public Integer getPredictedDemand() { return predictedDemand; }
    public void setPredictedDemand(Integer predictedDemand) { this.predictedDemand = predictedDemand; }
    
    public Integer getReorderPoint() { return reorderPoint; }
    public void setReorderPoint(Integer reorderPoint) { this.reorderPoint = reorderPoint; }
    
    public Integer getSuggestedOrderQuantity() { return suggestedOrderQuantity; }
    public void setSuggestedOrderQuantity(Integer suggestedOrderQuantity) { this.suggestedOrderQuantity = suggestedOrderQuantity; }
    
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }
    
    public enum RiskLevel {
        CRITICAL, HIGH, MEDIUM, LOW
    }
}
