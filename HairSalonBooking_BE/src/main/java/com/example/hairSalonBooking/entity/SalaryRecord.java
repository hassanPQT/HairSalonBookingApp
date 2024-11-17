package com.example.hairSalonBooking.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class SalaryRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long salaryRecordId;
    double bonusSalary;
    String monthAndYear;
    double totalSalary;

    @ManyToOne
    @JoinColumn(name = "account_id")
    Account account;
}