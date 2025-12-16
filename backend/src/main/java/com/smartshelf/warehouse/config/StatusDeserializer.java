package com.smartshelf.warehouse.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.smartshelf.warehouse.entity.InventoryItem;
import java.io.IOException;

public class StatusDeserializer extends JsonDeserializer<InventoryItem.Status> {
    
    @Override
    public InventoryItem.Status deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        
        // Handle both "In Stock" and "IN_STOCK" formats
        switch (value) {
            case "In Stock":
            case "IN_STOCK":
                return InventoryItem.Status.IN_STOCK;
            case "Low Stock":
            case "LOW_STOCK":
                return InventoryItem.Status.LOW_STOCK;
            case "Out of Stock":
            case "OUT_OF_STOCK":
                return InventoryItem.Status.OUT_OF_STOCK;
            case "Overstocked":
            case "OVERSTOCKED":
                return InventoryItem.Status.OVERSTOCKED;
            default:
                throw new IllegalArgumentException("Unknown status: " + value);
        }
    }
}
