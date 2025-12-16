package com.smartshelf.warehouse.dto;

public class UserDTO {
    private String id;
    private String fullName;
    private String email;
    private String companyName;
    private String contactNumber;
    private String role;
    private String warehouseLocation;
    
    public UserDTO() {}
    
    public UserDTO(String id, String fullName, String email, String companyName, 
                   String contactNumber, String role, String warehouseLocation) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.companyName = companyName;
        this.contactNumber = contactNumber;
        this.role = role;
        this.warehouseLocation = warehouseLocation;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getWarehouseLocation() { return warehouseLocation; }
    public void setWarehouseLocation(String warehouseLocation) { this.warehouseLocation = warehouseLocation; }
}
