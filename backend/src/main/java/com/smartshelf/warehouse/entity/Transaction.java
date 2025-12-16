package com.smartshelf.warehouse.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.smartshelf.warehouse.util.TransactionTypeSerializer;
import com.smartshelf.warehouse.util.TransactionTypeDeserializer;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JsonSerialize(using = TransactionTypeSerializer.class)
    @JsonDeserialize(using = TransactionTypeDeserializer.class)
    private Type type;
    
    @Column(nullable = false)
    private String productName;
    
    @Column(nullable = false)
    private String sku;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private String handledBy;
    
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
    
    @Column(nullable = false)
    private String reference;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;
    
    public Transaction() {}
    
    public Transaction(String id, Type type, String productName, String sku, Integer quantity, String handledBy,
                       LocalDateTime timestamp, String reference, String notes, User user, InventoryItem inventoryItem) {
        this.id = id;
        this.type = type;
        this.productName = productName;
        this.sku = sku;
        this.quantity = quantity;
        this.handledBy = handledBy;
        this.timestamp = timestamp;
        this.reference = reference;
        this.notes = notes;
        this.user = user;
        this.inventoryItem = inventoryItem;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getHandledBy() { return handledBy; }
    public void setHandledBy(String handledBy) { this.handledBy = handledBy; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }
    
    public enum Type {
        STOCK_IN("Stock-In"),
        STOCK_OUT("Stock-Out");
        
        private final String displayName;
        
        Type(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}
