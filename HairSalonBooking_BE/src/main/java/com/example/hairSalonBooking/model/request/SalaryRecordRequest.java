package com.example.hairSalonBooking.model.request;


import com.example.hairSalonBooking.entity.Account;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SalaryRecordRequest {
    double bonusSalary;
    String monthAndYear;
    double totalSalary;
    long stylistId;
}