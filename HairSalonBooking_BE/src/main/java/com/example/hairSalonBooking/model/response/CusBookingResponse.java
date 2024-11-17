package com.example.hairSalonBooking.model.response;

import com.example.hairSalonBooking.entity.SalonService;
import com.example.hairSalonBooking.enums.BookingStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CusBookingResponse {
    long bookingId;
    String salonName;
    String stylistName;
    LocalDate date;
    LocalTime time;
    Set<SalonServiceCusResponse> serviceName;
    //String voucherCode;
    @Enumerated(EnumType.STRING)
    BookingStatus status;
}
