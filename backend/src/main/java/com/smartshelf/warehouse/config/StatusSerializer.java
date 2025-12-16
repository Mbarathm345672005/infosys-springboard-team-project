package com.smartshelf.warehouse.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.smartshelf.warehouse.entity.InventoryItem;
import java.io.IOException;

public class StatusSerializer extends JsonSerializer<InventoryItem.Status> {
    
    @Override
    public void serialize(InventoryItem.Status value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.getDisplayName());
    }
}
