package com.example.hairSalonBooking.model.request;

import com.example.hairSalonBooking.entity.SalonService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequest {
    long salonId;
    long customerId;
    long slotId;
    LocalDate bookingDate;
    Set<Long> serviceId;
    long stylistId;
    long voucherId;
}
