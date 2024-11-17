package com.example.hairSalonBooking.service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.time.LocalTime;

public class LocalTimeDeserializer extends JsonDeserializer<LocalTime> {

    @Override
    public LocalTime deserialize(JsonParser jsonParser, DeserializationContext context)
            throws IOException, JsonProcessingException {
        // Đọc giá trị JSON và tạo JsonNode
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);

        // Đọc các trường hour, minute, second và nano từ JSON
        int hour = node.get("hour").asInt();
        int minute = node.get("minute").asInt();
        int second = node.get("second").asInt();
        int nano = node.get("nano").asInt();

        // Tạo LocalTime từ các giá trị đã đọc
        return LocalTime.of(hour, minute, second, nano);
    }
}