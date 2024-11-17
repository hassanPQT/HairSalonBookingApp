package com.example.hairSalonBooking.model.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateBookingForStylistBusyRequest {
    long stylistScheduleId;
    Set<Long> shiftId;

}
