package com.example.hairSalonBooking.model.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateSlotRequest {
    LocalTime time;
}
