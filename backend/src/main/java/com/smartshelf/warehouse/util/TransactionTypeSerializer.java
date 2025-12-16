package com.smartshelf.warehouse.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.smartshelf.warehouse.entity.Transaction;

import java.io.IOException;

public class TransactionTypeSerializer extends JsonSerializer<Transaction.Type> {
    
    @Override
    public void serialize(Transaction.Type value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.getDisplayName());
    }
}
