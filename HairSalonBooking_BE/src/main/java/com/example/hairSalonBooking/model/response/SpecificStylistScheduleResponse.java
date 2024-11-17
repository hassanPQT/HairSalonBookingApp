package com.example.hairSalonBooking.model.response;

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
public class SpecificStylistScheduleResponse {
    long id;
    String stylistName;
    LocalDate workingDate;
    Set<Long> shiftId;
}
