package com.smartshelf.warehouse.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, unique = true)
    private String poNumber;
    
    @Column(nullable = false)
    private String supplier;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String items; // JSON array of item names
    
    @Column(nullable = false)
    private Integer totalQuantity;
    
    @Column(nullable = false)
    private Double totalCost;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Column(nullable = false)
    private LocalDate createdDate = LocalDate.now();
    
    @Column(nullable = false)
    private LocalDate expectedDelivery;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;
    
    public PurchaseOrder() {}
    
    public PurchaseOrder(String id, String poNumber, String supplier, String items, Integer totalQuantity,
                         Double totalCost, Status status, LocalDate createdDate, LocalDate expectedDelivery,
                         String notes, LocalDateTime createdAt, LocalDateTime updatedAt, User createdBy) {
        this.id = id;
        this.poNumber = poNumber;
        this.supplier = supplier;
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalCost = totalCost;
        this.status = status;
        this.createdDate = createdDate;
        this.expectedDelivery = expectedDelivery;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }
    
    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }
    
    public String getItems() { return items; }
    public void setItems(String items) { this.items = items; }
    
    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }
    
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
    
    public LocalDate getExpectedDelivery() { return expectedDelivery; }
    public void setExpectedDelivery(LocalDate expectedDelivery) { this.expectedDelivery = expectedDelivery; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    
    public enum Status {
        DRAFT, SENT, APPROVED, DELIVERED, CANCELLED
    }
}
