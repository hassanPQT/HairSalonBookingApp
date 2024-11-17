package com.example.hairSalonBooking.model.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CreateNewBookingSuccess {
    String to;
    String subject;
    LocalDate date;
    LocalTime time;
    String stylistName;
    String salonAddress;
}
