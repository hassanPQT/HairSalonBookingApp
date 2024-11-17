package com.example.hairSalonBooking.model.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Data

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddShiftRequest {
    List<SpecificStylistScheduleRequest> request;
}
