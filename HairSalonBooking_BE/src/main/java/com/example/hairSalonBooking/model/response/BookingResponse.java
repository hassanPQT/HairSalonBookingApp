package com.example.hairSalonBooking.model.response;

import com.example.hairSalonBooking.entity.SalonService;
import com.example.hairSalonBooking.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    long id;
    long customerId;
    String customerName;
    String customerPhone;
    String salonName;
    String stylistName;
    LocalDate date;
    LocalTime time;


    String voucherCode;


    Set<Long> serviceId;

    BookingStatus status;
}
