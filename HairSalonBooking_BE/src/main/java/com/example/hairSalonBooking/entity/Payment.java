package com.example.hairSalonBooking.entity;


import jakarta.persistence.*;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

import java.util.Set;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long paymentId;
    double paymentAmount;
    LocalDate paymentDate;
    String paymentMethod;
    String paymentStatus;
    String transactionId;
    @OneToOne
    @JoinColumn(name = "booking_id")
    Booking booking;

    @OneToMany(mappedBy = "payment")
    Set<Transactions> transactions;

}