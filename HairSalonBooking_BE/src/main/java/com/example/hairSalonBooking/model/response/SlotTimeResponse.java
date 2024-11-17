package com.example.hairSalonBooking.model.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotTimeResponse {
    LocalTime timeStart;
    LocalTime timeEnd;
    LocalTime timeBetween;
}
