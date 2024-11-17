package com.example.hairSalonBooking.model.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalaryResponse {
    private long stylistId;
    private String stylistName;
    private String month;
    private double salary;
    private double bonus;
    private double totalSalary;
}