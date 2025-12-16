package com.smartshelf.warehouse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Severity severity;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    private String productSKU;
    
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
    
    @Column(nullable = false)
    private Boolean isRead = false;
    
    @Column(nullable = false)
    private Boolean isDismissed = false;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    public Alert() {}
    
    public Alert(String id, Type type, Severity severity, String title, String message, String productSKU,
                 LocalDateTime timestamp, Boolean isRead, Boolean isDismissed, User user) {
        this.id = id;
        this.type = type;
        this.severity = severity;
        this.title = title;
        this.message = message;
        this.productSKU = productSKU;
        this.timestamp = timestamp;
        this.isRead = isRead;
        this.isDismissed = isDismissed;
        this.user = user;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
    
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getProductSKU() { return productSKU; }
    public void setProductSKU(String productSKU) { this.productSKU = productSKU; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    
    public Boolean getIsDismissed() { return isDismissed; }
    public void setIsDismissed(Boolean isDismissed) { this.isDismissed = isDismissed; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public enum Type {
        LOW_STOCK("Low Stock"),
        OUT_OF_STOCK("Out of Stock"),
        EXPIRY_WARNING("Expiry Warning"),
        VENDOR_RESPONSE("Vendor Response"),
        RESTOCK_REQUIRED("Restock Required"),
        SYSTEM("System");
        
        private final String displayName;
        
        Type(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum Severity {
        HIGH, MEDIUM, LOW
    }
}
