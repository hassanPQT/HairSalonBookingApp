package com.example.hairSalonBooking.model.request;

import com.example.hairSalonBooking.entity.Shift;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class SpecificStylistScheduleRequest {
    long stylistId;
    LocalDate workingDate;
    Set<Long> shiftId;
}
