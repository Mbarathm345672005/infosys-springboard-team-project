package com.smartshelf.warehouse.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.smartshelf.warehouse.entity.Transaction;

import java.io.IOException;

public class TransactionTypeDeserializer extends JsonDeserializer<Transaction.Type> {
    
    @Override
    public Transaction.Type deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        
        // Handle both "Stock-In"/"Stock-Out" and "STOCK_IN"/"STOCK_OUT"
        if (value == null || value.isEmpty()) {
            throw new IOException("Transaction type cannot be null or empty");
        }
        
        // Normalize the input
        String normalized = value.toUpperCase().replace("-", "_");
        
        try {
            return Transaction.Type.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            // Try display name match
            for (Transaction.Type type : Transaction.Type.values()) {
                if (type.getDisplayName().equalsIgnoreCase(value)) {
                    return type;
                }
            }
            throw new IOException("Invalid transaction type: " + value);
        }
    }
}
