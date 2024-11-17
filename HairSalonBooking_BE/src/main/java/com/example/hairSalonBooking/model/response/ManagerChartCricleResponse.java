package com.example.hairSalonBooking.model.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class ManagerChartCricleResponse {
    String name;
    String value;
}
